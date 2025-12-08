"use client"

import { CaretRightIcon } from "@phosphor-icons/react"
import Image from "next/image"
import Link from "next/link"

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
  ctaLabel = "Planı Gör",
  priority = false,
}: ResidencePlanCardProps) {
  return (
    <div className='group relative isolate overflow-hidden'>
      <div className='relative aspect-3/4 w-full'>
        <Image
          src={image}
          alt={`${block} ${number}`}
          fill
          sizes='(min-width: 1280px) 280px, (min-width: 768px) 45vw, 100vw'
          className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-105'
          priority={priority}
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent' />
        <div className='absolute inset-0 flex flex-col justify-between p-6 text-white'>
          <div className='space-y-2 text-center drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]'>
            <p className='text-sm font-semibold uppercase tracking-[0.22em]'>{block}</p>
            <p className='text-lg font-light leading-tight'>{floor}</p>
            <p className='text-lg font-light leading-tight'>{number}</p>
          </div>
          <div className='flex justify-center'>
            <Link
              href={href}
              className='inline-flex items-center gap-3 bg-white/30 px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white backdrop-blur transition hover:bg-white/45'
            >
              {ctaLabel}
              <CaretRightIcon size={16} weight='bold' />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
