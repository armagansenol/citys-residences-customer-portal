"use client"

import { CaretRightIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import Image from "next/image"

import { LocaleTransitionLink } from "@/components/locale-transition-link"

type ResidencePlanCardProps = {
  image: string
  block: string
  floor: string
  number: string
  href?: string
  ctaLabel?: string
  priority?: boolean
}

export function ResidencePlanCard({
  image,
  block,
  floor,
  number,
  href = "#",
  ctaLabel = "residencePlan.ctaLabel",
  priority = false,
}: ResidencePlanCardProps) {
  const t = useTranslations("common")

  return (
    <LocaleTransitionLink href={href} className='group relative isolate overflow-hidden cursor-pointer'>
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
        <div className='absolute inset-0 flex flex-col justify-end p-12 text-white :gap-16'>
          <div className='space-y-2 text-center drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]'>
            <p className='font-primary text-base xl:text-4xl font-semibold'>{block}</p>
            <p className='font-primary text-base xl:text-3xl font-regular'>{floor}</p>
            <p className='font-primary text-base xl:text-3xl font-regular'>{number}</p>
          </div>
          <div className='flex justify-center'>
            <div className='inline-flex items-center gap-3 gradient-submit-button px-4 xl:px-12 py-2 xl:py-4 text-[8px] xl:text-lg font-semibold uppercase tracking-[0.28em] text-white whitespace-nowrap'>
              {t(ctaLabel)}
              <CaretRightIcon size={16} weight='bold' className='text-white' />
            </div>
          </div>
        </div>
      </div>
    </LocaleTransitionLink>
  )
}
