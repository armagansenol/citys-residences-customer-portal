"use client"

import { useLocale, useTranslations } from "next-intl"

import { Header } from "@/components/header"
import { SmoothScroll } from "@/components/smooth-scroll"
import { cn } from "@/lib/utils"

interface CountryData {
  isoCode: string
  name: string
}

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  lenis?: boolean
  webgl?: boolean | object
  stickySidebar?: boolean
  headerWithNavigation?: boolean
  contactForm?: boolean
  footer?: boolean
  countries?: CountryData[]
}

export function Wrapper({
  children,
  lenis = true,
  className,
  stickySidebar = true,
  headerWithNavigation = true,
  footer = true,
  contactForm = true,
  countries = [],
  ...props
}: WrapperProps) {
  const locale = useLocale()
  const t = useTranslations("common")

  return (
    <>
      <div>
        <Header />
        <main className={cn(className)} {...props}>
          {children}
        </main>
      </div>
      {lenis && <SmoothScroll root />}
    </>
  )
}
