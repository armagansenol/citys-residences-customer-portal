"use client"

import s from "./styles.module.css"

import { cn } from "@/lib/utils"
import { ArrowsOutIcon, BarbellIcon, HandbagIcon, HouseIcon, LaptopIcon, TreeIcon } from "@phosphor-icons/react"
import { useIntersectionObserver, useWindowSize } from "hamo"
import { useTranslations } from "next-intl"
import { Fragment, useCallback, useEffect, useRef, useState } from "react"

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
      mobileBorder: true,
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
      mobileBorder: true,
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
        <span className='size-16 lg:size-24 xl:size-16 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 bg-gray-100 rounded-full p-4 lg:p-6 xl:p-4 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100'>
          <ArrowsOutIcon className='pointer-events-none size-full text-black' weight='thin' aria-hidden />
        </span>
      </span>
      <div className='absolute top-12 left-10 xl:left-14 xl:top-14 3xl:left-24 3xl:top-24 z-50 font-primary text-6xl/none font-light xl:text-8xl/none text-white'>
        <div className='flex items-center justify-center gap-2'>
          <div className='relative font-primary text-5xl/none font-light xl:text-6xl/none 3xl:text-7xl/none'>
            {tLifeIn5Minutes("mainTitle.number")}
            <div className='absolute left-1/2 top-1/2 size-[100px] -translate-x-[50%] -translate-y-[60%] opacity-90 xl:size-[120px] 3xl:size-[160px]'>
              <SvgFiveMins />
            </div>
          </div>
          <div className='flex flex-col items-start justify-center'>
            <div className='font-primary text-sm/none font-normal xl:text-xl/none 3xl:text-2xl/none'>
              {tLifeIn5Minutes("mainTitle.line1")}
            </div>
            <div className='font-primary text-sm/none font-light xl:text-xl/none 3xl:text-2xl/none'>
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
        <div className='w-full relative z-30 flex flex-col items-center justify-end gap-4 py-4 lg:flex-row lg:gap-0 xl:items-stretch xl:py-8 2xl:py-6 3xl:py-8'>
          <div className='flex items-end justify-evenly w-full'>
            {lifeIn5Minutes.map((item, idx) => (
              <Fragment key={item.title}>
                <div className='flex items-center justify-center gap-x-1 lg:gap-x-4 xl:gap-x-2 2xl:gap-x-3'>
                  <div className='size-5 xl:size-8 3xl:size-10'>{item.icon}</div>
                  <div className='flex flex-col items-start justify-center'>
                    <div className='whitespace-nowrap font-primary text-[9px]/tight font-medium xl:text-sm/tight 3xl:text-lg/tight'>
                      {item.d1}
                    </div>
                    <div className='whitespace-nowrap font-primary text-[9px]/tight font-light xl:text-sm/tight 3xl:text-lg/tight'>
                      {item.d2}
                    </div>
                  </div>
                </div>
                {idx !== lifeIn5Minutes.length - 1 && <span className='block w-px h-6 xl:h-10 bg-white/30 shrink-0' />}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return container
}
