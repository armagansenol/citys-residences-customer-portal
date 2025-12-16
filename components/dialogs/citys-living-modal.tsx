"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useTranslations } from "next-intl"
import { XIcon } from "@phosphor-icons/react"
import { useLenis } from "lenis/react"

import { IconCollab, Logo } from "@/components/icons"
import { cn, toAllUppercase } from "@/lib/utils"
import { useStore } from "@/lib/store/ui"
import { useEsc } from "@/hooks/useEsc"

export function CitysLivingModal() {
  const isOpen = useStore((state) => state.isCitysLivingModalOpen)
  const setIsOpen = useStore((state) => state.setIsCitysLivingModalOpen)
  const lenis = useLenis()
  const tCommon = useTranslations("common")
  const tLiving = useTranslations("citysLiving")

  const parkItems = tLiving.raw("park.items") as string[]
  const lifeItemsCount = (tLiving.raw("life.items") as string[]).length
  const lifeItems = Array.from({ length: lifeItemsCount }, (_, idx) =>
    tLiving.rich(`life.items.${idx}`, {
      strong: (chunk) => <span className='font-medium'>{chunk}</span>,
      br: () => <br />,
    })
  )
  const membersItemsCount = (tLiving.raw("members.items") as string[]).length
  const membersItems = Array.from({ length: membersItemsCount }, (_, idx) =>
    tLiving.rich(`members.items.${idx}`, {
      strong: (chunk) => <span className='font-medium'>{chunk}</span>,
      br: () => <br />,
    })
  )

  useEsc(() => setIsOpen(false), isOpen)

  useEffect(() => {
    if (isOpen) {
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
                {toAllUppercase(tCommon("navigation.citysLiving"), "en")}
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
            <div className='min-h-screen w-full px-8 lg:px-16 xl:px-16 py-10 lg:py-16 flex flex-col justify-center gap-8 xl:gap-20'>
              {/* Fixed Header Background */}
              <div
                className={cn(
                  "fixed top-0 left-0 right-0 z-40 h-header-height-mobile 2xl:h-header-height",
                  "gradient-bg-white"
                )}
              ></div>

              {/* Main Title */}
              <div className='px-0 sm:px-8 lg:px-16 xl:px-24 2xl:px-32 pt-header-height-mobile 2xl:pt-header-height'>
                <div className='flex items-center justify-start mt-auto'>
                  <span
                    className={cn(
                      "whitespace-nowrap text-center font-primary font-medium text-bricky-brick",
                      "-tracking-[0.025em]",
                      "text-lg/[1.15] md:text-3xl/[1.15] lg:text-4xl/[1.15] xl:text-[36px]/[1.15] 2xl:text-[42px]/[1.15] 3xl:text-[50px]/[1.15]",
                      "flex flex-col items-center justify-center gap-3 sm:gap-4 lg:flex-row lg:gap-2"
                    )}
                  >
                    {tCommon("lifeReimagined")}
                  </span>
                  <span className='mx-1 sm:mx-3 size-5 sm:size-6 md:mx-4 md:size-10 2xl:size-12 3xl:size-12'>
                    <IconCollab className='text-bricky-brick' />
                  </span>
                  <span
                    className={cn(
                      "whitespace-nowrap text-center font-primary font-semibold text-bricky-brick",
                      "-tracking-[0.015em]",
                      "text-lg/[1.15] md:text-3xl/[1.15] lg:text-4xl/[1.15] xl:text-[36px]/[1.15] 2xl:text-[42px]/[1.15] 3xl:text-[50px]/[1.15]"
                    )}
                  >
                    CITY&apos;S
                  </span>
                </div>
              </div>

              {/* Main Content */}
              <div className='grid grid-cols-1 gap-12 xl:grid-cols-2 xl:gap-16 px-0 sm:px-8 lg:px-16 xl:px-24 2xl:px-32 pb-20'>
                {/* Left Column */}
                <div className='flex flex-col gap-12 lg:gap-16'>
                  {/* City's Park Section */}
                  <div className='flex gap-6 flex-row sm:gap-10'>
                    <div className='flex items-center gap-2 sm:gap-6 shrink-0'>
                      <h3
                        className='text-[#5D7261] font-primary text-2xl sm:text-3xl font-medium whitespace-nowrap mb-auto'
                        style={{
                          writingMode: "vertical-rl",
                          textOrientation: "mixed",
                          transform: "rotate(180deg)",
                        }}
                      >
                        {tLiving("park.title")}
                      </h3>
                      <div className='w-px h-full bg-[#5D7261]' />
                    </div>
                    <ul className='space-y-3 text-black font-primary text-sm sm:text-xl font-light'>
                      {parkItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* City's Life Section */}
                  <div className='flex gap-6 flex-row sm:gap-10'>
                    <div className='flex items-center gap-2 sm:gap-6 shrink-0'>
                      <h3
                        className='text-[#7DCECC] font-primary text-2xl sm:text-3xl font-medium whitespace-nowrap mb-auto'
                        style={{
                          writingMode: "vertical-rl",
                          textOrientation: "mixed",
                          transform: "rotate(180deg)",
                        }}
                      >
                        {tLiving("life.title")}
                      </h3>
                      <div className='w-px h-full bg-[#7DCECC]' />
                    </div>
                    <ul className='space-y-3 text-black font-primary text-sm sm:text-xl font-light'>
                      {lifeItems.map((item, idx) => (
                        <li key={`life-${idx}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Column */}
                <div className='flex gap-6 flex-row sm:gap-10'>
                  <div className='flex items-center gap-2 sm:gap-6 shrink-0'>
                    <h3
                      className='text-bricky-brick font-primary text-2xl sm:text-3xl font-medium whitespace-nowrap mb-auto'
                      style={{
                        writingMode: "vertical-rl",
                        textOrientation: "mixed",
                        transform: "rotate(180deg)",
                      }}
                    >
                      {tLiving("members.title")}
                    </h3>
                    <div className='w-px h-full bg-bricky-brick' />
                  </div>
                  <ul className='space-y-3 text-black font-primary text-sm sm:text-xl font-light'>
                    {membersItems.map((item, idx) => (
                      <li key={`members-${idx}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
