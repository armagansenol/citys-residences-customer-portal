import { getTranslations } from "next-intl/server"

import { IconCollab } from "@/components/icons"
import { Wrapper } from "@/components/wrapper"
import { cn } from "@/lib/utils"
import { Locale } from "@/i18n/routing"

type LocalePageParams = { params: Promise<{ locale: Locale }> }

export default async function Page({ params }: LocalePageParams) {
  const { locale } = await params
  const tCommon = await getTranslations({ locale, namespace: "common" })

  return (
    <Wrapper className='py-header-height-mobile lg:py-header-height'>
      {/* Main Title */}
      <div className='container mx-auto px-6 py-10 sm:px-10 lg:px-16 xl:px-24 2xl:px-32 lg:py-16'>
        <div
          className={cn(
            "flex items-start justify-start gap-6 text-left sm:items-center flex-row lg:gap-0",
            "sm:text-center lg:text-left"
          )}
        >
          <span
            className={cn(
              "whitespace-nowrap font-primary font-medium text-bricky-brick",
              "text-[1.25rem]/[1.15] sm:text-4xl/[1.15] lg:text-5xl/[1.15] xl:text-5xl/[1.15] 2xl:text-5xl/[1.15] 3xl:text-5xl/[1.15]",
              "flex flex-col items-center justify-center gap-4 lg:flex-row lg:gap-0"
            )}
          >
            {tCommon("lifeReimagined")}
          </span>
          <span className='mx-0 size-8 sm:mx-8 2xl:h-14 2xl:w-14 3xl:h-16 3xl:w-16'>
            <IconCollab className='text-bricky-brick' />
          </span>
          <span
            className={cn(
              "whitespace-nowrap text-center font-primary font-semibold text-bricky-brick",
              "text-[1.25rem]/[1.15] sm:text-4xl/[1.15] lg:text-5xl/[1.15] xl:text-5xl/[1.15] 2xl:text-5xl/[1.15] 3xl:text-5xl/[1.15]"
            )}
          >
            CITY&apos;S
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-6 pb-14 sm:px-10 lg:px-16 xl:px-24 2xl:px-32 lg:pb-20'>
        <div className='grid grid-cols-1 gap-12 xl:grid-cols-2 xl:gap-16'>
          {/* Left Column */}
          <div className='flex flex-col gap-12 lg:gap-16'>
            {/* City's Park Section */}
            <div className='flex gap-6 flex-row sm:gap-10'>
              <div className='flex items-center gap-2 sm:gap-6 shrink-0'>
                <h3
                  className='text-[#5D7261] font-primary text-2xl sm:text-3xl font-medium whitespace-nowrap mb-auto'
                  style={{
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                    transform: "rotate(180deg)",
                  }}
                >
                  City's Park
                </h3>
                <div className='w-px h-full bg-[#5D7261]' />
              </div>
              <ul className='space-y-3 text-black font-primary text-sm sm:text-xl font-light'>
                <li>City's Lounge</li>
                <li>Açık Yüzme Havuzları</li>
                <li>Evcil Hayvan Parkı</li>
                <li>Açık Spor Alanları</li>
                <li>Yürüyüş/Koşu Parkuru</li>
                <li>Çocuk Parkları</li>
              </ul>
            </div>

            {/* City's Life Section */}
            <div className='flex gap-6 flex-row sm:gap-10'>
              <div className='flex items-center gap-2 sm:gap-6 shrink-0'>
                <h3
                  className='text-[#7DCECC] font-primary text-2xl sm:text-3xl font-medium whitespace-nowrap mb-auto'
                  style={{
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                    transform: "rotate(180deg)",
                  }}
                >
                  City's Life
                </h3>
                <div className='w-px h-full bg-[#7DCECC]' />
              </div>
              <ul className='space-y-3 text-black font-primary text-sm sm:text-xl font-light'>
                <li>Resepsiyon & Concierge Hizmetleri</li>
                <li>Vale & Otopark Hizmetleri</li>
                <li>Kargo Teslim Servisi</li>
                <li>
                  Paylaşımlı Ofis ve Toplantı Salonları <span className='font-medium'>x JUSTWORK</span>
                </li>
                <li>
                  Yeni Nesil Hotel Odaları <span className='font-medium'>x JUST STAY</span>
                </li>
                <li>
                  Performans Sanatları Merkezi <span className='font-medium'>x JUST EVENTS</span>
                </li>
                <li>
                  Evcil Hayvan Oteli <span className='font-medium'>x PET HOTEL</span>
                </li>
                <li>
                  Veteriner Hizmetleri <span className='font-medium'>x PET HOSPITAL</span>
                </li>
                <li>City's AVM'lerinde Ayrıcalıklar</li>
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className='flex gap-6 flex-row sm:gap-10'>
            <div className='flex items-center gap-2 sm:gap-6 shrink-0'>
              <h3
                className='text-bricky-brick font-primary text-2xl sm:text-3xl font-medium whitespace-nowrap mb-auto'
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(180deg)",
                }}
              >
                City's Members Club
              </h3>
              <div className='w-px h-full bg-bricky-brick' />
            </div>
            <ul className='space-y-3 text-black font-primary text-sm sm:text-xl font-light'>
              <li>Kapalı Yüzme Havuzu</li>
              <li>Spor Kulübü</li>
              <li>SPA & Wellness</li>
              <li>Basketbol Sahası</li>
              <li>Padel Tenis Kortu</li>
              <li>Golf Simülatör Sahası</li>
              <li>Masa Tenisi</li>
              <li>Yoga Stüdyosu</li>
              <li>Meditasyon Odası</li>
              <li>Özel Sinema Salonu</li>
              <li>Yemek Atölyesi</li>
              <li>Sanat Atölyesi</li>
              <li>Müzik/Karaoke Stüdyosu</li>
              <li>Podcast Stüdyosu</li>
              <li>Playstation Odası</li>
              <li>Kids Club x CITY'S KIDS CLUB</li>
            </ul>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
