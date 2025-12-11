"use client"

import React, { useEffect, useCallback, useRef } from "react"
import type { EmblaCarouselType } from "embla-carousel"
import useEmblaCarousel from "embla-carousel-react"
import { cn } from "@/lib/utils"
import styles from "./styles.module.css"

const CIRCLE_DEGREES = 360 // Total degrees of the wheel (360 = full circle)
const WHEEL_ITEM_SIZE = 50 // Height of each item in pixels
const WHEEL_ITEM_COUNT = 16 // Total slots on the wheel (affects angle between items)
const WHEEL_ITEMS_IN_VIEW = 4 // Number of items visible at once

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
): void => {
  const slideNode = emblaApi.slideNodes()[index]
  const wheelLocation = emblaApi.scrollProgress() * totalRadius
  const positionDefault = emblaApi.scrollSnapList()[index] * totalRadius
  const positionLoopStart = positionDefault + totalRadius
  const positionLoopEnd = positionDefault - totalRadius

  let inView = false
  let angle = index * -WHEEL_ITEM_RADIUS

  if (isInView(wheelLocation, positionDefault)) {
    inView = true
  }

  if (loop && isInView(wheelLocation, positionLoopEnd)) {
    inView = true
    angle = -CIRCLE_DEGREES + (slideCount - index) * WHEEL_ITEM_RADIUS
  }

  if (loop && isInView(wheelLocation, positionLoopStart)) {
    inView = true
    angle = -(totalRadius % CIRCLE_DEGREES) - index * WHEEL_ITEM_RADIUS
  }

  if (inView) {
    slideNode.style.opacity = "1"
    slideNode.style.transform = `translateY(-${index * 100}%) rotateX(${angle}deg) translateZ(${WHEEL_RADIUS}px)`
  } else {
    slideNode.style.opacity = "0"
    slideNode.style.transform = "none"
  }
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
}

export const IosPickerItem: React.FC<IosPickerItemProps> = (props) => {
  const { items, perspective = "center", loop = false, onSelect, initialIndex = 0, className } = props
  // Use actual rendered slide count (items are NOT duplicated anymore)
  const slideCount = items.length
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
      emblaApi.slideNodes().forEach((_, index) => {
        setSlideStyles(emblaApi, index, loop, slideCount, totalRadius)
      })
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
        const selectedItem = items[selectedIndex]
        if (selectedItem) {
          onSelect(selectedItem, selectedIndex)
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

    return () => {
      emblaApi.off("pointerUp", handlePointerUp)
      emblaApi.off("scroll", rotateWheel)
      emblaApi.off("settle", handleSettle)
    }
  }, [emblaApi, inactivateEmblaTransform, rotateWheel, onSelect, items])

  return (
    <div className={cn(styles.iosPicker, className)}>
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
            {[...items, ...items, ...items, ...items].map((item, index) => (
              <div
                className={cn(
                  styles.slide,
                  "text-bricky-brick",
                  "size-full",
                  "text-4xl/[1] font-regular",
                  "flex items-center justify-start",
                  "text-left",
                  "px-12",
                  {
                    [styles.disabled]: item.disabled,
                  }
                )}
                key={index}
              >
                {item.title}
              </div>
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
  return (
    <div
      className={cn(styles.embla, className)}
      style={{ "--wheel-item-size": `${WHEEL_ITEM_SIZE}px` } as React.CSSProperties}
    >
      <IosPickerItem items={items} perspective='center' loop={loop} onSelect={onSelect} initialIndex={initialIndex} />
    </div>
  )
}

export default IosPicker
