import { ZoomImageDialog } from "@/components/dialogs/zoom-image-dialog"
import { Image } from "@/components/image"
import { Wrapper } from "@/components/wrapper"

import masterplan from "@/public/img/masterplan.jpg"
import { Locale } from "@/i18n/routing"

type LocalePageParams = { params: Promise<{ locale: Locale }> }

export default async function Page({ params }: LocalePageParams) {
  const { locale } = await params
  const aspectRatio = masterplan.height / masterplan.width

  return (
    <Wrapper>
      <section className='flex items-center justify-center'>
        <ZoomImageDialog
          dialogContent={
            <Image src={masterplan.src} alt='Masterplan' width={masterplan.width} height={masterplan.height} />
          }
          dialogTrigger={
            <span className='block h-[calc(100vh-(2*var(--spacing-header-height)))] aspect-square relative'>
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
      </section>
    </Wrapper>
  )
}
