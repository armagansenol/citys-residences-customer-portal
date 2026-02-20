"use client"

import { Logo } from "@/components/icons"
import { Image } from "@/components/image"
import { useEsc } from "@/hooks/useEsc"
import { useStore } from "@/lib/store/ui"
import { cn, toAllUppercase } from "@/lib/utils"
import masterplanDrone from "@/public/img/masterplan-drone.jpg"
import { ArrowCounterClockwiseIcon, XIcon } from "@phosphor-icons/react"
import { useLenis } from "lenis/react"
import { AnimatePresence, motion } from "motion/react"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"

function ModalHeader({ onClose, isVisible }: { onClose: () => void; isVisible: boolean }) {
  const tCommon = useTranslations("common")
  const locale = useLocale()

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className='h-header-height-mobile xl:h-header-height fixed top-0 left-0 right-0 z-202 flex items-center justify-between px-6 lg:px-16 xl:px-16 mix-blend-difference pointer-events-none'
    >
      <div className='flex items-center justify-between w-full pointer-events-auto'>
        {/* Logo Button */}
        <button
          onClick={onClose}
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

        {/* Close Button */}
        <button
          onClick={onClose}
          className={cn(
            "size-10 sm:size-12 lg:size-14",
            "flex items-center justify-center",
            "text-white",
            "transition-opacity duration-300 hover:opacity-70",
            "cursor-pointer"
          )}
          type='button'
          aria-label='Close'
        >
          <XIcon className='size-full' weight='light' />
        </button>
      </div>
    </motion.div>
  )
}

const hotspots = [
  // Hotspot coordinates are in percentage of the background image area.
  // x => horizontal position from left, y => vertical position from top.
  {
    id: "c1",
    x: 19,
    y: 55,
    label: "C1",
    title: "C1 BLOK",
    description: "Yukarıdan bakan bir şehir deneyimi.",
    image: "/img/c-blok.png",
  },
  {
    id: "c2",
    x: 25,
    y: 50,
    label: "C2",
    title: "C2 BLOK",
    description: "Yukarıdan bakan bir şehir deneyimi.",
    image: "/img/c-blok.png",
  },
  {
    id: "c3",
    x: 30,
    y: 45.5,
    label: "C3",
    title: "C3 BLOK",
    description: "Yukarıdan bakan bir şehir deneyimi.",
    image: "/img/c-blok.png",
  },
  {
    id: "b5",
    x: 36,
    y: 44,
    label: "B5",
    title: "B5 BLOK",
    description: "Yukarıdan bakan bir şehir deneyimi.",
    image: "/img/b-blok.png",
  },
  {
    id: "b4",
    x: 43,
    y: 49,
    label: "B4",
    title: "B4 BLOK",
    description: "Yukarıdan bakan bir şehir deneyimi.",
    image: "/img/b-blok.png",
  },
  {
    id: "b3",
    x: 50.25,
    y: 44,
    label: "B3",
    title: "B3 BLOK",
    description: "Yukarıdan bakan bir şehir deneyimi.",
    image: "/img/b-blok.png",
  },
  {
    id: "b2",
    x: 58,
    y: 49,
    label: "B2",
    title: "B2 BLOK",
    description: "Yukarıdan bakan bir şehir deneyimi.",
    image: "/img/b-blok.png",
  },
  {
    id: "b1",
    x: 66,
    y: 44,
    label: "B1",
    title: "B1 BLOK",
    description: "Yukarıdan bakan bir şehir deneyimi.",
    image: "/img/b-blok.png",
  },
  {
    id: "a2",
    x: 71,
    y: 48,
    label: "A2",
    title: "A2 BLOK",
    description: "Yukarıdan bakan bir şehir deneyimi.",
    image: "/img/a-blok.png",
  },
  {
    id: "a1",
    x: 78,
    y: 46,
    label: "A1",
    title: "A1 BLOK",
    description: "Yukarıdan bakan bir şehir deneyimi.",
    image: "/img/a-blok.png",
  },
]

const visibleHotspotIds = new Set(["b2", "b3"])

const hotspotImageSources = Array.from(new Set(hotspots.map((hotspot) => hotspot.image)))

export function MasterplanModal() {
  // Global modal visibility state from store.
  const isOpen = useStore((state) => state.isMasterplanModalOpen)
  const setIsOpen = useStore((state) => state.setIsMasterplanModalOpen)
  const lenis = useLenis()
  // selectedHotspot controls which pin's detail card is open.
  const [selectedHotspot, setSelectedHotspot] = useState<(typeof hotspots)[0] | null>(null)
  // Portrait mode on small screens shows a rotate-device overlay.
  const [isPortrait, setIsPortrait] = useState(false)
  const tCommon = useTranslations("common")

  // Header auto-hides on downward scroll and reappears when scrolling up.
  const [showHeader, setShowHeader] = useState(true)
  const lastScrollY = useRef(0)
  const hoverCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearHoverCloseTimeout = () => {
    if (hoverCloseTimeout.current) {
      clearTimeout(hoverCloseTimeout.current)
      hoverCloseTimeout.current = null
    }
  }

  const scheduleHotspotClose = (hotspotId: string) => {
    clearHoverCloseTimeout()
    hoverCloseTimeout.current = setTimeout(() => {
      setSelectedHotspot((current) => (current?.id === hotspotId ? null : current))
    }, 80)
  }

  useEffect(() => {
    // Keep portrait detection in sync with resize/orientation changes.
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
    // ESC closes active hotspot first; closes modal when no hotspot is selected.
    if (selectedHotspot) {
      setSelectedHotspot(null)
    } else {
      setIsOpen(false)
    }
  }, isOpen)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop
    if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
      setShowHeader(false)
    } else {
      setShowHeader(true)
    }
    lastScrollY.current = currentScrollY
  }

  useEffect(() => {
    // While modal is open, lock page scroll and pause Lenis.
    if (isOpen) {
      setShowHeader(true)
      lastScrollY.current = 0
      lenis?.stop()
      document.body.style.overflow = "hidden"
    } else {
      lenis?.start()
      document.body.style.overflow = ""
      setSelectedHotspot(null)
    }

    return () => {
      if (hoverCloseTimeout.current) {
        clearTimeout(hoverCloseTimeout.current)
        hoverCloseTimeout.current = null
      }
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
            className='fixed inset-0 z-201 overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
            onScroll={handleScroll}
            data-lenis-prevent
          >
            <ModalHeader onClose={() => setIsOpen(false)} isVisible={showHeader} />
            <div className='sr-only' aria-hidden>
              {hotspotImageSources.map((src) => (
                <Image key={src} src={src} alt='' width={1} height={1} priority loading='eager' fetchPriority='high' />
              ))}
            </div>

            {/* Orientation Warning Overlay */}
            <AnimatePresence>
              {isPortrait && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className='fixed inset-0 z-210 flex flex-col items-center justify-center bg-black/60 backdrop-blur-2xl px-10 text-center'
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
            <div className='relative w-full min-h-screen flex items-center justify-center' data-lenis-prevent-touch>
              {/* Background click catcher */}
              <button
                className='absolute inset-0 cursor-default outline-none'
                onClick={() => setSelectedHotspot(null)}
                type='button'
                aria-label='Deselect hotspot'
              />

              <div
                className={cn(
                  "relative w-full aspect-video pointer-events-none xl:aspect-auto xl:h-screen",
                  isPortrait ? "h-screen" : "h-auto"
                )}
              >
                {/* Masterplan base image layer */}
                <Image
                  src={masterplanDrone.src}
                  className='object-cover w-full h-full object-center'
                  alt='Masterplan Drone View'
                  fill
                  priority
                  fetchPriority='high'
                />

                {isPortrait
                  ? null
                  : hotspots.filter((hotspot) => visibleHotspotIds.has(hotspot.id)).map((hotspot) => {
                      const isActive = selectedHotspot?.id === hotspot.id
                      // Show card to the opposite side of pin to avoid off-screen overflow.
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
                          {/* Hotspot pin button */}
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            onMouseEnter={() => {
                              clearHoverCloseTimeout()
                              setSelectedHotspot(hotspot)
                            }}
                            onMouseLeave={() => scheduleHotspotClose(hotspot.id)}
                            className={cn(
                              "cursor-pointer",
                              "size-6 md:size-8 lg:size-12 rounded-full",
                              "flex items-center justify-center shadow-2xl backdrop-blur-xs",
                              "text-[10px] md:text-sm font-medium",
                              isActive ? "bg-white text-gray-900 scale-110" : "bg-white/30 text-white hover:bg-white/60"
                            )}
                          >
                            {hotspot.label}
                          </motion.button>
                          <AnimatePresence>
                            {isActive && (
                              // Detail card for currently active hotspot.
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
                                  "w-header-height md:w-[240px] aspect-12/16 bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-4 md:p-4",
                                  "top-1/2 -translate-y-[30%]",
                                  showOnRight ? "left-full ml-4" : "right-full mr-4"
                                )}
                                onMouseEnter={clearHoverCloseTimeout}
                                onMouseLeave={() => scheduleHotspotClose(hotspot.id)}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className='flex flex-col h-full gap-3 md:gap-4'>
                                  <div>
                                    <h3 className='text-base md:text-2xl font-medium text-gray-900 leading-tight tracking-tight'>
                                      {hotspot.title}
                                    </h3>
                                  </div>
                                  <div className='relative flex-1 min-h-0 overflow-hidden'>
                                    <Image
                                      src={hotspot.image}
                                      fill
                                      className='object-contain'
                                      alt={hotspot.title}
                                      priority
                                      loading='eager'
                                      fetchPriority='high'
                                    />
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
