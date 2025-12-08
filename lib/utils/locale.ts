import { cookies } from 'next/headers'
import { routing } from '@/i18n/routing'

const SUPPORTED_LOCALES = ['tr', 'en'] as const
const LOCALE_COOKIE = 'LOCALE'

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

/**
 * Server-side helper to get the active locale from cookies
 * Falls back to the default locale if no cookie is found
 */
export async function getActiveLocale(): Promise<SupportedLocale> {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get(LOCALE_COOKIE)?.value

  if (
    localeCookie &&
    SUPPORTED_LOCALES.includes(localeCookie as SupportedLocale)
  ) {
    return localeCookie as SupportedLocale
  }

  return routing.defaultLocale as SupportedLocale
}

/**
 * Get the locale cookie name (for reference)
 */
export function getLocaleCookieName(): string {
  return LOCALE_COOKIE
}
