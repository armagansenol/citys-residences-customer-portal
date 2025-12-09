"use client"

import { Wrapper } from "@/components/wrapper"
import InnerImageZoom from "react-inner-image-zoom"

import { calculateRatio } from "@/lib/utils"
import masterplan from "@/public/img/masterplan.jpg"
import masterplanZoom from "@/public/img/masterplan-zoom.jpg"
import { ArrowsOutSimpleIcon } from "@phosphor-icons/react"

export default function Page() {
  const aspectRatio = calculateRatio(masterplan.width, masterplan.height)

  return (
    <Wrapper className='py-header-height-mobile lg:py-header-height px-48'>
      <section className='h-[calc(100vh-var(--spacing-header-height))] flex items-center justify-center'>
        {/* <ZoomImageDialog
          dialogContent={
            <Image src={masterplan.src} alt='Masterplan' width={masterplan.width} height={masterplan.height} />
          }
          dialogTrigger={
            <span className='block w-full relative' style={{ aspectRatio: aspectRatio }}>
              <Image
                src={masterplan.src}
                className='object-contain'
                alt='Masterplan'
                fill
                desktopSize='80vw'
                mobileSize='90vw'
              />
            </span>
          }
          aspectRatio={aspectRatio}
        /> */}
        {/* <span className='block w-full relative' style={{ aspectRatio: aspectRatio }}>
              <Image
                src={masterplan.src}
                className='object-contain'
                alt='Masterplan'
                fill
                desktopSize='80vw'
                mobileSize='90vw'
              />
            </span> */}
        <div className='relative flex items-center justify-center size-full' style={{ aspectRatio: aspectRatio }}>
          <InnerImageZoom src={masterplan.src} zoomSrc={masterplanZoom.src} hideHint zoomPreload hasSpacer />
          <span className='blur-bg-white absolute bottom-8 right-8 flex size-12 items-center justify-center rounded-full bg-bricky-brick p-3 text-white transition-transform duration-300 ease-in-out group-hover:scale-110 xl:size-16'>
            <ArrowsOutSimpleIcon className='size-full' weight='thin' />
          </span>
        </div>
      </section>
    </Wrapper>
  )
}
