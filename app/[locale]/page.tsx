import { FacebookLogoIcon, InstagramLogoIcon, XLogoIcon, YoutubeLogoIcon } from "@phosphor-icons/react/ssr"
import { getTranslations } from "next-intl/server"

import { AutoplayVideo } from "@/components/autoplay-video"
import { IconCollab, IconScrollDown } from "@/components/icons"
import { Wrapper } from "@/components/wrapper"
import { Link } from "@/i18n/navigation"
import type { Locale, Pathnames } from "@/i18n/routing"
import { citysLivingMedia, navigationConfig } from "@/lib/constants"
import { cn } from "@/lib/utils"

type LocalePageParams = { params: Promise<{ locale: Locale }> }

export default async function Home({ params }: LocalePageParams) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "common" })

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
          {Object.values(navigationConfig)
            .filter((item) => item.inNavbar)
            .map((item) => (
              <Link
                href={item.href as Pathnames}
                locale={locale as Locale}
                key={item.id}
                className='font-primary text-5xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-normal text-orochimaru'
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
      <div className='flex flex-col'>
        <div className='h-screen flex items-center justify-end px-4 sm:px-8 md:px-12 lg:px-20 xl:px-28 2xl:px-32 py-10 sm:py-14 lg:py-0'>
          <div className='h-[35vh] sm:h-[65vh] md:h-[70vh] lg:h-[80vh] xl:h-[82vh] 2xl:h-[84vh] lg:aspect-16/14'>
            <AutoplayVideo playbackId={citysLivingMedia.muxSrc} />
          </div>
        </div>
        <div className='w-screen h-screen bg-amber-100'></div>
        <div className='w-screen h-screen bg-amber-200'></div>
        <div className='w-screen h-screen bg-amber-300'></div>
        <div className='w-screen h-screen bg-amber-400'></div>
      </div>
    </Wrapper>
  )
}
