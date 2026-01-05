"use client"

import { cn } from "@/lib/utils"
import { ArrowRightIcon } from "@phosphor-icons/react"
import type { EmblaCarouselType } from "embla-carousel"
import useEmblaCarousel from "embla-carousel-react"
import React, { useCallback, useEffect, useRef, useState } from "react"

import { LocaleTransitionLink } from "@/components/locale-transition-link"
import { LoadingSpinner } from "@/components/loading-spinner"

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

const getDistanceFromCenter = (
  emblaApi: EmblaCarouselType,
  index: number,
  loop: boolean,
  slideCount: number,
  totalRadius: number
): number => {
  const wheelLocation = emblaApi.scrollProgress() * totalRadius
  const positionDefault = emblaApi.scrollSnapList()[index] * totalRadius
  const positionLoopStart = positionDefault + totalRadius
  const positionLoopEnd = positionDefault - totalRadius

  let distanceFromCenter = Math.abs(wheelLocation - positionDefault)

  if (loop && isInView(wheelLocation, positionLoopEnd)) {
    distanceFromCenter = Math.abs(wheelLocation - positionLoopEnd)
  }

  if (loop && isInView(wheelLocation, positionLoopStart)) {
    distanceFromCenter = Math.abs(wheelLocation - positionLoopStart)
  }

  return distanceFromCenter
}

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
    // Only allow clicking on the active (centered) item
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
  const [isReady, setIsReady] = useState(false)

  // Execute action for a specific item by its index
  const executeItemAction = useCallback(
    (itemIndex: number) => {
      const item = duplicatedItems[itemIndex]
      if (!item || item.disabled) return

      const isResidencePlan =
        item.id === routeConfig["/residence-plan"].id || (item.isModal && item.id === SectionId.RESIDENCE_PLAN)
      const isCitysLiving = item.id === SectionId.CITYS_LIVING || (item.isModal && item.id === SectionId.CITYS_LIVING)
      const isMasterplan = item.id === SectionId.MASTERPLAN || (item.isModal && item.id === SectionId.MASTERPLAN)

      if (item.id) {
        sessionStorage.setItem(LAST_VISITED_ROUTE_KEY, item.id)
      }

      if (isCitysLiving) {
        setIsCitysLivingModalOpen(true)
      } else if (isMasterplan) {
        setIsMasterplanModalOpen(true)
      } else if (isResidencePlan) {
        setIsResidencePlanModalOpen(true)
      } else {
        // For regular links, we need to navigate programmatically
        // Return the href so the caller can handle navigation
        return item.href
      }
      return null
    },
    [duplicatedItems, setIsCitysLivingModalOpen, setIsMasterplanModalOpen, setIsResidencePlanModalOpen]
  )

  // Create a click handler for modal items (buttons) that uses element index
  const createButtonClickHandler = useCallback(
    (itemIndex: number) => (e: React.MouseEvent) => {
      if (!emblaApi) return

      const dist = getDistanceFromCenter(emblaApi, itemIndex, loop, slideCount, totalRadius)
      const isSnapMatch = emblaApi.selectedScrollSnap() === itemIndex

      // If clicking on this item but it's not the center item (neither visually nor logically), scroll to it
      if (!isSnapMatch && dist > WHEEL_ITEM_RADIUS / 2) {
        e.preventDefault()
        emblaApi.scrollTo(itemIndex)
        return
      }

      // Clicking on the center item - execute its action
      e.preventDefault()
      executeItemAction(itemIndex)
    },
    [emblaApi, executeItemAction, loop, slideCount, totalRadius]
  )

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
              // All items use the same unified click handler
              // Modal items (CityLiving, Masterplan, ResidencePlan) are rendered as buttons
              if (isCitysLiving || isMasterplan || isResidencePlan) {
                return (
                  <button
                    key={index}
                    onClick={createButtonClickHandler(index)}
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
                        "gap-3": isResidencePlan,
                      }
                    )}
                  >
                    {item.title}
                    {isResidencePlan && item.isLoading && <LoadingSpinner className='size-5 text-bricky-brick' />}
                  </button>
                )
              }
              // External links use plain <a> tag (Next.js Link doesn't handle external URLs well)
              if (item.isExternal) {
                return (
                  <a
                    href={item.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    onClick={(e) => {
                      if (!emblaApi) return

                      const dist = getDistanceFromCenter(emblaApi, index, loop, slideCount, totalRadius)
                      const isSnapMatch = emblaApi.selectedScrollSnap() === index

                      if (!isSnapMatch && dist > WHEEL_ITEM_RADIUS / 2) {
                        e.preventDefault()
                        emblaApi.scrollTo(index)
                        return
                      }

                      // Clicking on the center item - save to session storage and let anchor handle navigation
                      if (item.id) {
                        sessionStorage.setItem(LAST_VISITED_ROUTE_KEY, item.id)
                      }
                      // Don't prevent default - anchor will open in new tab
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
                      }
                    )}
                    key={index}
                  >
                    {item.title}
                  </a>
                )
              }
              // Regular internal navigation links
              return (
                <LocaleTransitionLink
                  href={item.href}
                  onClick={(e) => {
                    if (!emblaApi) return

                    const dist = getDistanceFromCenter(emblaApi, index, loop, slideCount, totalRadius)
                    const isSnapMatch = emblaApi.selectedScrollSnap() === index

                    if (!isSnapMatch && dist > WHEEL_ITEM_RADIUS / 2) {
                      e.preventDefault()
                      emblaApi.scrollTo(index)
                      return
                    }

                    // Clicking on the center item - save to session storage and let link handle navigation
                    if (item.id) {
                      sessionStorage.setItem(LAST_VISITED_ROUTE_KEY, item.id)
                    }
                    // Don't prevent default - link will navigate
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
