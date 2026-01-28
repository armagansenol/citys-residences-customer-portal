"use client"

import { XIcon } from "@phosphor-icons/react"
import { useLenis } from "lenis/react"
import { AnimatePresence, motion } from "motion/react"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"

import { AutoplayVideo } from "@/components/autoplay-video"
import { Logo } from "@/components/icons"
import { useEsc } from "@/hooks/useEsc"
import { citysIstanbulAvmBanner } from "@/lib/constants"
import { useStore } from "@/lib/store/ui"
import { cn, toAllUppercase } from "@/lib/utils"

function ModalHeader({ onClose, isVisible }: { onClose: () => void; isVisible: boolean }) {
  const tCommon = useTranslations("common")

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className='h-header-height-mobile xl:h-header-height fixed top-0 left-0 right-0 z-202 flex items-center justify-between px-6 lg:px-16 xl:px-16 mix-blend-difference pointer-events-none'
    >
      <div className='flex items-center justify-between w-full pointer-events-auto'>
        {/* Close Button */}
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
          <Logo className='size-full text-white' />
        </button>
        <span
          className={cn(
            "block ml-8 xl:ml-24",
            "text-white font-medium mr-auto relative tracking-[0.25em] whitespace-nowrap",
            "text-xs xl:text-lg 2xl:text-xl 3xl:text-xl",
            'before:content-[""] before:absolute before:-left-4 sm:before:-left-6 lg:before:-left-10 before:top-1/2 before:-translate-y-1/2 before:bg-white before:h-16 lg:before:h-12 before:w-px before:block'
          )}
        >
          {toAllUppercase(tCommon("navigation.citysLiving"), "en")}
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
          aria-label='Close'
          type='button'
        >
          <XIcon className='size-full' weight='light' />
        </button>
      </div>
    </motion.div>
  )
}

export function CitysLivingModal() {
  const isOpen = useStore((state) => state.isCitysLivingModalOpen)
  const setIsOpen = useStore((state) => state.setIsCitysLivingModalOpen)
  const lenis = useLenis()
  const tLiving = useTranslations("citysLiving")

  const [showHeader, setShowHeader] = useState(true)
  const lastScrollY = useRef(0)

  const parkItems = tLiving.raw("park.items") as string[]
  const lifeItemsCount = (tLiving.raw("life.items") as string[]).length
  const lifeItems = Array.from({ length: lifeItemsCount }, (_, idx) => ({
    key: `life.items.${idx}`,
    content: tLiving.rich(`life.items.${idx}`, {
      strong: (chunk) => <span className='font-medium'>{chunk}</span>,
      br: () => <br />,
    }),
  }))
  const membersItemsCount = (tLiving.raw("members.items") as string[]).length
  const membersItems = Array.from({ length: membersItemsCount }, (_, idx) => ({
    key: `members.items.${idx}`,
    content: tLiving.rich(`members.items.${idx}`, {
      strong: (chunk) => <span className='font-medium'>{chunk}</span>,
      br: () => <br />,
    }),
  }))

  useEsc(() => setIsOpen(false), isOpen)

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
    if (isOpen) {
      setShowHeader(true)
      lastScrollY.current = 0
      lenis?.stop()
      document.body.style.overflow = "hidden"
    } else {
      lenis?.start()
      document.body.style.overflow = ""
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
            className='fixed inset-0 z-200 bg-white'
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

            <section className='relative h-screen overflow-hidden'>
              <AutoplayVideo
                playbackId={citysIstanbulAvmBanner.muxSrc}
                mobilePlaybackId={citysIstanbulAvmBanner.muxSrcMobile}
                aspectRatio={citysIstanbulAvmBanner.aspect()}
                hasIcons={false}
              />
            </section>

            {/* Content */}
            <div className='grid grid-cols-12 bg-white'>
              <div className='w-full px-6 lg:px-16 xl:px-30 py-12 lg:py-24 flex flex-col gap-20 lg:gap-32 col-span-12 xl:col-span-10 xl:col-start-2'>
                {/* City's Park Section */}
                <section className='flex flex-col gap-8 lg:gap-12'>
                  <h2 className='text-army-canvas font-primary text-3xl lg:text-5xl font-normal'>
                    {tLiving("park.title")}
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-x-16 lg:gap-x-32'>
                    {parkItems.map((item) => (
                      <div
                        key={item}
                        className='py-4 lg:py-6 border-b border-army-canvas/40 font-primary text-base lg:text-xl font-light'
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </section>

                {/* City's Life Section */}
                <section className='flex flex-col gap-8 lg:gap-12'>
                  <h2 className='text-verve-violet font-primary text-3xl lg:text-5xl font-normal'>
                    {tLiving("life.title")}
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-x-16 lg:gap-x-32 '>
                    {lifeItems.map((item) => (
                      <div
                        key={item.key}
                        className='py-4 lg:py-6 border-b border-verve-violet/40 font-primary text-base lg:text-xl font-light'
                      >
                        {item.content}
                      </div>
                    ))}
                  </div>
                </section>

                {/* City's Members Club Section */}
                <section className='flex flex-col gap-8 lg:gap-12'>
                  <h2 className='text-bricky-brick font-primary text-3xl lg:text-5xl font-normal'>
                    {tLiving("members.title")}
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-x-16 lg:gap-x-32'>
                    {membersItems.map((item) => (
                      <div
                        key={item.key}
                        className='py-4 lg:py-6 border-b border-bricky-brick/40 font-primary text-base lg:text-xl font-light'
                      >
                        {item.content}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
