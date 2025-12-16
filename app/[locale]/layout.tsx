import "../globals.css"

import type { Metadata } from "next"
import localFont from "next/font/local"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { PrefetchRoutes } from "@/components/prefetch-routes"
import { QueryClientProviderWrapper } from "@/components/query-client-provider"
import { CitysLivingModal } from "@/components/dialogs/citys-living-modal"
import { MasterplanModal } from "@/components/dialogs/masterplan-modal"
import { ResidencePlanModal } from "@/components/dialogs/residence-plan-modal"

const suisseIntl = localFont({
  src: [
    // {
    //   path: '../fonts/suisse-intl/SuisseIntl-UltraLight.woff2',
    //   weight: '100',
    //   style: 'normal',
    // },
    {
      path: "../fonts/suisse-intl/SuisseIntl-Thin.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../fonts/suisse-intl/SuisseIntl-Light.woff2",
      weight: "300",
      style: "normal",
    },
    // {
    //   path: '../fonts/suisse-intl/SuisseIntl-Book.woff2',
    //   weight: '350',
    //   style: 'normal',
    // },
    {
      path: "../fonts/suisse-intl/SuisseIntl-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/suisse-intl/SuisseIntl-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/suisse-intl/SuisseIntl-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/suisse-intl/SuisseIntl-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    // {
    //   path: '../fonts/suisse-intl/SuisseIntl-Black.woff2',
    //   weight: '900',
    //   style: 'normal',
    // },
  ],
  variable: "--font-suisse-intl",
})

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata.default" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={`${suisseIntl.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <QueryClientProviderWrapper>
            <PrefetchRoutes />
            <CitysLivingModal />
            <MasterplanModal />
            <ResidencePlanModal />
            {children}
          </QueryClientProviderWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
