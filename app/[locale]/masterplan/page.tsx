"use client"

import { Image } from "@/components/image"
import { Wrapper } from "@/components/wrapper"
import { cn } from "@/lib/utils"
import masterplanZoom from "@/public/img/masterplan-zoom.jpg"
import masterplan from "@/public/img/masterplan.jpg"
import { ArrowsOutSimpleIcon } from "@phosphor-icons/react"
import { useLenis } from "lenis/react"
import { AnimatePresence, MotionConfig, motion } from "motion/react"
import { type MouseEvent, useEffect, useState } from "react"
import InnerImageZoom from "react-inner-image-zoom"

import { calculateRatio } from "@/lib/utils"
import { useEsc } from "@/hooks/useEsc"

export default function Page() {
  const aspectRatio = calculateRatio(masterplan.width, masterplan.height)
  const [isZoomed, setIsZoomed] = useState(false)
  const lenis = useLenis()

  useEffect(() => {
    if (isZoomed) {
      lenis?.stop()
    } else {
      lenis?.start()
    }
  }, [isZoomed, lenis])

  const openZoom = () => setIsZoomed(true)
  const closeZoom = () => setIsZoomed(false)

  const stopEventPropagation = (event: MouseEvent) => event.stopPropagation()

  useEsc(closeZoom)

  return (
    <MotionConfig
      transition={{
        type: "tween",
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Wrapper className='py-header-height-mobile lg:pt-header-height px-8 xl:px-[20vw]'>
        <section className='flex items-center justify-center flex-1'>
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
              "block xl:hidden"
            )}
          >
            <ArrowsOutSimpleIcon className='size-full' weight='thin' />
          </button>
          <AnimatePresence>
            {isZoomed ? (
              <motion.div
                className='fixed inset-0 z-60 flex items-center justify-center'
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
                  className='relative w-full xl:max-w-6xl 3xl:max-w-[1440px] max-h-[90vh] overflow-hidden'
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
                {/* <button
                  type='button'
                  aria-label='Close zoomed masterplan'
                  onClick={(event: MouseEvent<HTMLButtonElement>) => {
                    event.stopPropagation()
                    closeZoom()
                  }}
                  className='cursor-pointer absolute right-6 top-6 flex size-10 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition hover:scale-105 hover:bg-white'
                >
                  <XIcon className='size-5' />
                </button> */}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>
      </Wrapper>
    </MotionConfig>
  )
}
