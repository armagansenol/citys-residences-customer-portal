import { ResidencePlanCard } from "@/components/residence-plan/residence-plan-card"
import { Wrapper } from "@/components/wrapper"
import { Locale, routing } from "@/i18n/routing"
import { residencePlans } from "@/lib/residence-plans"

type LocalePageParams = { params: Promise<{ locale: Locale }> }

export default async function Page({ params }: LocalePageParams) {
  const { locale } = await params

  const detailPathname = routing.pathnames["/residence-plan/[slug]"]
  const localizedDetailBase =
    typeof detailPathname === "object"
      ? detailPathname[locale] ?? detailPathname[routing.defaultLocale]
      : detailPathname

  return (
    <Wrapper className='py-header-height-mobile lg:py-header-height'>
      <section className='w-full py-12 lg:py-14 px-8 lg:px-16 xl:px-24 2xl:px-32'>
        <div className='grid grid-cols-2 gap-4 md:gap-8  xl:gap-10 sm:grid-cols-2 lg:grid-cols-4'>
          {residencePlans.map((residence, index) => (
            <ResidencePlanCard
              key={`${residence.block}-${residence.number}`}
              priority={index === 0}
              href={`/${locale}${localizedDetailBase.replace("[slug]", residence.slug)}`}
              image={residence.image}
              block={residence.block}
              floor={residence.floor}
              number={residence.number}
            />
          ))}
        </div>
      </section>
    </Wrapper>
  )
}
