"use client"

import { Logo } from "@/components/icons"
import { Image } from "@/components/image"
import { useEsc } from "@/hooks/useEsc"
import { useStore } from "@/lib/store/ui"
import { calculateRatio, cn, toAllUppercase } from "@/lib/utils"
import masterplanDrone from "@/public/img/masterplan-drone.jpg"
import { ArrowCounterClockwiseIcon, XIcon } from "@phosphor-icons/react"
import { useLenis } from "lenis/react"
import { AnimatePresence, motion } from "motion/react"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"

const hotspots = [
  {
    id: "c1",
    x: 18,
    y: 58,
    label: "C1",
    title: "C1 BLOK",
    description: "Yukarıdan bakan bir şehir deneyimi.",
    image: "/img/citys-block.png",
  },
  {
    id: "c2",
    x: 25,
    y: 53,
    label: "C2",
    title: "C2 BLOK",
    description: "Yukarıdan bakan bir şehir deneyimi.",
    image: "/img/citys-block.png",
  },
  {
    id: "c3",
    x: 31,
    y: 48,
    label: "C3",
    title: "C3 BLOK",
    description: "Yukarıdan bakan bir şehir deneyimi.",
    image: "/img/citys-block.png",
  },
  {
    id: "b5",
    x: 37,
    y: 44,
    label: "B5",
    title: "B5 BLOK",
    description: "Yukarıdan bakan bir şehir deneyimi.",
    image: "/img/citys-block.png",
  },
  {
    id: "b4",
    x: 45,
    y: 49,
    label: "B4",
    title: "B4 BLOK",
    description: "Yukarıdan bakan bir şehir deneyimi.",
    image: "/img/citys-block.png",
  },
  {
    id: "b3",
    x: 52,
    y: 44,
    label: "B3",
    title: "B3 BLOK",
    description: "Yukarıdan bakan bir şehir deneyimi.",
    image: "/img/citys-block.png",
  },
  {
    id: "b2",
    x: 60,
    y: 49,
    label: "B2",
    title: "B2 BLOK",
    description: "Yukarıdan bakan bir şehir deneyimi.",
    image: "/img/citys-block.png",
  },
  {
    id: "b1",
    x: 66,
    y: 44,
    label: "B1",
    title: "B1 BLOK",
    description: "Yukarıdan bakan bir şehir deneyimi.",
    image: "/img/citys-block.png",
  },
  {
    id: "a2",
    x: 72,
    y: 36.2,
    label: "A2",
    title: "A2 BLOK",
    description: "Yukarıdan bakan bir şehir deneyimi.",
    image: "/img/citys-block.png",
  },
  {
    id: "a1",
    x: 80,
    y: 50,
    label: "A1",
    title: "A1 BLOK",
    description: "Yukarıdan bakan bir şehir deneyimi.",
    image: "/img/citys-block.png",
  },
]

export function MasterplanModal() {
  const isOpen = useStore((state) => state.isMasterplanModalOpen)
  const setIsOpen = useStore((state) => state.setIsMasterplanModalOpen)
  const lenis = useLenis()
  const aspectRatio = calculateRatio(masterplanDrone.width, masterplanDrone.height)
  const [selectedHotspot, setSelectedHotspot] = useState<(typeof hotspots)[0] | null>(null)
  const [isPortrait, setIsPortrait] = useState(false)
  const tCommon = useTranslations("common")
  const locale = useLocale()

  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth < 1024
      const isPortraitMode = window.innerHeight > window.innerWidth
      setIsPortrait(isMobile && isPortraitMode)
    }

    checkOrientation()
    window.addEventListener("resize", checkOrientation)
    window.addEventListener("orientationchange", checkOrientation)

    return () => {
      window.removeEventListener("resize", checkOrientation)
      window.removeEventListener("orientationchange", checkOrientation)
    }
  }, [])

  useEsc(() => {
    if (selectedHotspot) {
      setSelectedHotspot(null)
    } else {
      setIsOpen(false)
    }
  }, isOpen)

  useEffect(() => {
    if (isOpen) {
      lenis?.stop()
      document.body.style.overflow = "hidden"
    } else {
      lenis?.start()
      document.body.style.overflow = ""
      setSelectedHotspot(null)
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen, lenis])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className='fixed inset-0 z-200 bg-black'
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className='fixed inset-0 z-201 overflow-hidden flex items-center justify-center'
            data-lenis-prevent
          >
            {/* Header */}
            <div className='h-header-height-mobile xl:h-header-height fixed top-0 left-0 right-0 z-202 flex items-center justify-between px-6 lg:px-16 xl:px-16 pointer-events-none'>
              <div className='flex items-center pointer-events-auto'>
                {/* Logo Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsOpen(false)
                  }}
                  className={cn(
                    "size-24 sm:size-24 lg:size-36",
                    "flex items-center justify-center",
                    "text-white",
                    "transition-opacity duration-300 hover:opacity-70",
                    "cursor-pointer"
                  )}
                  aria-label='Close'
                  type='button'
                >
                  <Logo className='size-full' />
                </button>
                <span
                  className={cn(
                    "block ml-8 xl:ml-24",
                    "text-white font-medium mr-auto relative tracking-[0.25em] whitespace-nowrap",
                    "text-xs xl:text-lg 2xl:text-xl 3xl:text-xl",
                    'before:content-[""] before:absolute before:-left-4 sm:before:-left-6 lg:before:-left-10 before:top-1/2 before:-translate-y-1/2 before:bg-white/80 before:h-16 lg:before:h-12 before:w-px before:block'
                  )}
                >
                  {toAllUppercase(tCommon("navigation.masterplan"), locale)}
                </span>
              </div>

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsOpen(false)
                }}
                className={cn(
                  "size-10 sm:size-12 lg:size-14",
                  "flex items-center justify-center",
                  "text-white",
                  "transition-opacity duration-300 hover:opacity-70",
                  "cursor-pointer pointer-events-auto"
                )}
                type='button'
                aria-label='Close'
              >
                <XIcon className='size-full' weight='light' />
              </button>
            </div>

            {/* Orientation Warning Overlay */}
            <AnimatePresence>
              {isPortrait && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className='fixed inset-0 z-201 flex flex-col items-center justify-center bg-black/60 backdrop-blur-2xl px-10 text-center'
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className='flex flex-col items-center gap-6'
                  >
                    <ArrowCounterClockwiseIcon className='size-16 text-white' weight='light' />
                    <p className='text-white text-lg font-normal leading-relaxed max-w-[280px]'>
                      {tCommon("rotatePhone")}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content Area */}
            <div className='relative w-full h-full flex items-center justify-center' data-lenis-prevent-touch>
              {/* Background click catcher */}
              <button
                className='absolute inset-0 cursor-default outline-none'
                onClick={() => setSelectedHotspot(null)}
                type='button'
                aria-label='Deselect hotspot'
              />

              <div
                className='relative h-full xl:h-auto w-full max-w-full max-h-full pointer-events-none'
                style={{ aspectRatio }}
              >
                <Image
                  src={masterplanDrone.src}
                  className='object-cover w-full h-full'
                  alt='Masterplan Drone View'
                  fill
                  priority
                />

                {hotspots.map((hotspot) => {
                  const isActive = selectedHotspot?.id === hotspot.id
                  const showOnRight = hotspot.x < 50

                  return (
                    <div
                      key={hotspot.id}
                      className={cn("absolute pointer-events-auto", isActive ? "z-20" : "z-10")}
                      style={{
                        left: `${hotspot.x}%`,
                        top: `${hotspot.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedHotspot(isActive ? null : hotspot)
                        }}
                        className={cn(
                          "cursor-pointer",
                          "size-6 md:size-12 lg:size-12 rounded-full",
                          "flex items-center justify-center shadow-2xl backdrop-blur-xs",
                          "text-[10px] md:text-sm font-medium",
                          isActive ? "bg-white text-gray-900 scale-110" : "bg-white/30 text-white hover:bg-white/60"
                        )}
                      >
                        {hotspot.label}
                      </motion.button>

                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              x: showOnRight ? -20 : 20,
                              scale: 0.9,
                            }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{
                              opacity: 0,
                              x: showOnRight ? -20 : 20,
                              scale: 0.9,
                            }}
                            transition={{
                              duration: 0.5,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className={cn(
                              "absolute z-50 pointer-events-auto",
                              "w-[160px] md:w-[240px] aspect-12/16 bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-4 md:p-6",
                              "top-1/2 -translate-y-[30%]",
                              showOnRight ? "left-full ml-4" : "right-full mr-4"
                            )}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className='flex flex-col h-full gap-3 md:gap-4'>
                              <div>
                                <h3 className='text-base md:text-2xl font-medium text-gray-900 leading-tight tracking-tight'>
                                  {hotspot.title}
                                </h3>
                                <p className='text-[10px] md:text-sm text-gray-800 mt-1 font-light'>
                                  {hotspot.description}
                                </p>
                              </div>
                              <div className='relative flex-1 min-h-0 overflow-hidden'>
                                <Image src={hotspot.image} fill className='object-contain' alt={hotspot.title} />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
