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
import { routeConfig } from "@/lib/constants"

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
      <div className={cn("fixed z-50 inset-0", "pt-header-height-mobile 2xl:pt-header-height")}>
        <div
          className={cn(
            "container size-full mx-auto px-8 lg:px-8 pb-16 2xl:20 pt-8 lg:pt-20 xl:pt-8 2xl:pt-20",
            "flex flex-col gap-4"
          )}
        >
          {/* NAVIGATION */}
          <div className='flex flex-col gap-3 lg:gap-4 xl:gap-2 items-start'>
            {navbarSections.map((item) => (
              <Link
                href={item.paths[locale as Locale] as Pathnames}
                locale={locale as Locale}
                key={item.id}
                className={cn(
                  "font-primary text-3xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-normal text-orochimaru",
                  "transition-colors duration-300 hover:opacity-70",
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
          <div className='flex items-center justify-start mt-auto'>
            <span
              className={cn(
                "whitespace-nowrap text-center font-primary font-medium text-bricky-brick",
                "-tracking-[0.025em]",
                "text-lg/[1.15] md:text-3xl/[1.15] lg:text-4xl/[1.15] xl:text-3xl/[1.15] 2xl:text-4xl/[1.15]",
                "flex flex-col items-center justify-center gap-3 sm:gap-4 lg:flex-row lg:gap-2"
              )}
            >
              {t("lifeReimagined")}
            </span>
            <span className='mx-2 size-8 md:mx-4 md:size-10 2xl:size-12 3xl:size-12'>
              <IconCollab className='text-bricky-brick' />
            </span>
            <span
              className={cn(
                "whitespace-nowrap text-center font-primary font-semibold text-bricky-brick",
                "-tracking-[0.015em]",
                "text-lg/[1.15] md:text-3xl/[1.15] lg:text-4xl/[1.15] xl:text-3xl/[1.15] 2xl:text-4xl/[1.15]"
              )}
            >
              CITY&apos;S
            </span>
          </div>
          {/* SOCIAL MEDIA */}
          <div className='mr-auto gap-4 flex 3xl:gap-6'>
            <FacebookLogoIcon
              weight='fill'
              className='size-6 sm:size-8 lg:size-9 cursor-pointer text-bricky-brick transition-opacity duration-300 hover:opacity-70'
            />
            <XLogoIcon
              weight='regular'
              className='size-6 sm:size-8 lg:size-9 cursor-pointer text-bricky-brick transition-opacity duration-300 hover:opacity-70'
            />
            <InstagramLogoIcon
              weight='regular'
              className='size-6 sm:size-8 lg:size-9 cursor-pointer text-bricky-brick transition-opacity duration-300 hover:opacity-70'
            />
            <YoutubeLogoIcon
              weight='fill'
              className='size-6 sm:size-8 lg:size-9 cursor-pointer text-bricky-brick transition-opacity duration-300 hover:opacity-70'
            />
          </div>
        </div>
      </div>
      <div className='flex flex-col' ref={sectionsWrapperRef}>
        {navbarSections.map((item) => (
          <div
            key={item.id}
            ref={registerSectionRef(item.id)}
            className='container mx-auto h-screen flex items-center justify-end pb-40 pt-84 lg:pt-[420px] lg:pb-48 xl:pb-16 xl:pt-16 2xl:py-20 3xl:pb-16 3xl:pt-header-height'
          >
            <Link
              href={item.paths[locale as Locale] as Pathnames}
              locale={locale as Locale}
              className='w-full h-full xl:w-auto xl:h-full xl:aspect-16/14 2xl:aspect-16/15 3xl:aspect-16/14'
            >
              <AutoplayVideo playbackId={item.media?.muxSrc} />
            </Link>
          </div>
        ))}
      </div>
    </Wrapper>
  )
}
