/* eslint-disable @next/next/no-img-element */
"use client"

import { useLocale } from "next-intl"
import { useMemo, useRef } from "react"

import { AutoplayVideo } from "@/components/autoplay-video"
import { gsap, ScrollTrigger, useGSAP } from "@/components/gsap"
import { LocaleTransitionLink } from "@/components/locale-transition-link"
import type { Locale, Pathnames } from "@/i18n/routing"
import { routeConfig, type SectionIdType } from "@/lib/constants"

export interface HorizontalScrollProps {
  /**
   * Callback when active section changes during horizontal scroll
   */
  onSectionChange?: (sectionId: SectionIdType) => void
}

export function HorizontalScroll({ onSectionChange }: HorizontalScrollProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const pinRef = useRef<HTMLDivElement | null>(null)
  const locale = useLocale()

  const navbarSections = useMemo(
    () =>
      Object.values(routeConfig)
        .filter((item) => item.inNavbar)
        .sort((a, b) => a.order - b.order),
    []
  )

  useGSAP(
    () => {
      const section = sectionRef.current
      const pin = pinRef.current
      if (!section || !pin) return

      gsap.registerPlugin(ScrollTrigger)

      const containerAnimation = gsap.to(pin, {
        x: () => -(pin.scrollWidth - document.documentElement.clientWidth),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + (pin.scrollWidth - window.innerWidth),
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      // Track active section during horizontal scroll
      navbarSections.forEach((item) => {
        if (!item.id) return
        const slide = pin.querySelector<HTMLElement>(`[data-slide="${item.id}"]`)
        if (!slide) return

        ScrollTrigger.create({
          trigger: slide,
          start: "left center",
          end: "right center",
          containerAnimation,
          toggleClass: { targets: slide, className: "active" },
          onEnter: () => onSectionChange?.(item.id!),
          onEnterBack: () => onSectionChange?.(item.id!),
        })
      })

      // Set initial active section to the first item (since it's already visible on load)
      const firstSection = navbarSections[0]
      if (firstSection?.id) {
        onSectionChange?.(firstSection.id)
      }
    },
    { scope: sectionRef, dependencies: [navbarSections.length, onSectionChange], revertOnUpdate: true }
  )

  return (
    <div>
      <section ref={sectionRef} className='relative min-h-screen w-full overflow-hidden block xl:hidden'>
        <div ref={pinRef} className='flex h-screen w-max items-end pb-24' id='section_pin'>
          {navbarSections.map((item) => (
            <div key={item.id} data-slide={item.id} className='w-screen shrink-0 px-8'>
              <div className='flex w-full items-center justify-center'>
                <LocaleTransitionLink
                  href={item.paths[locale as Locale] as Pathnames}
                  locale={locale as Locale}
                  className='w-full aspect-16/14'
                >
                  <AutoplayVideo playbackId={item.media?.muxSrc} />
                </LocaleTransitionLink>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
