import { ResidencePlanCard } from "@/components/residence-plan/residence-plan-card"
import { Wrapper } from "@/components/wrapper"
import { Locale } from "@/i18n/routing"
import { residencePlans } from "@/lib/residence-plans"

type LocalePageParams = { params: Promise<{ locale: Locale }> }

export default async function Page({ params }: LocalePageParams) {
  const { locale } = await params
  return (
    <Wrapper className='py-header-height-mobile lg:py-header-height'>
      <section className='container mx-auto px-8 py-12 lg:px-16 lg:py-14'>
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          {residencePlans.map((residence, index) => (
            <ResidencePlanCard
              key={`${residence.block}-${residence.number}`}
              priority={index === 0}
              href={`/${locale}/residence-plan/${residence.slug}`}
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
