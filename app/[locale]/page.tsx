"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { FacebookLogoIcon, InstagramLogoIcon, XLogoIcon, YoutubeLogoIcon } from "@phosphor-icons/react/ssr"
import { useLocale, useTranslations } from "next-intl"

import { AutoplayVideo } from "@/components/autoplay-video"
import { IconCollab, IconScrollDown } from "@/components/icons"
import { Wrapper } from "@/components/wrapper"
import { Link } from "@/i18n/navigation"
import type { Locale, Pathnames } from "@/i18n/routing"
import { citysLivingMedia, routeConfig } from "@/lib/constants"

export default function Home() {
  const locale = useLocale()
  const t = useTranslations("common")
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const sectionsWrapperRef = useRef<HTMLDivElement | null>(null)

  const navbarSections = useMemo(
    () =>
      Object.values(routeConfig)
        .filter((item) => item.inNavbar)
        .sort((a, b) => a.order - b.order),
    []
  )

  useEffect(() => {
    let isCancelled = false
    const scrollTriggers: Array<import("gsap/ScrollTrigger").ScrollTrigger> = []

    const setupScrollTriggers = async () => {
      const gsapModule = await import("gsap")
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).ScrollTrigger
      if (!gsapModule.default || !ScrollTrigger || isCancelled) return

      gsapModule.default.registerPlugin(ScrollTrigger)

      Object.entries(sectionRefs.current).forEach(([sectionId, element]) => {
        if (!element) return

        const trigger = ScrollTrigger.create({
          trigger: element,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveSection(sectionId),
          onEnterBack: () => setActiveSection(sectionId),
        })

        scrollTriggers.push(trigger)
      })
    }

    setupScrollTriggers()

    return () => {
      isCancelled = true
      scrollTriggers.forEach((trigger) => trigger.kill())
    }
  }, [])

  const registerSectionRef = (sectionId: string) => (node: HTMLDivElement | null) => {
    sectionRefs.current[sectionId] = node
  }

  return (
    <Wrapper>
      <div
        className={cn(
          "container fixed z-50 px-8 inset-0",
          "flex flex-col gap-4",
          "pt-header-height-mobile lg:pt-header-height pb-8"
        )}
      >
        {/* NAVIGATION */}
        <div className='flex flex-col gap-3 lg:gap-4'>
          {navbarSections.map((item) => (
            <Link
              href={item.paths[locale as Locale] as Pathnames}
              locale={locale as Locale}
              key={item.id}
              className={cn(
                "font-primary text-5xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-normal text-orochimaru transition-colors duration-300",
                activeSection === item.id && "text-bricky-brick"
              )}
            >
              {t(item.titleKey)}
            </Link>
          ))}
        </div>
        {/* SCROLL DOWN */}
        <div className='relative size-12 animate-bounce-translate hidden xl:block'>
          <IconScrollDown className='text-bricky-brick size-10 sm:size-12' />
          <span className='sr-only'>Scroll Down</span>
        </div>
        {/* YASAM YENİDEN TASARLANDI */}
        <div className={cn("flex items-center justify-start gap-0 mt-auto sm:gap-6 lg:gap-3 xl:gap-4")}>
          <span
            className={cn(
              "whitespace-nowrap text-center font-primary font-medium text-bricky-brick",
              "text-xl/[1.15] sm:text-[1.75rem]/[1.15] md:text-4xl/[1.15] lg:text-5xl/[1.15] xl:text-5xl/[1.15] 2xl:text-4xl/[1.15]",
              "flex flex-col items-center justify-center gap-3 sm:gap-4 lg:flex-row lg:gap-2"
            )}
          >
            {t("lifeReimagined")}
          </span>
          <span className='mx-0 size-8 sm:mx-6 sm:size-10 2xl:h-14 2xl:w-14 3xl:h-16 3xl:w-16'>
            <IconCollab className='text-bricky-brick' />
          </span>
          <span
            className={cn(
              "whitespace-nowrap text-center font-primary font-semibold text-bricky-brick",
              "text-xl/[1.15] sm:text-[1.75rem]/[1.15] md:text-4xl/[1.15] lg:text-5xl/[1.15] xl:text-5xl/[1.15] 2xl:text-4xl/[1.15]"
            )}
          >
            CITY&apos;S
          </span>
        </div>
        {/* SOCIAL MEDIA */}
        <div className='mr-auto gap-4 flex'>
          <FacebookLogoIcon
            weight='fill'
            className='size-7 sm:size-8 lg:size-9 cursor-pointer text-bricky-brick transition-colors duration-300 hover:text-bricky-brick'
          />
          <XLogoIcon
            weight='regular'
            className='size-7 sm:size-8 lg:size-9 cursor-pointer text-bricky-brick transition-colors duration-300 hover:text-bricky-brick'
          />
          <InstagramLogoIcon
            weight='regular'
            className='size-7 sm:size-8 lg:size-9 cursor-pointer text-bricky-brick transition-colors duration-300 hover:text-bricky-brick'
          />
          <YoutubeLogoIcon
            weight='fill'
            className='size-7 sm:size-8 lg:size-9 cursor-pointer text-bricky-brick transition-colors duration-300 hover:text-bricky-brick'
          />
        </div>
      </div>
      <div className='flex flex-col' ref={sectionsWrapperRef}>
        {navbarSections.map((item) => (
          <div
            key={item.id}
            ref={registerSectionRef(item.id)}
            className='h-screen flex items-center justify-end px-4 sm:px-8 md:px-12 lg:px-20 xl:px-28 2xl:px-32 py-10 sm:py-14 lg:py-0'
          >
            <Link
              href={item.paths[locale as Locale] as Pathnames}
              locale={locale as Locale}
              className='h-[35vh] sm:h-[65vh] md:h-[70vh] lg:h-[80vh] xl:h-[82vh] 2xl:h-[84vh] lg:aspect-16/14'
            >
              <AutoplayVideo playbackId={item.media?.muxSrc} />
            </Link>
          </div>
        ))}
      </div>
    </Wrapper>
  )
}
