"use client"

import { Wrapper } from "@/components/wrapper"
import InnerImageZoom from "react-inner-image-zoom"

import { calculateRatio, cn } from "@/lib/utils"
import masterplan from "@/public/img/masterplan.jpg"
import masterplanZoom from "@/public/img/masterplan-zoom.jpg"
import { ArrowsOutSimpleIcon } from "@phosphor-icons/react"
import { ZoomImageDialog } from "@/components/dialogs/zoom-image-dialog"
import { Image } from "@/components/image"

export default function Page() {
  const aspectRatio = calculateRatio(masterplan.width, masterplan.height)

  return (
    <Wrapper className='pt-header-height-mobile lg:pt-header-height px-8 xl:px-[20vw]'>
      <section className='flex items-center justify-center flex-1'>
        <ZoomImageDialog
          dialogContent={
            <div className='relative h-[90vh]' style={{ aspectRatio: aspectRatio }}>
              <InnerImageZoom src={masterplan.src} zoomSrc={masterplanZoom.src} hideHint zoomPreload />
            </div>
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
        />
        <span
          className={cn(
            "blur-bg-white fixed bottom-12 left-1/2 -translate-x-1/2",
            "flex size-12 items-center justify-center",
            "rounded-full bg-bricky-brick p-3 text-white transition-transform duration-300 ease-in-out group-hover:scale-110 xl:size-16",
            "block xl:hidden"
          )}
        >
          <ArrowsOutSimpleIcon className='size-full' weight='thin' />
        </span>
      </section>
    </Wrapper>
  )
}
