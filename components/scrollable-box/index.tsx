'use client'

import s from './scrollable-box.module.css'

import { gsap } from '@/components/gsap'
import { cn } from '@/lib/utils'
import Lenis from 'lenis'
import { ReactNode, useEffect, useRef, useState } from 'react'

type Props = {
  children: ReactNode
  className?: string
  infinite?: boolean
  reset?: boolean
  scrollTo?: string | null
  orientation?: 'vertical' | 'horizontal'
}

const ScrollableBox = ({
  children,
  className,
  infinite,
  reset,
  scrollTo = null,
  orientation = 'vertical',
}: Props) => {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapperRef.current) return
    if (!contentRef.current) return

    const lenis = new Lenis({
      wrapper: wrapperRef.current, // element which has overflow
      content: contentRef.current, // usually wrapper's direct child
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      orientation: orientation,
      gestureOrientation: orientation,
      smoothWheel: true,
      infinite,
    })
    setLenis(lenis)

    return () => {
      lenis.destroy()
    }
  }, [infinite, orientation])

  useEffect(() => {
    function update(time: number) {
      lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)
  }, [lenis])

  useEffect(() => {
    if (reset) {
      lenis?.scrollTo(0, { immediate: true })
    }
  }, [lenis, reset])

  useEffect(() => {
    if (!scrollTo) return
    const scopedSelector = wrapperRef.current?.querySelector(
      scrollTo
    ) as HTMLElement
    lenis?.scrollTo(scopedSelector)
  }, [lenis, scrollTo])

  return (
    <div className={cn(s.scrollableBox, className)} ref={wrapperRef}>
      <div ref={contentRef}>{children}</div>
    </div>
  )
}

export { ScrollableBox }
