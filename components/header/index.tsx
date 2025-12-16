"use client"

import { cn } from "@/lib/utils"

import { Logo } from "@/components/icons"
import { LocaleTransitionLink } from "@/components/locale-transition-link"
import { usePathname } from "@/i18n/navigation"

export function Header() {
  const pathname = usePathname()

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-header-height-mobile 2xl:h-header-height"
        // "before:pointer-events-none before:absolute before:top-0 before:left-0 before:right-0 before:z-20 before:h-[150%] xl:before:h-full before:gradient-top-white-smooth"
      )}
    >
      <div className='w-full px-6 lg:px-16 xl:px-16 mx-auto flex items-center justify-between h-full z-50 relative'>
        <LocaleTransitionLink
          href='/'
          className={cn(
            "block size-24 xl:size-24 2xl:size-32 3xl:size-36",
            pathname === "/" && "xl:translate-y-4 3xl:translate-y-8",
            pathname === "/" && "size-24 xl:size-30 2xl:size-36 3xl:size-40"
          )}
        >
          <Logo className='text-bricky-brick' />
        </LocaleTransitionLink>
        {/* SCROLL DOWN */}
        {/* {pathname === "/" && (
          <div className='relative animate-bounce-translate hidden size-10'>
            <IconScrollDown className='text-bricky-brick size-full' />
            <span className='sr-only'>Scroll Down</span>
          </div>
        )} */}
        {/* {pathname !== "/" && (
          <div
            className={cn(
              "text-bricky-brick font-medium mr-auto relative tracking-[0.25em]",
              "ml-10 sm:ml-10 lg:ml-16 xl:ml-24",
              "text-xs xl:text-lg 2xl:text-xl 3xl:text-xl",
              'before:content-[""] before:absolute before:-left-4 sm:before:-left-6 lg:before:-left-10 before:top-1/2 before:-translate-y-1/2 before:bg-bricky-brick/80 before:h-16 lg:before:h-12 before:w-px before:block'
            )}
          >
            {toAllUppercase(t(navigationItem?.titleKey), locale)}
          </div>
        )} */}
      </div>
    </header>
  )
}
