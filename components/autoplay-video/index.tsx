"use client"

import s from "./styles.module.css"

import { cn } from "@/lib/utils"
import { LaptopIcon, HandbagIcon, PlayCircleIcon, TreeIcon, HouseIcon, BarbellIcon } from "@phosphor-icons/react"
import { useIntersectionObserver, useWindowSize } from "hamo"
import dynamic from "next/dynamic"
import { useCallback, useEffect, useRef, useState } from "react"

import { Image } from "@/components/image"
import { breakpoints } from "@/styles/config.mjs"
import { useTranslations } from "next-intl"

const FullScreenVideoDialog = dynamic(
  () => import("@/components/dialogs/full-screen-video-dialog").then((module) => module.FullScreenVideoDialog),
  { ssr: false }
)

interface AutoplayVideoProps {
  playbackId?: string
  mobilePlaybackId?: string
  aspectRatio?: number
  enableFullscreen?: boolean
  horizontalPosition?: number
  verticalPosition?: number
}

export function AutoplayVideo({
  playbackId,
  mobilePlaybackId,
  aspectRatio,
  enableFullscreen = false,
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
  const wasPlayingBeforeDialogRef = useRef(false)
  const [ready, setReady] = useState(false)
  const [shouldLoadDialog, setShouldLoadDialog] = useState(false)

  const t = useTranslations("home")
  const tCommon = useTranslations("common")

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
    if (entry?.isIntersecting) {
      if (!hasLoadedRef.current) {
        hasLoadedRef.current = true
        // The browser will automatically select the appropriate source based on media queries
        el.load()
      }

      if (enableFullscreen && !shouldLoadDialog) {
        setShouldLoadDialog(true)
      }
    }

    // auto play / pause behavior
    if (entry && !entry.isIntersecting) {
      el.pause()
    } else if (entry?.isIntersecting && el.paused) {
      el.play().catch(() => {})
    }
  }, [entry, playbackId, mobilePlaybackId, enableFullscreen, shouldLoadDialog])

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
          },
          enableFullscreen && "cursor-pointer"
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
      d1: t("lifeIn5Minutes.items.home"),
      d2: t("lifeIn5Minutes.items.homeDuration"),
      icon: <HouseIcon className='size-full' weight='thin' />,
      mobileBorder: false,
      desktopBorder: true,
    },
    {
      title: "office",
      d1: t("lifeIn5Minutes.items.office"),
      d2: t("lifeIn5Minutes.items.officeDuration"),
      icon: <LaptopIcon className='size-full' weight='thin' />,
      mobileBorder: true,
      desktopBorder: true,
    },
    {
      title: "mall",
      d1: t("lifeIn5Minutes.items.mall"),
      d2: t("lifeIn5Minutes.items.mallDuration"),
      icon: <HandbagIcon className='size-full' weight='thin' />,
      mobileBorder: true,
      desktopBorder: true,
    },
    {
      title: "nature",
      d1: t("lifeIn5Minutes.items.nature"),
      d2: t("lifeIn5Minutes.items.natureDuration"),
      icon: <TreeIcon className='size-full' weight='thin' />,
      mobileBorder: false,
      desktopBorder: true,
    },
    {
      title: "sports",
      d1: t("lifeIn5Minutes.items.sports"),
      d2: t("lifeIn5Minutes.items.sportsDuration"),
      icon: <BarbellIcon className='size-full' weight='thin' />,
      mobileBorder: true,
      desktopBorder: true,
    },
  ]

  const handleDialogOpenChange = useCallback(
    (isOpen: boolean) => {
      const el = playerRef.current
      if (!el) return

      if (isOpen) {
        // Dialog is opening - pause the main video and remember if it was playing
        wasPlayingBeforeDialogRef.current = !el.paused
        el.pause()
      } else {
        // Dialog is closing - resume if it was playing and still intersecting
        if (wasPlayingBeforeDialogRef.current && entry?.isIntersecting) {
          el.play().catch(() => {})
        }
      }
    },
    [entry]
  )

  const container = (
    <div className={cn("group", "relative h-full w-full", enableFullscreen && "cursor-pointer")} ref={setContainerRef}>
      {videoContent}
      {enableFullscreen && activePlaybackId && shouldLoadDialog && (
        <div className='absolute inset-0 z-30'>
          <FullScreenVideoDialog
            dialogTrigger={null}
            mediaId={playbackId ?? ""}
            aspectRatio={aspectRatio}
            onOpenChange={handleDialogOpenChange}
            loading='page'
          />
        </div>
      )}
      {enableFullscreen && (
        <span
          className={cn(
            "pointer-events-none absolute inset-0 z-50 bg-black/50 transition-all duration-300 ease-in-out group-hover:bg-black/30"
          )}
        >
          <PlayCircleIcon
            className='pointer-events-none absolute left-1/2 top-1/2 z-50 size-16 -translate-x-1/2 -translate-y-1/2 text-white transition-transform duration-300 ease-in-out group-hover:scale-125 xl:size-24'
            weight='fill'
          />
        </span>
      )}
    </div>
  )

  return container
}
