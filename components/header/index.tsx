"use client"

import { Locale, useLocale, useTranslations } from "next-intl"

import { Logo } from "@/components/icons"
import { usePathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { routeConfig } from "@/lib/constants"
import { cn, toAllUppercase } from "@/lib/utils"
import { XIcon } from "@phosphor-icons/react"
import Link from "next/link"

const isLocale = (value: string): value is Locale => routing.locales.some((locale) => locale === value)

export function Header() {
  const locale = useLocale()
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const normalizedSegments = segments.length > 0 && isLocale(segments[0]) ? segments.slice(1) : segments
  const navigationKey = normalizedSegments.length ? `/${normalizedSegments[0]}` : "/"
  const navigationItem = routeConfig[navigationKey]
  const t = useTranslations("common")

  console.log("pathname", pathname)

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-header-height-mobile lg:h-header-height",
        "before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:z-20 before:h-[200%] before:w-full before:bg-linear-to-b before:from-white before:to-transparent"
      )}
    >
      <div className='container mx-auto px-8 lg:px-8 flex items-center justify-between h-full z-50 relative py-4'>
        <Link href='/' locale={locale as Locale} className='block h-full'>
          <Logo className='text-bricky-brick' />
        </Link>
        {pathname !== "/" && (
          <div
            className={cn(
              "text-bricky-brick font-medium mr-auto relative tracking-[0.35em]",
              "ml-6 sm:ml-10 lg:ml-16 xl:ml-24",
              "text-sm sm:text-lg md:text-xl",
              'before:content-[""] before:absolute before:-left-4 sm:before:-left-6 lg:before:-left-10 before:top-1/2 before:-translate-y-1/2 before:bg-bricky-brick  before:h-8 sm:before:h-10 lg:before:h-12 before:w-px before:block'
            )}
          >
            {toAllUppercase(t(navigationItem?.titleKey))}
          </div>
        )}
        {pathname !== "/" && (
          <Link className='ml-auto' href='/' locale={locale as Locale}>
            <XIcon className='size-9 sm:size-10 lg:size-12 text-bricky-brick' weight='light' />
            <span className='sr-only'>Close</span>
          </Link>
        )}
      </div>
    </header>
  )
}
