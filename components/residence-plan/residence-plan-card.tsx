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
  href?: string
  ctaLabel?: string
  priority?: boolean
  onClick?: () => void
}

export function ResidencePlanCard({
  image,
  block,
  floor,
  number,
  href = "#",
  ctaLabel = "residencePlan.ctaLabel",
  priority = false,
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
          priority={priority}
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent' />
        <div className='absolute inset-0 flex flex-col justify-end py-6 lg:py-12 text-white gap-4 lg:gap-16'>
          <div className='flex flex-col items-center gap-1 text-center drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]'>
            <p className='font-primary text-lg/[1] xl:text-4xl/[1] font-semibold'>{block} BLOK</p>
            <p className='font-primary text-base/[1] xl:text-3xl/[1] font-regular'>Kat {floor}</p>
            <p className='font-primary text-base/[1] xl:text-3xl/[1] font-regular'>{number}</p>
          </div>
          <div className='flex justify-center'>
            <div className='inline-flex items-center gap-3 gradient-submit-button px-4 xl:px-12 py-2 xl:py-4 text-[9px] xl:text-lg font-medium tracking-[0.28em] text-white whitespace-nowrap'>
              {toAllUppercase(t(ctaLabel), locale)}
              <CaretRightIcon weight='regular' className='text-white size-3 xl:size-6' />
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
