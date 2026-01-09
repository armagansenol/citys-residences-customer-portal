"use client"

import { CaretRightIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"

import { LocaleTransitionLink } from "@/components/locale-transition-link"
import { toAllUppercase } from "@/lib/utils"

type ResidencePlanCardProps = {
  image: string
  block: string
  floor: string
  number: string
  installmentPeriod?: string
  href?: string
  ctaLabel?: string
  ctaLabel2?: string
  priority?: boolean
  onClick?: () => void
}

export function ResidencePlanCard({
  image,
  block,
  floor,
  number,
  installmentPeriod,
  href = "#",
  ctaLabel = "residencePlan.ctaLabel",
  ctaLabel2 = "residencePlan.ctaLabel2",
  onClick,
}: ResidencePlanCardProps) {
  const t = useTranslations("common")
  const locale = useLocale()

  const content = (
    <div className='group relative isolate overflow-hidden cursor-pointer'>
      <div className='relative aspect-9/16 w-full'>
        <Image
          src={image}
          alt={`${block} ${number}`}
          fill
          sizes='(min-width: 1280px) 280px, (min-width: 768px) 45vw, 100vw'
          className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-105'
          priority
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent' />
        <div className='absolute inset-0 flex flex-col justify-end py-12 lg:py-12 text-white gap-16 xl:gap-16'>
          <div className='flex flex-col items-center gap-2 xl:gap-1 text-center drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]'>
            <p className='font-primary text-3xl/[1] xl:text-3xl/[1] 2xl:text-4xl/[1] font-semibold'>{block} BLOK</p>
            <p className='font-primary text-3xl/[1] xl:text-2xl/[1] 2xl:text-4xl/[1] font-regular'>Kat {floor}</p>
            <p className='font-primary text-3xl/[1] xl:text-2xl/[1] 2xl:text-4xl/[1] font-regular'>{number}</p>
          </div>
          <div className='flex justify-center'>
            <div className='inline-flex items-center gap-0.5 xl:gap-2 gradient-submit-button px-6 xl:px-4 py-2.5 xl:py-2 2xl:py-2.5 font-medium tracking-0.1em text-white whitespace-nowrap'>
              <span className='text-base md:text-[7px]/[1] lg:text-[9px]/[1] xl:text-[12px]/[1] 2xl:text-[13px]/[1] 3xl:text-base tracking-widest'>
                {toAllUppercase(t(ctaLabel), locale)}
              </span>
              <CaretRightIcon weight='regular' className='text-white size-5 xl:size-7 3xl:size-8 shrink-0' />
              <span className='text-base md:text-[7px]/[1] lg:text-[9px]/[1] xl:text-[12px]/[1] 2xl:text-[13px]/[1] 3xl:text-base tracking-widest'>
                {installmentPeriod &&
                  installmentPeriod !== "0" &&
                  toAllUppercase(`${installmentPeriod} ${t("residencePlan.months")}`, locale)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (onClick) {
    return (
      <button onClick={onClick} className='w-full text-left'>
        {content}
      </button>
    )
  }

  return <LocaleTransitionLink href={href}>{content}</LocaleTransitionLink>
}
