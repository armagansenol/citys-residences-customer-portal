import createMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

const SUPPORTED_LOCALES = ["tr", "en"] as const
const LOCALE_COOKIE = "LOCALE"

type Geo = {
  country?: string
}

export default function middleware(req: NextRequest) {
  const { nextUrl } = req
  const geo = (req as NextRequest & { geo?: Geo }).geo

  // Current requested path
  const path = nextUrl.pathname
  const localeInPath = path.split("/")[1]

  // If URL already contains a locale
  const hasLocaleInPath = SUPPORTED_LOCALES.includes(localeInPath as (typeof SUPPORTED_LOCALES)[number])

  // 1) When user visits `/tr/...` or `/en/...`,
  //    store that locale in a cookie for future visits.
  if (hasLocaleInPath) {
    const res = intlMiddleware(req)

    // Save locale in cookie
    const userPref = req.cookies.get(LOCALE_COOKIE)?.value
    if (userPref !== localeInPath) {
      res.cookies.set(LOCALE_COOKIE, localeInPath, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      })
    }

    return res
  }

  // 2) No locale in URL → detect locale preference
  // Priority: Cookie > Geo > Default

  // Geo detection
  const country = geo?.country?.toUpperCase()
  const detectedLocale = country === "TR" ? "tr" : "en"

  // Check if cookie exists
  const userPref = req.cookies.get(LOCALE_COOKIE)?.value
  const userHasPreference = SUPPORTED_LOCALES.includes(userPref as (typeof SUPPORTED_LOCALES)[number])

  // Use cookie if it exists, otherwise fall back to geo detection
  const finalLocale = userHasPreference ? userPref : detectedLocale

  return NextResponse.redirect(new URL(`/${finalLocale}${path}${nextUrl.search}`, req.url))
}

export const config = {
  matcher: ["/", "/(tr|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
}
