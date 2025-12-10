import { getTranslations } from "next-intl/server"

import { IconCollab } from "@/components/icons"
import { Wrapper } from "@/components/wrapper"
import { cn } from "@/lib/utils"
import { Locale } from "@/i18n/routing"

type LocalePageParams = { params: Promise<{ locale: Locale }> }

export default async function Page({ params }: LocalePageParams) {
  const { locale } = await params
  const tCommon = await getTranslations({ locale, namespace: "common" })
  const tLiving = await getTranslations({ locale, namespace: "citysLiving" })

  const parkItems = tLiving.raw("park.items") as string[]
  const lifeItemsCount = (tLiving.raw("life.items") as string[]).length
  const lifeItems = Array.from({ length: lifeItemsCount }, (_, idx) =>
    tLiving.rich(`life.items.${idx}`, {
      strong: (chunk) => <span className='font-medium'>{chunk}</span>,
      br: () => <br />,
    })
  )
  const membersItemsCount = (tLiving.raw("members.items") as string[]).length
  const membersItems = Array.from({ length: membersItemsCount }, (_, idx) =>
    tLiving.rich(`members.items.${idx}`, {
      strong: (chunk) => <span className='font-medium'>{chunk}</span>,
      br: () => <br />,
    })
  )

  return (
    <Wrapper className='py-header-height-mobile 2xl:py-header-height'>
      <div className='w-full px-8 lg:px-16 xl:px-16 py-10 lg:py-16 flex flex-col justify-center gap-8 xl:gap-20'>
        {/* Main Title */}
        <div className='px-0 sm:px-8 lg:px-16 xl:px-24 2xl:px-32'>
          <div className='flex items-center justify-start mt-auto'>
            <span
              className={cn(
                "whitespace-nowrap text-center font-primary font-medium text-bricky-brick",
                "-tracking-[0.025em]",
                "text-lg/[1.15] md:text-3xl/[1.15] lg:text-4xl/[1.15] xl:text-[36px]/[1.15] 2xl:text-[42px]/[1.15] 3xl:text-[50px]/[1.15]",
                "flex flex-col items-center justify-center gap-3 sm:gap-4 lg:flex-row lg:gap-2"
              )}
            >
              {tCommon("lifeReimagined")}
            </span>
            <span className='mx-1 sm:mx-3 size-5 sm:size-6 md:mx-4 md:size-10 2xl:size-12 3xl:size-12'>
              <IconCollab className='text-bricky-brick' />
            </span>
            <span
              className={cn(
                "whitespace-nowrap text-center font-primary font-semibold text-bricky-brick",
                "-tracking-[0.015em]",
                "text-lg/[1.15] md:text-3xl/[1.15] lg:text-4xl/[1.15] xl:text-[36px]/[1.15] 2xl:text-[42px]/[1.15] 3xl:text-[50px]/[1.15]"
              )}
            >
              CITY&apos;S
            </span>
          </div>
        </div>
        {/* Main Content */}
        <div className='grid grid-cols-1 gap-12 xl:grid-cols-2 xl:gap-16 px-0 sm:px-8 lg:px-16 xl:px-24 2xl:px-32'>
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
                  {tLiving("park.title")}
                </h3>
                <div className='w-px h-full bg-[#5D7261]' />
              </div>
              <ul className='space-y-3 text-black font-primary text-sm sm:text-xl font-light'>
                {parkItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
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
                  {tLiving("life.title")}
                </h3>
                <div className='w-px h-full bg-[#7DCECC]' />
              </div>
              <ul className='space-y-3 text-black font-primary text-sm sm:text-xl font-light'>
                {lifeItems.map((item, idx) => (
                  <li key={`life-${idx}`}>{item}</li>
                ))}
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
                {tLiving("members.title")}
              </h3>
              <div className='w-px h-full bg-bricky-brick' />
            </div>
            <ul className='space-y-3 text-black font-primary text-sm sm:text-xl font-light'>
              {membersItems.map((item, idx) => (
                <li key={`members-${idx}`}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
