"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { routeConfig } from "@/lib/constants"
import { useLocale } from "next-intl"
import { Locale } from "@/i18n/routing"

export function PrefetchRoutes() {
  const locale = useLocale()
  const router = useRouter()

  useEffect(() => {
    // router.prefetch(routeConfig["/residence-plan"].paths[locale as Locale])
    // router.prefetch(routeConfig["/masterplan"].paths[locale as Locale]) // Now a modal, no need to prefetch
    // router.prefetch(routeConfig["/citys-living"].paths[locale as Locale]) // Now a modal, no need to prefetch
  }, [router, locale])

  return null
}
