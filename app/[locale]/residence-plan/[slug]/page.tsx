"use client"

import { useParams } from "next/navigation"
import { notFound } from "next/navigation"

import { Wrapper } from "@/components/wrapper"
import { PDFViewer } from "@/components/residence-plan/pdf-viewer"
import { residencePlans } from "@/lib/residence-plans"

export default function Page() {
  const params = useParams()
  const slug = params?.slug as string
  const plan = residencePlans.find((item) => item.slug === slug)

  if (!plan) {
    return notFound()
  }

  return (
    <Wrapper className='py-header-height-mobile lg:py-header-height'>
      <section className='w-full px-8 lg:px-16 xl:px-16 py-10 lg:py-14 space-y-6' data-lenis-prevent>
        <div className='w-full'>
          <PDFViewer file={plan.pdf} title={`${plan.block} ${plan.number} pdf viewer`} />
        </div>
      </section>
    </Wrapper>
  )
}
