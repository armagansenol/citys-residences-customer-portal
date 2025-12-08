import Image from "next/image"
import { notFound } from "next/navigation"

import { Wrapper } from "@/components/wrapper"
import { residencePlans } from "@/lib/residence-plans"
import { Locale } from "@/i18n/routing"

type ResidencePlanPageParams = { params: Promise<{ locale: Locale; slug: string }> }

export default async function Page({ params }: ResidencePlanPageParams) {
  const { slug } = await params
  const plan = residencePlans.find((item) => item.slug === slug)

  if (!plan) {
    return notFound()
  }

  return (
    <Wrapper className='py-header-height-mobile lg:py-header-height'>
      <section className='container mx-auto px-16 py-10 lg:px-32 lg:py-14 space-y-6'>
        <div className='group relative overflow-hidden' data-lenis-prevent>
          <a href={plan.pdf} target='_blank' rel='noreferrer' aria-label='Planı yeni sekmede aç' className='block'>
            <iframe
              src={`${plan.pdf}#toolbar=0&navpanes=0`}
              title={`${plan.block} ${plan.number} pdf viewer`}
              className='w-full min-h-screen border-0'
            >
              <Image
                src={plan.image}
                alt={`${plan.block} ${plan.number} plan preview`}
                width={1600}
                height={900}
                className='h-full w-full object-cover'
                priority
              />
            </iframe>
            <div className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
            <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
              <span className='rounded-full bg-white/80 px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-black shadow'>
                PDF&apos;yi Yeni Sekmede Aç
              </span>
            </div>
          </a>
        </div>
      </section>
    </Wrapper>
  )
}
