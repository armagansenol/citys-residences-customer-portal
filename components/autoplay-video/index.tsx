"use client"

import s from "./styles.module.css"

import { cn } from "@/lib/utils"
import { ArrowsOutIcon, BarbellIcon, HandbagIcon, HouseIcon, LaptopIcon, TreeIcon } from "@phosphor-icons/react"
import { useIntersectionObserver, useWindowSize } from "hamo"
import { useTranslations } from "next-intl"
import { useCallback, useEffect, useRef, useState } from "react"

import { Image } from "@/components/image"
import { breakpoints } from "@/styles/config.mjs"
import { SvgFiveMins } from "@/svgs/five-mins"

interface AutoplayVideoProps {
  playbackId?: string
  mobilePlaybackId?: string
  aspectRatio?: number
  horizontalPosition?: number
  verticalPosition?: number
}

export function AutoplayVideo({
  playbackId,
  mobilePlaybackId,
  aspectRatio,
  horizontalPosition = 50,
  verticalPosition = 50,
}: AutoplayVideoProps) {
  const { width: windowWidth } = useWindowSize(100)
  const isMobile = typeof windowWidth === "number" && windowWidth < breakpoints.breakpointMobile
  const activePlaybackId = isMobile ? mobilePlaybackId || playbackId : playbackId
  const poster = `https://image.mux.com/${activePlaybackId}/thumbnail.webp?width=${isMobile ? 560 : 1920}&time=0`

  const playerRef = useRef<HTMLVideoElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const hasLoadedRef = useRef(false)
  const [ready, setReady] = useState(false)

  const tLifeIn5Minutes = useTranslations("lifeIn5Minutes")

  const [setIntersectionRef, entry] = useIntersectionObserver({
    root: null,
    rootMargin: "1500px 0px 1500px 0px",
    threshold: 0,
  })

  const setContainerRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node
      setIntersectionRef(node ?? undefined)
    },
    [setIntersectionRef]
  )

  useEffect(() => {
    const el = playerRef.current
    if (!el || (!playbackId && !mobilePlaybackId)) return

    // Lazy load video sources when intersecting
    if (entry?.isIntersecting && !hasLoadedRef.current) {
      hasLoadedRef.current = true
      // The browser will automatically select the appropriate source based on media queries
      el.load()
    }

    // auto play / pause behavior
    if (entry && !entry.isIntersecting) {
      el.pause()
    } else if (entry?.isIntersecting && el.paused) {
      el.play().catch(() => {})
    }
  }, [entry, playbackId, mobilePlaybackId])

  const videoContent = (
    <>
      <Image
        src={poster}
        alt='Video Thumbnail'
        fill
        mobileSize='100vw'
        desktopSize='100vw'
        className={cn(s.thumbnail, "z-10 object-cover")}
        style={
          {
            "--aspect-ratio": aspectRatio,
            "--horizontal-position": `${horizontalPosition ?? 50}%`,
            "--vertical-position": `${verticalPosition ?? 50}%`,
          } as React.CSSProperties
        }
      />
      <video
        ref={playerRef}
        poster={undefined}
        onLoadedData={() => setReady(true)}
        className={cn(
          s.video,
          "absolute inset-0 h-full w-full object-cover object-center",
          "z-20 transition-opacity duration-500",
          {
            "opacity-0": !ready,
            "opacity-100": ready,
          }
        )}
        style={
          {
            "--aspect-ratio": aspectRatio,
            "--horizontal-position": `${horizontalPosition ?? 50}%`,
            "--vertical-position": `${verticalPosition ?? 50}%`,
          } as React.CSSProperties
        }
        muted
        loop
        playsInline
        preload='none'
        disablePictureInPicture
        controlsList='nodownload noplaybackrate'
      >
        {(mobilePlaybackId || playbackId) && (
          <source
            src={`https://stream.mux.com/${mobilePlaybackId || playbackId}/highest.mp4`}
            media='(max-width: 799px)'
            type='video/mp4'
          />
        )}
        {playbackId && (
          <source
            src={`https://stream.mux.com/${playbackId}/highest.mp4`}
            media='(min-width: 800px)'
            type='video/mp4'
          />
        )}
      </video>
    </>
  )

  const lifeIn5Minutes = [
    {
      title: "home",
      d1: tLifeIn5Minutes("items.home"),
      d2: tLifeIn5Minutes("items.homeDuration"),
      icon: <HouseIcon className='size-full' weight='thin' />,
      mobileBorder: false,
      desktopBorder: true,
    },
    {
      title: "office",
      d1: tLifeIn5Minutes("items.office"),
      d2: tLifeIn5Minutes("items.officeDuration"),
      icon: <LaptopIcon className='size-full' weight='thin' />,
      mobileBorder: true,
      desktopBorder: true,
    },
    {
      title: "mall",
      d1: tLifeIn5Minutes("items.mall"),
      d2: tLifeIn5Minutes("items.mallDuration"),
      icon: <HandbagIcon className='size-full' weight='thin' />,
      mobileBorder: true,
      desktopBorder: true,
    },
    {
      title: "nature",
      d1: tLifeIn5Minutes("items.nature"),
      d2: tLifeIn5Minutes("items.natureDuration"),
      icon: <TreeIcon className='size-full' weight='thin' />,
      mobileBorder: false,
      desktopBorder: true,
    },
    {
      title: "sports",
      d1: tLifeIn5Minutes("items.sports"),
      d2: tLifeIn5Minutes("items.sportsDuration"),
      icon: <BarbellIcon className='size-full' weight='thin' />,
      mobileBorder: true,
      desktopBorder: true,
    },
  ]

  const container = (
    <div className={cn("group", "relative h-full w-full")} ref={setContainerRef}>
      {videoContent}
      <span
        className={cn(
          "pointer-events-none absolute inset-0 z-30 bg-black/10 transition-all duration-300 ease-in-out group-hover:bg-black/0"
        )}
      >
        <span className='size-24 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 bg-gray-100 rounded-full p-6'>
          <ArrowsOutIcon
            className='pointer-events-none size-full text-black transition-transform duration-300 ease-in-out group-hover:scale-125'
            weight='thin'
            aria-hidden
          />
        </span>
      </span>
      <div className='absolute top-24 left-24 z-50 font-primary text-6xl/none font-light xl:text-8xl/none text-white'>
        {tLifeIn5Minutes("mainTitle.number")}
        <div className='absolute left-1/2 top-1/2 size-[150px] -translate-x-[52%] -translate-y-[54%] opacity-90 xl:size-[220px]'>
          <SvgFiveMins />
        </div>
        <div className='flex flex-1 items-center justify-center gap-1 px-6 xl:px-12'>
          <div className='flex flex-col items-start justify-center'>
            <div className='font-primary text-xl/none font-normal xl:text-3xl/none'>
              {tLifeIn5Minutes("mainTitle.line1")}
            </div>
            <div className='font-primary text-xl/none font-light xl:text-3xl/none'>
              {tLifeIn5Minutes("mainTitle.line2")}
            </div>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "absolute inset-0 z-50 h-full w-full",
          "before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:z-20 before:h-[50%] before:w-full before:bg-linear-to-t before:from-black/90 before:to-transparent",
          "flex items-end justify-center lg:justify-end",
          "font-primary text-white"
        )}
      >
        <div className='relative z-30 flex flex-col items-center justify-end gap-4 py-8 lg:flex-row lg:gap-0 xl:items-stretch'>
          <div className='flex flex-wrap items-end justify-center xl:flex-nowrap xl:justify-start'>
            {lifeIn5Minutes.map((item) => (
              <div
                className={cn(
                  "flex items-center justify-center gap-x-2 px-4 py-5 lg:gap-x-4 xl:px-8 xl:py-8 3xl:px-12 3xl:py-10",
                  item.desktopBorder && "lg:border-l lg:border-white/80",
                  item.mobileBorder && "border-l border-white/80"
                )}
                key={item.title}
              >
                <div className='size-6 xl:size-8 3xl:size-12'>{item.icon}</div>
                <div className='flex flex-col items-start justify-center'>
                  <div className='whitespace-nowrap font-primary text-[10px]/tight font-normal xl:text-base/tight 3xl:text-xl/tight'>
                    {item.d1}
                  </div>
                  <div className='whitespace-nowrap font-primary text-[10px]/tight font-light xl:text-base/tight 3xl:text-xl/tight'>
                    {item.d2}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return container
}
