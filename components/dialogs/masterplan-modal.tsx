"use client"

import { Image } from "@/components/image"
import { cn, toAllUppercase } from "@/lib/utils"
import { calculateRatio } from "@/lib/utils"
import { useStore } from "@/lib/store/ui"
import { useEsc } from "@/hooks/useEsc"
import { useLenis } from "lenis/react"
import { AnimatePresence, MotionConfig, motion } from "motion/react"
import { type MouseEvent, useEffect, useState } from "react"
import InnerImageZoom from "react-inner-image-zoom"
import { ArrowsOutSimpleIcon, XIcon } from "@phosphor-icons/react"
import { Logo } from "@/components/icons"
import masterplanZoom from "@/public/img/masterplan-zoom.jpg"
import masterplan from "@/public/img/masterplan.jpg"
import { useLocale, useTranslations } from "next-intl"

export function MasterplanModal() {
  const isOpen = useStore((state) => state.isMasterplanModalOpen)
  const setIsOpen = useStore((state) => state.setIsMasterplanModalOpen)
  const lenis = useLenis()
  const aspectRatio = calculateRatio(masterplan.width, masterplan.height)
  const [isZoomed, setIsZoomed] = useState(false)
  const tCommon = useTranslations("common")
  const locale = useLocale()

  useEsc(() => {
    if (isZoomed) {
      setIsZoomed(false)
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
      setIsZoomed(false)
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen, lenis])

  const openZoom = () => setIsZoomed(true)
  const closeZoom = () => setIsZoomed(false)
  const stopEventPropagation = (event: MouseEvent) => event.stopPropagation()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Preload Images */}
          <Image
            src={masterplanZoom.src}
            className='sr-only'
            alt='Preview masterplan zoomed'
            width={masterplanZoom.width}
            height={masterplanZoom.height}
          />
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='fixed inset-0 z-200 bg-white'
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className='fixed inset-0 z-201 overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            <div className='h-header-height-mobile 2xl:h-header-height fixed top-0 left-0 right-0 z-202 flex items-center justify-between px-6 lg:px-16 xl:px-16'>
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className={cn(
                  "size-24 sm:size-24 lg:size-36",
                  "flex items-center justify-center",
                  "text-bricky-brick",
                  "transition-opacity duration-300 hover:opacity-70",
                  "cursor-pointer"
                )}
                aria-label='Close'
              >
                <Logo className='size-full text-bricky-brick' />
              </button>
              <span
                className={cn(
                  "block ml-8 xl:ml-24",
                  "text-bricky-brick font-medium mr-auto relative tracking-[0.25em] whitespace-nowrap",
                  "text-xs xl:text-lg 2xl:text-xl 3xl:text-xl",
                  'before:content-[""] before:absolute before:-left-4 sm:before:-left-6 lg:before:-left-10 before:top-1/2 before:-translate-y-1/2 before:bg-bricky-brick/80 before:h-16 lg:before:h-12 before:w-px before:block'
                )}
              >
                {toAllUppercase(tCommon("navigation.masterplan"), locale)}
              </span>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className={cn(
                  "size-10 sm:size-12 lg:size-14",
                  "flex items-center justify-center",
                  "text-bricky-brick",
                  "transition-opacity duration-300 hover:opacity-70",
                  "cursor-pointer"
                )}
                aria-label='Close'
              >
                <XIcon className='size-full' weight='light' />
              </button>
            </div>

            {/* Content */}
            <div className='min-h-screen w-full px-8 xl:px-[20vw] py-header-height-mobile lg:pt-header-height flex items-center justify-center'>
              <MotionConfig
                transition={{
                  type: "tween",
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <section className='flex items-center justify-center flex-1 w-full'>
                  <motion.div
                    layoutId='masterplan-image'
                    className='relative block w-full max-w-6xl cursor-pointer overflow-hidden'
                    style={{ aspectRatio: aspectRatio }}
                    onClick={openZoom}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "tween", duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Image
                      src={masterplan.src}
                      className='object-contain'
                      alt='Masterplan'
                      fill
                      desktopSize='80vw'
                      mobileSize='90vw'
                      priority
                      fetchPriority='high'
                    />
                    <motion.button
                      type='button'
                      onClick={openZoom}
                      aria-label='Open zoomed masterplan'
                      className={cn(
                        "absolute right-6 bottom-6 cursor-pointer",
                        "flex size-12 items-center justify-center",
                        "rounded-full bg-bricky-brick p-3 text-white xl:size-16",
                        "xl:block hidden"
                      )}
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "tween", duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ArrowsOutSimpleIcon className='size-full' weight='thin' />
                    </motion.button>
                  </motion.div>
                  <button
                    type='button'
                    onClick={openZoom}
                    aria-label='Open zoomed masterplan'
                    className={cn(
                      "fixed bottom-12 left-1/2 -translate-x-1/2",
                      "flex size-12 items-center justify-center",
                      "rounded-full bg-bricky-brick p-3 text-white xl:size-16",
                      "block xl:hidden z-202"
                    )}
                  >
                    <ArrowsOutSimpleIcon className='size-full' weight='thin' />
                  </button>
                  <AnimatePresence>
                    {isZoomed ? (
                      <motion.div
                        className='fixed inset-0 z-300 flex items-center justify-center'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "tween", duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        onClick={closeZoom}
                        data-lenis-prevent-touch
                      >
                        <motion.div
                          className='absolute inset-0 bg-black/90'
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: "tween", duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        />
                        <motion.div
                          layoutId='masterplan-image'
                          className='relative max-w-screen w-full xl:w-auto xl:max-w-[65vw] 2xl:max-w-[70vw] 3xl:max-w-[70vw] overflow-hidden'
                          style={{ aspectRatio: aspectRatio }}
                          initial={{ scale: 0.96 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0.97 }}
                          transition={{ type: "tween", duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          onClick={stopEventPropagation}
                        >
                          <div className='hidden h-full w-full md:block'>
                            <InnerImageZoom
                              src={masterplan.src}
                              zoomSrc={masterplanZoom.src ?? masterplan.src}
                              hideHint
                              hideCloseButton
                              zoomPreload
                              className='h-full w-full bg-black/20'
                              width={masterplan.width}
                              height={masterplan.height}
                            />
                          </div>
                          <div className='block h-full w-full md:hidden'>
                            <Image
                              src={masterplanZoom.src ?? masterplan.src}
                              className='object-contain'
                              alt='Masterplan zoomed'
                              fill
                              desktopSize='90vw'
                              mobileSize='100vw'
                              priority
                            />
                          </div>
                        </motion.div>
                        <button
                          type='button'
                          aria-label='Close zoomed masterplan'
                          onClick={(event: MouseEvent<HTMLButtonElement>) => {
                            event.stopPropagation()
                            closeZoom()
                          }}
                          className={cn(
                            "cursor-pointer absolute right-7 xl:right-14 top-7 xl:top-14 text-white/90 transition hover:scale-105 z-301",
                            "size-8 sm:size-12 lg:size-14",
                            "flex items-center justify-center",
                            "cursor-pointer"
                          )}
                        >
                          <XIcon className='size-full' />
                        </button>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </section>
              </MotionConfig>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
