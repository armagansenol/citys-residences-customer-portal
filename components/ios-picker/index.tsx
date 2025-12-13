"use client"

import { LocaleTransitionLink } from "@/components/locale-transition-link"
import { Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { ArrowRightIcon } from "@phosphor-icons/react"
import type { EmblaCarouselType } from "embla-carousel"
import useEmblaCarousel from "embla-carousel-react"
import { useLocale } from "next-intl"
import React, { useCallback, useEffect, useRef, useState } from "react"
import styles from "./styles.module.css"

const CIRCLE_DEGREES = 360 // Total degrees of the wheel (360 = full circle)
const WHEEL_ITEM_SIZE = 50 // Height of each item in pixels
const WHEEL_ITEM_COUNT = 18 // Wheel geometry - controls curvature
const WHEEL_ITEMS_IN_VIEW = 4 // Visible arc size

export const WHEEL_ITEM_RADIUS = CIRCLE_DEGREES / WHEEL_ITEM_COUNT
export const IN_VIEW_DEGREES = WHEEL_ITEM_RADIUS * WHEEL_ITEMS_IN_VIEW
export const WHEEL_RADIUS = Math.round(WHEEL_ITEM_SIZE / 2 / Math.tan(Math.PI / WHEEL_ITEM_COUNT))

const isInView = (wheelLocation: number, slidePosition: number): boolean =>
  Math.abs(wheelLocation - slidePosition) < IN_VIEW_DEGREES

const setSlideStyles = (
  emblaApi: EmblaCarouselType,
  index: number,
  loop: boolean,
  slideCount: number,
  totalRadius: number
): boolean => {
  const slideNode = emblaApi.slideNodes()[index]
  const wheelLocation = emblaApi.scrollProgress() * totalRadius
  const positionDefault = emblaApi.scrollSnapList()[index] * totalRadius
  const positionLoopStart = positionDefault + totalRadius
  const positionLoopEnd = positionDefault - totalRadius

  let inView = false
  let angle = index * -WHEEL_ITEM_RADIUS
  let distanceFromCenter = Math.abs(wheelLocation - positionDefault)

  if (isInView(wheelLocation, positionDefault)) {
    inView = true
  }

  if (loop && isInView(wheelLocation, positionLoopEnd)) {
    inView = true
    angle = -CIRCLE_DEGREES + (slideCount - index) * WHEEL_ITEM_RADIUS
    distanceFromCenter = Math.abs(wheelLocation - positionLoopEnd)
  }

  if (loop && isInView(wheelLocation, positionLoopStart)) {
    inView = true
    angle = -(totalRadius % CIRCLE_DEGREES) - index * WHEEL_ITEM_RADIUS
    distanceFromCenter = Math.abs(wheelLocation - positionLoopStart)
  }

  // Check if this slide is the active one (closest to center)
  const isActive = distanceFromCenter < WHEEL_ITEM_RADIUS / 2

  if (inView) {
    slideNode.style.opacity = "1"
    slideNode.style.transform = `translateY(-${index * 100}%) rotateX(${angle}deg) translateZ(${WHEEL_RADIUS}px)`
    slideNode.style.color = isActive ? "#CC4429" : ""
    slideNode.style.pointerEvents = isActive ? "auto" : "none"
  } else {
    slideNode.style.opacity = "0"
    slideNode.style.transform = "none"
    slideNode.style.color = ""
    slideNode.style.pointerEvents = "none"
  }

  return isActive
}

export const setContainerStyles = (emblaApi: EmblaCarouselType, wheelRotation: number): void => {
  emblaApi.containerNode().style.transform = `translateZ(${WHEEL_RADIUS}px) rotateX(${wheelRotation}deg)`
}

export type NavigationItem = {
  title: string
  href: string
  id?: string
  disabled?: boolean
  isExternal?: boolean
}

type IosPickerItemProps = {
  loop?: boolean
  items: NavigationItem[]
  perspective?: "left" | "right" | "center"
  onSelect?: (item: NavigationItem, index: number) => void
  initialIndex?: number
  className?: string
  onReady?: () => void
}

export const IosPickerItem: React.FC<IosPickerItemProps> = (props) => {
  const { items, perspective = "center", loop = false, onSelect, initialIndex = 0, className, onReady } = props
  // Duplicate items to fill the wheel (original example expects many items)
  const duplicatedItems = [...items, ...items, ...items, ...items, ...items]
  const slideCount = duplicatedItems.length
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop,
    axis: "y",
    dragFree: true, // Must be true for custom snap logic in pointerUp
    containScroll: false,
    watchSlides: false,
    startIndex: initialIndex,
  })
  const rootNodeRef = useRef<HTMLDivElement>(null)
  const totalRadius = slideCount * WHEEL_ITEM_RADIUS
  const rotationOffset = loop ? 0 : WHEEL_ITEM_RADIUS
  const [activeSlideIndex, setActiveSlideIndex] = useState<number | null>(null)
  const [isReady, setIsReady] = useState(false)

  const inactivateEmblaTransform = useCallback((emblaApi: EmblaCarouselType) => {
    if (!emblaApi) return
    const { translate, slideLooper } = emblaApi.internalEngine()
    translate.clear()
    translate.toggleActive(false)
    slideLooper.loopPoints.forEach(({ translate }) => {
      translate.clear()
      translate.toggleActive(false)
    })
  }, [])

  const rotateWheel = useCallback(
    (emblaApi: EmblaCarouselType) => {
      const rotation = slideCount * WHEEL_ITEM_RADIUS - rotationOffset
      const wheelRotation = rotation * emblaApi.scrollProgress()
      setContainerStyles(emblaApi, wheelRotation)
      let activeIndex: number | null = null
      emblaApi.slideNodes().forEach((_, index) => {
        const isActive = setSlideStyles(emblaApi, index, loop, slideCount, totalRadius)
        if (isActive) {
          activeIndex = index
        }
      })
      if (activeIndex !== null) {
        setActiveSlideIndex(activeIndex)
      }
    },
    [slideCount, rotationOffset, totalRadius, loop]
  )

  useEffect(() => {
    if (!emblaApi) return

    const handlePointerUp = (emblaApi: EmblaCarouselType) => {
      const { scrollTo, target, location } = emblaApi.internalEngine()
      const diffToTarget = target.get() - location.get()
      const factor = Math.abs(diffToTarget) < WHEEL_ITEM_SIZE / 2.5 ? 10 : 0.1
      const distance = diffToTarget * factor
      scrollTo.distance(distance, true)
    }

    const handleSettle = () => {
      if (onSelect && emblaApi) {
        const selectedIndex = emblaApi.selectedScrollSnap()
        // Map back to original item index
        const originalIndex = selectedIndex % items.length
        const selectedItem = items[originalIndex]
        if (selectedItem) {
          onSelect(selectedItem, originalIndex)
        }
      }
    }

    emblaApi.on("pointerUp", handlePointerUp)
    emblaApi.on("scroll", rotateWheel)
    emblaApi.on("settle", handleSettle)
    emblaApi.on("reInit", (emblaApi) => {
      inactivateEmblaTransform(emblaApi)
      rotateWheel(emblaApi)
    })

    inactivateEmblaTransform(emblaApi)
    rotateWheel(emblaApi)
    // Mark as ready after initial setup and browser paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsReady(true)
        onReady?.()
      })
    })

    return () => {
      emblaApi.off("pointerUp", handlePointerUp)
      emblaApi.off("scroll", rotateWheel)
      emblaApi.off("settle", handleSettle)
    }
  }, [emblaApi, inactivateEmblaTransform, rotateWheel, onSelect, items])

  const locale = useLocale()

  return (
    <div className={cn(styles.iosPicker, className)}>
      {isReady && (
        <span className='absolute top-1/2 -translate-y-1/2 right-0 flex items-center justify-center rounded-full bg-bricky-brick size-8 p-1 xl:hidden ml-auto z-10 pointer-events-none'>
          <ArrowRightIcon weight='thin' className='text-white size-full ' />
        </span>
      )}
      <div className={styles.scene} ref={rootNodeRef}>
        <div
          className={cn(styles.viewport, {
            [styles.perspectiveLeft]: perspective === "left",
            [styles.perspectiveRight]: perspective === "right",
            [styles.perspectiveCenter]: perspective === "center",
          })}
          ref={emblaRef}
        >
          <div className={styles.container}>
            {duplicatedItems.map((item, index) => (
              <LocaleTransitionLink
                locale={locale as Locale}
                href={item.disabled ? "#" : item.href}
                {...(item.isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                className={cn(
                  styles.slide,
                  "text-gray-500",
                  "size-full",
                  "text-[7vw]/[1] font-regular",
                  "flex items-center justify-start",
                  "text-left",
                  "px-14",
                  "transition-colors duration-300",
                  {
                    [styles.disabled]: item.disabled,
                  }
                )}
                key={index}
              >
                {item.title}
              </LocaleTransitionLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

type IosPickerProps = {
  items: NavigationItem[]
  onSelect?: (item: NavigationItem, index: number) => void
  initialIndex?: number
  loop?: boolean
  className?: string
}

export const IosPicker: React.FC<IosPickerProps> = ({ items, onSelect, initialIndex = 0, loop = false, className }) => {
  const [isReady, setIsReady] = useState(false)

  return (
    <div
      className={cn(styles.embla, className, "transition-opacity duration-500", {
        "opacity-0": !isReady,
        "opacity-100": isReady,
      })}
      style={
        {
          "--wheel-item-size": `${WHEEL_ITEM_SIZE}px`,
          "--pseudo-opacity": isReady ? "1" : "0",
        } as React.CSSProperties
      }
    >
      <IosPickerItem
        items={items}
        perspective='center'
        loop={loop}
        onSelect={onSelect}
        initialIndex={initialIndex}
        onReady={() => setIsReady(true)}
      />
    </div>
  )
}

export default IosPicker
