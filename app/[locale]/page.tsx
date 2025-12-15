"use client"

import masterplan from "@/public/img/masterplan.jpg"

import { useMemo, useRef } from "react"

import { cn } from "@/lib/utils"
import { FacebookLogoIcon, InstagramLogoIcon, XLogoIcon, YoutubeLogoIcon } from "@phosphor-icons/react/ssr"
import { useLocale, useTranslations } from "next-intl"
import { ArrowRightIcon } from "@phosphor-icons/react"

import { AutoplayVideo } from "@/components/autoplay-video"
import { IconCollab, IconScrollDown } from "@/components/icons"
import { LocaleTransitionLink } from "@/components/locale-transition-link"
import { Wrapper } from "@/components/wrapper"
import { useSectionTracker } from "@/hooks"
import type { Locale, Pathnames } from "@/i18n/routing"
import { residencePlanMedia, routeConfig } from "@/lib/constants"
import { IosPicker } from "@/components/ios-picker"
import { Image } from "@/components/image"

export default function Home() {
  const locale = useLocale()
  const t = useTranslations("common")
  const sectionsWrapperRef = useRef<HTMLDivElement | null>(null)

  const navbarSections = useMemo(
    () =>
      Object.values(routeConfig)
        .filter((item) => item.inNavbar)
        .sort((a, b) => a.order - b.order),
    []
  )

  // Track active section for both vertical (desktop) and horizontal (mobile) scroll
  const { activeSection, setActiveSection, registerSectionRef } = useSectionTracker({
    direction: "vertical",
    scope: sectionsWrapperRef,
  })

  return (
    <Wrapper>
      <div
        className={cn("h-screen xl:h-auto xl:fixed z-50 xl:inset-0", "pt-header-height-mobile 2xl:pt-header-height")}
      >
        <div
          className={cn(
            "w-full size-full mx-auto px-8 lg:px-16 xl:px-16 pb-4 lg:pb-16 2xl:20 pt-8 lg:pt-20 xl:pt-8 2xl:pt-20",
            "flex flex-col gap-6 lg:gap-4 3xl:gap-6"
          )}
        >
          {/* NAVIGATION */}
          <div className='hidden xl:flex flex-col gap-2 lg:gap-4 xl:gap-4 2xl:gap-5 items-start'>
            {navbarSections.map((item) => (
              <LocaleTransitionLink
                href={item.paths[locale as Locale] as Pathnames}
                locale={locale as Locale}
                key={item.id}
                {...(item.isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                className={cn(
                  "flex items-center gap-2",
                  "font-primary text-[8vw]/[1] xs:text-[8vw]/[1] xsm:text-[9vw]/[1] sm:text-2xl/[1] md:text-3xl/[1] lg:text-4xl/[1] xl:text-5xl/[1] 2xl:text-6xl/[1] font-normal text-orochimaru",
                  "-tracking-[0.025em]",
                  "transition-colors duration-300 hover:text-tangerine-flake",
                  activeSection === item.id && "xl:text-bricky-brick",
                  item.disabled && "pointer-events-none"
                )}
              >
                <span>{t(item.titleKey)}</span>
                <ArrowRightIcon weight='regular' className='text-orochimaru size-6 xl:hidden' />
              </LocaleTransitionLink>
            ))}
          </div>
          <div className='block xl:hidden -my-4'>
            <IosPicker
              loop={false}
              items={navbarSections.map((item) => ({
                title: t(item.titleKey),
                href: item.paths[locale as Locale] as Pathnames,
                id: item.id,
                disabled: item.disabled,
                isExternal: item.isExternal,
              }))}
            />
          </div>
          {/* SCROLL DOWN */}
          <div className='relative animate-bounce-translate hidden xl:block xl:size-16'>
            <IconScrollDown className='text-bricky-brick size-full' />
            <span className='sr-only'>Scroll Down</span>
          </div>
          {/* MOBILE VIDEO */}
          <div className='w-full aspect-video xs:aspect-16/10 xsm:aspect-16/12 sm:aspect-16/14 block xl:hidden'>
            <AutoplayVideo playbackId={residencePlanMedia.muxSrc} />
          </div>
          <div className='flex flex-col gap-3 xl:mt-auto'>
            {/* YASAM YENİDEN TASARLANDI */}
            <div className='flex items-center justify-start '>
              <span
                className={cn(
                  "whitespace-nowrap text-center font-primary font-medium text-bricky-brick",
                  "-tracking-[0.025em]",
                  "text-[14px]/[1] xs:text-[4vw]/[1] sm:text-xl/[1] md:text-3xl/[1] lg:text-4xl/[1] xl:text-2xl/[1] 2xl:text-3xl/[1] 3xl:text-4xl/[1]",
                  "flex flex-col items-center justify-center gap-3 sm:gap-4 lg:flex-row lg:gap-2"
                )}
              >
                {t("lifeReimagined")}
              </span>
              <span
                className={cn(
                  "mx-2 sm:mx-3 md:mx-4 xl:mx-3 2xl:mx-4 3xl:mx-4",
                  "size-5 sm:size-6 md:size-8 xl:size-8 2xl:size-8 3xl:size-10"
                )}
              >
                <IconCollab className='text-bricky-brick size-full' />
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-center font-primary font-semibold text-bricky-brick",
                  "-tracking-[0.015em]",
                  "text-[14px]/[1] xs:text-[4vw]/[1] sm:text-xl/[1] md:text-3xl/[1] lg:text-4xl/[1] xl:text-2xl/[1] 2xl:text-3xl/[1] 3xl:text-4xl/[1]"
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
      </div>
      <div ref={sectionsWrapperRef} className='hidden xl:flex flex-col'>
        {navbarSections.map(
          (item) =>
            item.id && (
              <div
                key={item.id}
                ref={registerSectionRef(item.id)}
                className='w-screen h-screen shrink-0 flex items-center justify-end px-8 lg:px-16 xl:px-16 pb-36 pt-84 lg:pt-[420px] lg:pb-48 xl:pb-16 xl:pt-16 2xl:py-20 3xl:pb-16 2xl:pt-header-height'
              >
                <LocaleTransitionLink
                  href={item.paths[locale as Locale] as Pathnames}
                  locale={locale as Locale}
                  {...(item.isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                  className={cn(
                    "w-full xl:w-auto xl:h-full aspect-16/10 xl:aspect-16/14 2xl:aspect-16/15 3xl:aspect-16/14",
                    item.disabled && "pointer-events-none"
                  )}
                >
                  <AutoplayVideo playbackId={item.media?.muxSrc} />
                </LocaleTransitionLink>
              </div>
            )
        )}
      </div>
      {/* PRELOAD MASTERPLAN IMAGE */}
      <Image
        src={masterplan.src}
        className='sr-only'
        alt='Preview masterplan'
        width={masterplan.width}
        height={masterplan.height}
      />
    </Wrapper>
  )
}
