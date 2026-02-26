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
const WHEEL_ITEM_COUNT = 18 // Wheel geometry - controls curvature
const WHEEL_ITEMS_IN_VIEW = 4 // Visible arc size

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
  onEmblaApi?: (api: EmblaCarouselType | undefined) => void
}

export function IosPickerItem(props: IosPickerItemProps) {
  const {
    items,
    perspective = "center",
    loop = false,
    onSelect,
    initialIndex = 0,
    className,
    onReady,
    onEmblaApi,
  } = props

  const [wheelItemSize, setWheelItemSize] = useState(50)

  useEffect(() => {
    const checkOrientation = () => {
      if (window.innerHeight < 500 && window.innerWidth > window.innerHeight) {
        setWheelItemSize(45)
      } else {
        setWheelItemSize(50)
      }
    }
    checkOrientation()
    window.addEventListener("resize", checkOrientation)
    return () => window.removeEventListener("resize", checkOrientation)
  }, [])

  const wheelItemRadius = CIRCLE_DEGREES / WHEEL_ITEM_COUNT
  const inViewDegrees = wheelItemRadius * WHEEL_ITEMS_IN_VIEW
  const wheelRadius = Math.round(wheelItemSize / 2 / Math.tan(Math.PI / WHEEL_ITEM_COUNT))

  const setIsCitysLivingModalOpen = useStore((state) => state.setIsCitysLivingModalOpen)
  const setIsMasterplanModalOpen = useStore((state) => state.setIsMasterplanModalOpen)
  const setIsResidencePlanModalOpen = useStore((state) => state.setIsResidencePlanModalOpen)

  const duplicatedItems = React.useMemo(() => [...items], [items])
  const slideCount = duplicatedItems.length

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop,
    axis: "y",
    containScroll: false,
    watchSlides: false,
    startIndex: initialIndex,
  })

  const rootNodeRef = useRef<HTMLDivElement>(null)
  const totalRadius = slideCount * wheelItemRadius
  const rotationOffset = loop ? 0 : wheelItemRadius
  const [isReady, setIsReady] = useState(false)

  const isInView = useCallback(
    (wheelLocation: number, slidePosition: number): boolean => Math.abs(wheelLocation - slidePosition) < inViewDegrees,
    [inViewDegrees]
  )

  const setSlideStyles = useCallback(
    (emblaApi: EmblaCarouselType, index: number, loop: boolean, slideCount: number, totalRadius: number): boolean => {
      const slideNode = emblaApi.slideNodes()[index]
      if (!slideNode) return false

      const wheelLocation = emblaApi.scrollProgress() * totalRadius
      const positionDefault = emblaApi.scrollSnapList()[index] * totalRadius
      const positionLoopStart = positionDefault + totalRadius
      const positionLoopEnd = positionDefault - totalRadius

      let inView = false
      let angle = index * -wheelItemRadius
      let distanceFromCenter = Math.abs(wheelLocation - positionDefault)

      if (isInView(wheelLocation, positionDefault)) {
        inView = true
      }

      if (loop && isInView(wheelLocation, positionLoopEnd)) {
        inView = true
        angle = -CIRCLE_DEGREES + (slideCount - index) * wheelItemRadius
        distanceFromCenter = Math.abs(wheelLocation - positionLoopEnd)
      }

      if (loop && isInView(wheelLocation, positionLoopStart)) {
        inView = true
        angle = -(totalRadius % CIRCLE_DEGREES) - index * wheelItemRadius
        distanceFromCenter = Math.abs(wheelLocation - positionLoopStart)
      }

      const isActive = distanceFromCenter < wheelItemRadius / 2

      if (inView) {
        slideNode.style.opacity = "1"
        slideNode.style.transform = `translateY(-${index * 100}%) rotateX(${angle}deg) translateZ(${wheelRadius}px)`
        slideNode.style.color = isActive ? "#CC4429" : ""
        slideNode.style.pointerEvents = isActive ? "auto" : "none"
      } else {
        slideNode.style.opacity = "0"
        slideNode.style.transform = "none"
        slideNode.style.color = ""
        slideNode.style.pointerEvents = "none"
      }

      return isActive
    },
    [wheelItemRadius, wheelRadius, isInView]
  )

  const setContainerStyles = useCallback(
    (emblaApi: EmblaCarouselType, wheelRotation: number): void => {
      const container = emblaApi.containerNode()
      if (container) {
        container.style.transform = `translateZ(${wheelRadius}px) rotateX(${wheelRotation}deg)`
      }
    },
    [wheelRadius]
  )

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
        return item.href
      }
      return null
    },
    [duplicatedItems, setIsCitysLivingModalOpen, setIsMasterplanModalOpen, setIsResidencePlanModalOpen]
  )

  const getDistanceFromCenter = useCallback(
    (emblaApi: EmblaCarouselType, index: number, loop: boolean, totalRadius: number): number => {
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
    },
    [isInView]
  )

  const createButtonClickHandler = useCallback(
    (itemIndex: number) => (e: React.MouseEvent) => {
      if (!emblaApi) return

      const dist = getDistanceFromCenter(emblaApi, itemIndex, loop, totalRadius)
      const isSnapMatch = emblaApi.selectedScrollSnap() === itemIndex

      if (!isSnapMatch && dist > wheelItemRadius / 2) {
        e.preventDefault()
        emblaApi.scrollTo(itemIndex)
        return
      }

      e.preventDefault()
      executeItemAction(itemIndex)
    },
    [emblaApi, executeItemAction, loop, totalRadius, getDistanceFromCenter, wheelItemRadius]
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
      const rotation = slideCount * wheelItemRadius - rotationOffset
      const wheelRotation = rotation * emblaApi.scrollProgress()
      setContainerStyles(emblaApi, wheelRotation)
      emblaApi.slideNodes().forEach((_, index) => {
        setSlideStyles(emblaApi, index, loop, slideCount, totalRadius)
      })
    },
    [slideCount, rotationOffset, totalRadius, loop, setContainerStyles, setSlideStyles, wheelItemRadius]
  )

  useEffect(() => {
    onEmblaApi?.(emblaApi)
  }, [emblaApi, onEmblaApi])

  useEffect(() => {
    if (!emblaApi) return

    const handlePointerUp = (emblaApi: EmblaCarouselType) => {
      const { scrollTo, target, location } = emblaApi.internalEngine()
      const diffToTarget = target.get() - location.get()
      const factor = Math.abs(diffToTarget) < wheelItemSize / 2.5 ? 10 : 0.1
      const distance = diffToTarget * factor
      scrollTo.distance(distance, true)
    }

    const handleSettle = () => {
      if (onSelect && emblaApi) {
        const selectedIndex = emblaApi.selectedScrollSnap()
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
  }, [emblaApi, inactivateEmblaTransform, rotateWheel, onSelect, items, wheelItemSize, onReady])

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

              if (isCitysLiving || isMasterplan || isResidencePlan) {
                return (
                  <button
                    key={index}
                    type='button'
                    onClick={createButtonClickHandler(index)}
                    disabled={item.disabled}
                    className={cn(
                      styles.slide,
                      "text-gray-500",
                      "size-full",
                      "text-[7vw]/[1] md:text-[4vw]/[1] lg:text-[3.5vw]/[1] font-regular",
                      "[@media(orientation:landscape)_and_(max-height:500px)]:text-[20px]",
                      "flex items-center justify-start",
                      "text-left",
                      "px-14 md:px-[15vw] lg:px-[14vw] [@media(orientation:landscape)_and_(max-height:500px)]:px-10",
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

              if (item.isExternal) {
                return (
                  <a
                    href={item.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    onClick={(e) => {
                      if (!emblaApi) return

                      const dist = getDistanceFromCenter(emblaApi, index, loop, totalRadius)
                      const isSnapMatch = emblaApi.selectedScrollSnap() === index

                      if (!isSnapMatch && dist > wheelItemRadius / 2) {
                        e.preventDefault()
                        emblaApi.scrollTo(index)
                        return
                      }

                      if (item.id) {
                        sessionStorage.setItem(LAST_VISITED_ROUTE_KEY, item.id)
                      }
                    }}
                    className={cn(
                      styles.slide,
                      "text-gray-500",
                      "size-full",
                      "text-[7vw]/[1] md:text-[4vw]/[1] lg:text-[3.5vw]/[1] font-regular",
                      "[@media(orientation:landscape)_and_(max-height:500px)]:text-[20px]",
                      "flex items-center justify-start",
                      "text-left",
                      "px-14 md:px-[15vw] lg:px-[14vw] [@media(orientation:landscape)_and_(max-height:500px)]:px-10",
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

              return (
                <LocaleTransitionLink
                  href={item.href}
                  onClick={(e) => {
                    if (!emblaApi) return

                    const dist = getDistanceFromCenter(emblaApi, index, loop, totalRadius)
                    const isSnapMatch = emblaApi.selectedScrollSnap() === index

                    if (!isSnapMatch && dist > wheelItemRadius / 2) {
                      e.preventDefault()
                      emblaApi.scrollTo(index)
                      return
                    }

                    if (item.id) {
                      sessionStorage.setItem(LAST_VISITED_ROUTE_KEY, item.id)
                    }
                  }}
                  className={cn(
                    styles.slide,
                    "text-gray-500",
                    "size-full",
                    "text-[7vw]/[1] md:text-[4vw]/[1] lg:text-[3.5vw]/[1] font-regular",
                    "[@media(orientation:landscape)_and_(max-height:500px)]:text-[20px]",
                    "flex items-center justify-start",
                    "text-left",
                    "px-14 md:px-[15vw] lg:px-[14vw] [@media(orientation:landscape)_and_(max-height:500px)]:px-10",
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
  const [pickerKey] = useState(() => Date.now())
  const containerRef = useRef<HTMLDivElement>(null)
  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | undefined>(undefined)
  const [wheelItemSize, setWheelItemSize] = useState(50)

  useEffect(() => {
    const checkOrientation = () => {
      if (window.innerHeight < 500 && window.innerWidth > window.innerHeight) {
        setWheelItemSize(45)
      } else {
        setWheelItemSize(50)
      }
    }
    checkOrientation()
    window.addEventListener("resize", checkOrientation)
    return () => window.removeEventListener("resize", checkOrientation)
  }, [])

  const handleReady = useCallback(() => {
    setIsReady(true)
  }, [])

  // const scrollPrev = useCallback(() => {
  //   emblaApi?.scrollPrev()
  // }, [emblaApi])

  // const scrollNext = useCallback(() => {
  //   emblaApi?.scrollNext()
  // }, [emblaApi])

  return (
    <div
      ref={containerRef}
      className={cn(styles.embla, className, "transition-opacity duration-500", {
        "opacity-0": !isReady,
        "opacity-100": isReady,
      })}
      style={
        {
          "--wheel-item-size": `${wheelItemSize}px`,
          "--pseudo-opacity": isReady ? "1" : "0",
        } as React.CSSProperties
      }
    >
      <button
        type='button'
        className={styles.overlayTop}
        // onClick={scrollPrev} aria-label='Scroll up'
      />
      <IosPickerItem
        key={pickerKey}
        items={items}
        perspective='center'
        loop={loop}
        onSelect={onSelect}
        initialIndex={initialIndex}
        onReady={handleReady}
        onEmblaApi={setEmblaApi}
      />
      <button
        type='button'
        className={styles.overlayBottom}
        // onClick={scrollNext} aria-label='Scroll down'
      />
    </div>
  )
}
