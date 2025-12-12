"use client"

import { useLocale } from "next-intl"
import { Link as ViewTransitionLink } from "next-view-transitions"
import type { ComponentProps } from "react"

import { type Locale, routing } from "@/i18n/routing"

type LocaleTransitionLinkProps = ComponentProps<typeof ViewTransitionLink> & {
  locale?: Locale
}

const localePrefixRegex = (locales: readonly string[]) => new RegExp(`^/(?:${locales.join("|")})(/|$)`)

const addLocaleToHref = (href: LocaleTransitionLinkProps["href"], locale: Locale, locales: readonly string[]) => {
  if (typeof href !== "string") return href
  // External or already localized links should bypass prefixing
  if (!href.startsWith("/")) return href
  if (localePrefixRegex(locales).test(href)) return href
  if (href === "/") return `/${locale}`
  return `/${locale}${href}`
}

export function LocaleTransitionLink({ locale: localeProp, href, ...rest }: LocaleTransitionLinkProps) {
  const localeFromHook = useLocale()
  const locale = (localeProp ?? localeFromHook) as Locale
  const localizedHref = addLocaleToHref(href, locale, routing.locales)

  return <ViewTransitionLink {...rest} href={localizedHref} />
}
