"use client"

import { AutoplayVideo } from "@/components/autoplay-video"
import { IconCollab, IconScrollDown, Logo } from "@/components/icons"
import { Image } from "@/components/image"
import { IosPicker } from "@/components/ios-picker"
import { LoadingSpinner } from "@/components/loading-spinner"
import { LocaleTransitionLink } from "@/components/locale-transition-link"
import { Wrapper } from "@/components/wrapper"
import { useSectionTracker } from "@/hooks"
import type { Locale } from "@/i18n/routing"
import { fetchProposalById } from "@/lib/api/proposals"
import { residencePlanMedia, routeConfig, SectionId, socialMedia } from "@/lib/constants"
import { useStore } from "@/lib/store/ui"
import { cn } from "@/lib/utils"
import { ArrowRightIcon, TiktokLogoIcon } from "@phosphor-icons/react"
import { FacebookLogoIcon, InstagramLogoIcon, XLogoIcon } from "@phosphor-icons/react/ssr"
import { useQuery } from "@tanstack/react-query"
import { useLocale, useTranslations } from "next-intl"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useMemo, useRef } from "react"
import masterplanDrone from "@/public/img/masterplan-drone.jpg"

export default function Page() {
  const searchParams = useSearchParams()
  const proposalId = searchParams?.get("id") || null

  // Always fetch the latest proposal data when this page is active
  const { isLoading: isProposalLoading, isError: isProposalError } = useQuery({
    queryKey: ["proposal", proposalId],
    queryFn: () => {
      if (!proposalId) {
        throw new Error("Proposal ID is required")
      }
      return fetchProposalById(proposalId)
    },
    enabled: Boolean(proposalId),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })

  const locale = useLocale()
  const t = useTranslations("common")
  const sectionsWrapperRef = useRef<HTMLDivElement | null>(null)
  const setIsCitysLivingModalOpen = useStore((state) => state.setIsCitysLivingModalOpen)
  const setIsMasterplanModalOpen = useStore((state) => state.setIsMasterplanModalOpen)
  const setIsResidencePlanModalOpen = useStore((state) => state.setIsResidencePlanModalOpen)

  const navbarSections = useMemo(
    () =>
      Object.values(routeConfig)
        .filter((item) => item.inNavbar)
        .sort((a, b) => a.order - b.order),
    []
  )

  // Track active section for both vertical (desktop) and horizontal (mobile) scroll
  const { activeSection, registerSectionRef } = useSectionTracker({
    direction: "vertical",
    scope: sectionsWrapperRef,
    enabled: true,
  })

  // Residence plan button is disabled while loading or if there's an error
  const isResidencePlanDisabled = isProposalLoading || isProposalError

  return (
    <>
      <Image
        src={masterplanDrone.src}
        className='object-cover sr-only'
        alt='Masterplan Drone View'
        fill
        priority
        fetchPriority='high'
      />
      <Wrapper>
        <div className='h-header-height-mobile xl:h-header-height fixed top-0 left-0 right-0 z-202 flex items-center justify-between px-6 lg:px-16 xl:px-16'>
          {/* Close Button */}
          <button
            className={cn(
              "size-20 sm:size-24 lg:size-36 xl:size-36 2xl:size-36 3xl:size-36",
              "[@media(orientation:landscape)_and_(max-height:500px)]:size-20",
              "flex items-center justify-center",
              "text-bricky-brick",
              "transition-opacity duration-300 hover:opacity-70",
              "cursor-pointer"
            )}
            aria-label='Close'
            type='button'
          >
            <Logo className='size-full text-bricky-brick' />
          </button>
        </div>
        <div
          className={cn(
            "fixed inset-0 z-50 xl:h-auto",
            "pt-header-height-mobile 2xl:pt-[calc(var(--spacing-header-height)/1.25)]"
          )}
        >
          <div
            className={cn(
              "w-full size-full mx-auto px-8 lg:px-16 xl:px-16 pb-4 lg:pb-16 xl:pt-8 2xl:pt-0",
              "flex flex-col gap-6 lg:gap-4 3xl:gap-6 [@media(orientation:landscape)_and_(max-height:500px)]:flex-row [@media(orientation:landscape)_and_(max-height:500px)]:gap-10"
            )}
          >
            {/* NAVIGATION */}
            <div className='hidden xl:flex flex-col gap-2 lg:gap-4 xl:gap-4 2xl:gap-5 items-start pt-0 lg:pt-20 xl:pt-8 2xl:pt-20'>
              {navbarSections.map((item) => {
                const isCitysLiving = item.id === SectionId.CITYS_LIVING
                const isMasterplan = item.id === SectionId.MASTERPLAN
                const isResidencePlan = item.id === SectionId.RESIDENCE_PLAN
                if (isCitysLiving) {
                  return (
                    <button
                      type='button'
                      key={item.id}
                      onClick={() => setIsCitysLivingModalOpen(true)}
                      className={cn(
                        "cursor-pointer",
                        "flex items-center gap-2",
                        "font-primary text-[8vw]/[1] xs:text-[8vw]/[1] xsm:text-[9vw]/[1] sm:text-2xl/[1] md:text-3xl/[1] lg:text-4xl/[1] xl:text-4xl/[1] 2xl:text-6xl/[1] font-normal text-orochimaru",
                        "-tracking-[0.025em]",
                        "transition-colors duration-300 hover:text-tangerine-flake",
                        activeSection === item.id && "xl:text-bricky-brick",
                        item.disabled && "pointer-events-none"
                      )}
                    >
                      <span>{t(item.titleKey)}</span>
                      <ArrowRightIcon weight='regular' className='text-orochimaru size-6 xl:hidden' />
                    </button>
                  )
                }
                if (isMasterplan) {
                  return (
                    <button
                      type='button'
                      key={item.id}
                      onClick={() => setIsMasterplanModalOpen(true)}
                      className={cn(
                        "cursor-pointer",
                        "flex items-center gap-2",
                        "font-primary text-[8vw]/[1] xs:text-[8vw]/[1] xsm:text-[9vw]/[1] sm:text-2xl/[1] md:text-3xl/[1] lg:text-4xl/[1] xl:text-4xl/[1] 2xl:text-6xl/[1] font-normal text-orochimaru",
                        "-tracking-[0.025em]",
                        "transition-colors duration-300 hover:text-tangerine-flake",
                        activeSection === item.id && "xl:text-bricky-brick",
                        item.disabled && "pointer-events-none"
                      )}
                    >
                      <span>{t(item.titleKey)}</span>
                      <ArrowRightIcon weight='regular' className='text-orochimaru size-6 xl:hidden' />
                    </button>
                  )
                }
                if (isResidencePlan) {
                  return (
                    <button
                      type='button'
                      key={item.id}
                      onClick={() => setIsResidencePlanModalOpen(true)}
                      disabled={isResidencePlanDisabled}
                      className={cn(
                        "cursor-pointer",
                        "flex items-center gap-2",
                        "font-primary text-[8vw]/[1] xs:text-[8vw]/[1] xsm:text-[9vw]/[1] sm:text-2xl/[1] md:text-3xl/[1] lg:text-4xl/[1] xl:text-4xl/[1] 2xl:text-6xl/[1] font-normal text-orochimaru",
                        "-tracking-[0.025em]",
                        "transition-colors duration-300 hover:text-tangerine-flake",
                        activeSection === item.id && "xl:text-bricky-brick",
                        (item.disabled || isResidencePlanDisabled) && "pointer-events-none opacity-50"
                      )}
                    >
                      <span>{t(item.titleKey)}</span>
                      {isProposalLoading && <LoadingSpinner className='size-5 xl:size-6 text-bricky-brick' />}
                      <ArrowRightIcon weight='regular' className='text-orochimaru size-6 xl:hidden' />
                    </button>
                  )
                }
                return (
                  <LocaleTransitionLink
                    href={item.paths[locale as Locale]}
                    key={item.id}
                    {...(item.isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                    className={cn(
                      "cursor-pointer",
                      "flex items-center gap-2",
                      "font-primary text-[8vw]/[1] xs:text-[8vw]/[1] xsm:text-[9vw]/[1] sm:text-2xl/[1] md:text-3xl/[1] lg:text-4xl/[1] xl:text-4xl/[1] 2xl:text-6xl/[1] font-normal text-orochimaru",
                      "-tracking-[0.025em]",
                      "transition-colors duration-300 hover:text-tangerine-flake",
                      activeSection === item.id && "xl:text-bricky-brick",
                      item.disabled && "pointer-events-none"
                    )}
                  >
                    <span>{t(item.titleKey)}</span>
                    <ArrowRightIcon weight='regular' className='text-orochimaru size-6 xl:hidden' />
                  </LocaleTransitionLink>
                )
              })}
            </div>

            <div className='contents [@media(orientation:landscape)_and_(max-height:500px)]:flex [@media(orientation:landscape)_and_(max-height:500px)]:flex-col [@media(orientation:landscape)_and_(max-height:500px)]:w-[45%] [@media(orientation:landscape)_and_(max-height:500px)]:justify-between'>
              <div className='block xl:hidden order-1'>
                <IosPicker
                  loop={false}
                  items={navbarSections.map((item) => ({
                    title: t(item.titleKey),
                    href: item.paths[locale as Locale],
                    id: item.id,
                    disabled: item.id === SectionId.RESIDENCE_PLAN ? isResidencePlanDisabled : item.disabled,
                    isExternal: item.isExternal,
                    isModal:
                      item.id === SectionId.CITYS_LIVING ||
                      item.id === SectionId.MASTERPLAN ||
                      item.id === SectionId.RESIDENCE_PLAN,
                    isLoading: item.id === SectionId.RESIDENCE_PLAN ? isProposalLoading : false,
                  }))}
                />
              </div>
              {/* SCROLL DOWN */}
              <div className='relative animate-bounce-translate hidden xl:block xl:size-16'>
                <IconScrollDown className='text-bricky-brick size-full' />
                <span className='sr-only'>Scroll Down</span>
              </div>
              <div className='flex flex-col gap-3 mt-auto order-3 [@media(orientation:landscape)_and_(max-height:500px)]:items-start [@media(orientation:landscape)_and_(max-height:500px)]:gap-2 [@media(orientation:landscape)_and_(max-height:500px)]:mt-4'>
                {/* YASAM YENİDEN TASARLANDI */}
                <div className='flex items-center justify-start [@media(orientation:landscape)_and_(max-height:500px)]:justify-start '>
                  <span
                    className={cn(
                      "whitespace-nowrap text-center font-primary font-medium text-bricky-brick",
                      "-tracking-[0.025em]",
                      "text-[14px]/[1] xs:text-[4.5vw]/[1] sm:text-xl/[1] md:text-3xl/[1] lg:text-4xl/[1] xl:text-2xl/[1] 2xl:text-3xl/[1] 3xl:text-4xl/[1]",
                      "[@media(orientation:landscape)_and_(max-height:500px)]:text-[19px]",
                      "flex flex-col items-center justify-center gap-3 sm:gap-4 lg:flex-row lg:gap-2"
                    )}
                  >
                    {t("lifeReimagined")}
                  </span>
                  <span
                    className={cn(
                      "mx-2 sm:mx-3 md:mx-4 xl:mx-3 2xl:mx-4 3xl:mx-4",
                      "size-5 sm:size-6 md:size-8 xl:size-8 2xl:size-8 3xl:size-10",
                      "[@media(orientation:landscape)_and_(max-height:500px)]:size-6 [@media(orientation:landscape)_and_(max-height:500px)]:mx-2"
                    )}
                  >
                    <IconCollab className='text-bricky-brick size-full' />
                  </span>
                  <span
                    className={cn(
                      "whitespace-nowrap text-center font-primary font-semibold text-bricky-brick",
                      "-tracking-[0.015em]",
                      "text-[14px]/[1] xs:text-[4.5vw]/[1] sm:text-xl/[1] md:text-3xl/[1] lg:text-4xl/[1] xl:text-2xl/[1] 2xl:text-3xl/[1] 3xl:text-4xl/[1]",
                      "[@media(orientation:landscape)_and_(max-height:500px)]:text-[19px]"
                    )}
                  >
                    CITY&apos;S
                  </span>
                </div>
                {/* SOCIAL MEDIA */}
                <div className='mr-auto gap-4 flex 3xl:gap-6 [@media(orientation:landscape)_and_(max-height:500px)]:mr-auto [@media(orientation:landscape)_and_(max-height:500px)]:ml-0 [@media(orientation:landscape)_and_(max-height:500px)]:gap-4'>
                  <Link href={socialMedia.facebook} target='_blank' rel='noopener noreferrer'>
                    <FacebookLogoIcon
                      weight='fill'
                      className='size-6 sm:size-8 lg:size-9 [@media(orientation:landscape)_and_(max-height:500px)]:size-8 cursor-pointer text-bricky-brick transition-opacity duration-300 hover:opacity-70'
                    />
                  </Link>
                  <Link href={socialMedia.x} target='_blank' rel='noopener noreferrer'>
                    <XLogoIcon
                      weight='regular'
                      className='size-6 sm:size-8 lg:size-9 [@media(orientation:landscape)_and_(max-height:500px)]:size-8 cursor-pointer text-bricky-brick transition-opacity duration-300 hover:opacity-70'
                    />
                  </Link>
                  <Link href={socialMedia.instagram} target='_blank' rel='noopener noreferrer'>
                    <InstagramLogoIcon
                      weight='regular'
                      className='size-6 sm:size-8 lg:size-9 [@media(orientation:landscape)_and_(max-height:500px)]:size-8 cursor-pointer text-bricky-brick transition-opacity duration-300 hover:opacity-70'
                    />
                  </Link>
                  <Link href={socialMedia.tiktok} target='_blank' rel='noopener noreferrer'>
                    <TiktokLogoIcon
                      weight='regular'
                      className='size-6 sm:size-8 lg:size-9 [@media(orientation:landscape)_and_(max-height:500px)]:size-8 cursor-pointer text-bricky-brick transition-opacity duration-300 hover:opacity-70'
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* MOBILE VIDEO */}
            <div className='w-full flex-1 min-h-0 xl:hidden order-2 [@media(orientation:landscape)_and_(max-height:500px)]:flex [@media(orientation:landscape)_and_(max-height:500px)]:w-[55%] [@media(orientation:landscape)_and_(max-height:500px)]:h-full'>
              <AutoplayVideo playbackId={residencePlanMedia.muxSrc} />
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
                  className='w-screen h-screen shrink-0 flex items-center justify-end px-8 lg:px-16 xl:px-16 pb-36 pt-84 lg:pt-[420px] lg:pb-48 xl:pb-16 xl:pt-16 2xl:py-20 3xl:pb-16 2xl:pt-[calc(var(--spacing-header-height)/1.5)]'
                >
                  {item.id === SectionId.CITYS_LIVING ? (
                    <button
                      type='button'
                      onClick={() => setIsCitysLivingModalOpen(true)}
                      className={cn(
                        "w-full xl:w-auto xl:h-full aspect-16/10 xl:aspect-16/14 2xl:aspect-16/15 3xl:aspect-16/14 cursor-pointer",
                        item.disabled && "pointer-events-none"
                      )}
                    >
                      <AutoplayVideo playbackId={item.media?.muxSrc} />
                    </button>
                  ) : item.id === SectionId.MASTERPLAN ? (
                    <button
                      type='button'
                      onClick={() => setIsMasterplanModalOpen(true)}
                      className={cn(
                        "w-full xl:w-auto xl:h-full aspect-16/10 xl:aspect-16/14 2xl:aspect-16/15 3xl:aspect-16/14 cursor-pointer",
                        item.disabled && "pointer-events-none"
                      )}
                    >
                      <AutoplayVideo playbackId={item.media?.muxSrc} />
                    </button>
                  ) : item.id === SectionId.RESIDENCE_PLAN ? (
                    <button
                      type='button'
                      onClick={() => setIsResidencePlanModalOpen(true)}
                      disabled={isResidencePlanDisabled}
                      className={cn(
                        "w-full xl:w-auto xl:h-full aspect-16/10 xl:aspect-16/14 2xl:aspect-16/15 3xl:aspect-16/14 cursor-pointer relative",
                        (item.disabled || isResidencePlanDisabled) && "pointer-events-none"
                      )}
                    >
                      <AutoplayVideo playbackId={item.media?.muxSrc} />
                      {isProposalLoading && (
                        <div className='absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg'>
                          <LoadingSpinner className='size-10 text-white' />
                        </div>
                      )}
                    </button>
                  ) : (
                    <LocaleTransitionLink
                      href={item.paths[locale as Locale]}
                      {...(item.isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                      className={cn(
                        "w-full xl:w-auto xl:h-full aspect-16/10 xl:aspect-16/14 2xl:aspect-16/15 3xl:aspect-16/14 cursor-pointer",
                        item.disabled && "pointer-events-none"
                      )}
                    >
                      <AutoplayVideo playbackId={item.media?.muxSrc} />
                    </LocaleTransitionLink>
                  )}
                </div>
              )
          )}
        </div>
        {/* PRELOAD MASTERPLAN IMAGE */}
        <Image
          src={masterplanDrone.src}
          className='sr-only'
          alt='Preview masterplan'
          width={masterplanDrone.width}
          height={masterplanDrone.height}
        />
      </Wrapper>
    </>
  )
}
