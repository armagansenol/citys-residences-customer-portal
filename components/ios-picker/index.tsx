"use client"

import { LocaleTransitionLink } from "@/components/locale-transition-link"
import { LoadingSpinner } from "@/components/loading-spinner"
import { cn } from "@/lib/utils"
import { ArrowRightIcon } from "@phosphor-icons/react"
import type { EmblaCarouselType } from "embla-carousel"
import useEmblaCarousel from "embla-carousel-react"
import React, { useCallback, useEffect, useRef, useState } from "react"

const LAST_VISITED_ROUTE_KEY = "ios-picker-last-route"
import styles from "./styles.module.css"
import { routeConfig, SectionId } from "@/lib/constants"
import { useStore } from "@/lib/store/ui"

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
  isModal?: boolean
  isLoading?: boolean
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

export function IosPickerItem(props: IosPickerItemProps) {
  const { items, perspective = "center", loop = false, onSelect, initialIndex = 0, className, onReady } = props
  const setIsCitysLivingModalOpen = useStore((state) => state.setIsCitysLivingModalOpen)
  const setIsMasterplanModalOpen = useStore((state) => state.setIsMasterplanModalOpen)
  const setIsResidencePlanModalOpen = useStore((state) => state.setIsResidencePlanModalOpen)
  // Duplicate items to fill the wheel (original example expects many items)
  const duplicatedItems = [...items]
  const slideCount = duplicatedItems.length
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop,
    axis: "y",
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
            {duplicatedItems.map((item, index) => {
              const isResidencePlan =
                item.id === routeConfig["/residence-plan"].id || (item.isModal && item.id === SectionId.RESIDENCE_PLAN)
              const isCitysLiving =
                item.id === SectionId.CITYS_LIVING || (item.isModal && item.id === SectionId.CITYS_LIVING)
              const isMasterplan =
                item.id === SectionId.MASTERPLAN || (item.isModal && item.id === SectionId.MASTERPLAN)

              if (isCitysLiving) {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (!item.disabled) {
                        setIsCitysLivingModalOpen(true)
                        if (item.id) {
                          sessionStorage.setItem(LAST_VISITED_ROUTE_KEY, item.id)
                        }
                      }
                    }}
                    disabled={item.disabled}
                    className={cn(
                      styles.slide,
                      "text-gray-500",
                      "size-full",
                      "text-[7vw]/[1] md:text-[4vw]/[1] lg:text-[3.5vw]/[1] font-regular",
                      "flex items-center justify-start",
                      "text-left",
                      "px-14 md:px-[15vw] lg:px-[14vw]",
                      "transition-colors duration-300",
                      {
                        [styles.disabled]: item.disabled,
                      }
                    )}
                  >
                    {item.title}
                  </button>
                )
              }

              if (isMasterplan) {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (!item.disabled) {
                        setIsMasterplanModalOpen(true)
                        if (item.id) {
                          sessionStorage.setItem(LAST_VISITED_ROUTE_KEY, item.id)
                        }
                      }
                    }}
                    disabled={item.disabled}
                    className={cn(
                      styles.slide,
                      "text-gray-500",
                      "size-full",
                      "text-[7vw]/[1] md:text-[4vw]/[1] lg:text-[3.5vw]/[1] font-regular",
                      "flex items-center justify-start",
                      "text-left",
                      "px-14 md:px-[15vw] lg:px-[14vw]",
                      "transition-colors duration-300",
                      {
                        [styles.disabled]: item.disabled,
                      }
                    )}
                  >
                    {item.title}
                  </button>
                )
              }

              if (isResidencePlan) {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (!item.disabled) {
                        setIsResidencePlanModalOpen(true)
                        if (item.id) {
                          sessionStorage.setItem(LAST_VISITED_ROUTE_KEY, item.id)
                        }
                      }
                    }}
                    disabled={item.disabled}
                    className={cn(
                      styles.slide,
                      "text-gray-500",
                      "size-full",
                      "text-[7vw]/[1] md:text-[4vw]/[1] lg:text-[3.5vw]/[1] font-regular",
                      "flex items-center justify-start gap-3",
                      "text-left",
                      "px-14 md:px-[15vw] lg:px-[14vw]",
                      "transition-colors duration-300",
                      {
                        [styles.disabled]: item.disabled,
                      }
                    )}
                  >
                    {item.title}
                    {item.isLoading && <LoadingSpinner className='size-5 text-bricky-brick' />}
                  </button>
                )
              }

              return (
                <LocaleTransitionLink
                  href={isResidencePlan ? "#" : item.href}
                  {...(item.isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                  onClick={() => {
                    // Store the item id before navigation so we can restore position on return
                    if (item.id && !item.disabled && !isResidencePlan) {
                      sessionStorage.setItem(LAST_VISITED_ROUTE_KEY, item.id)
                    }
                  }}
                  className={cn(
                    styles.slide,
                    "text-gray-500",
                    "size-full",
                    "text-[7vw]/[1] md:text-[4vw]/[1] lg:text-[3.5vw]/[1] font-regular",
                    "flex items-center justify-start",
                    "text-left",
                    "px-14 md:px-[15vw] lg:px-[14vw]",
                    "transition-colors duration-300",
                    {
                      [styles.disabled]: item.disabled,
                      "pointer-events-none!": isResidencePlan,
                    }
                  )}
                  key={index}
                >
                  {item.title}
                </LocaleTransitionLink>
              )
            })}
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
  const [pickerKey, setPickerKey] = useState(() => Date.now())
  const containerRef = useRef<HTMLDivElement>(null)

  // Always start at the first item (index 0)
  const currentInitialIndex = initialIndex

  // Track when animation has completed
  const handleReady = useCallback(() => {
    setIsReady(true)
  }, [])

  return (
    <div
      ref={containerRef}
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
        key={pickerKey}
        items={items}
        perspective='center'
        loop={loop}
        onSelect={onSelect}
        initialIndex={currentInitialIndex}
        onReady={handleReady}
      />
    </div>
  )
}
