"use client"

import { useEffect, useRef, useState } from "react"
import MuxPlayer from "@mux/mux-player-react/lazy"
import type MuxPlayerElement from "@mux/mux-player"
import { colors } from "@/styles/config.mjs"
import { useLenis } from "lenis/react"
import { XIcon } from "@phosphor-icons/react"

interface FullScreenVideoDialogProps {
  dialogTrigger?: React.ReactNode
  mediaId: string
  aspectRatio?: number // Optional aspect ratio (width/height). If not provided, video will maintain natural aspect ratio
  onOpenChange?: (open: boolean) => void
  preload?: "none" | "metadata" | "auto"
  loading?: "page" | "viewport"
}

interface SafariVideoElement extends HTMLVideoElement {
  webkitEnterFullscreen?: () => void
}

export function FullScreenVideoDialog({
  dialogTrigger,
  mediaId,
  aspectRatio,
  onOpenChange,
  preload = "metadata",
  loading = "viewport",
}: FullScreenVideoDialogProps) {
  const lenis = useLenis()
  const playerRef = useRef<MuxPlayerElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!document.fullscreenElement
      setIsFullscreen(isFs)
      onOpenChange?.(isFs)

      if (!isFs && playerRef.current) {
        playerRef.current.pause()
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [onOpenChange])

  useEffect(() => {
    if (isFullscreen) {
      lenis?.stop()
    } else {
      lenis?.start()
    }
  }, [isFullscreen, lenis])

  const handleTriggerClick = async () => {
    if (playerRef.current) {
      setIsLoading(true)
      playerRef.current.muted = false
      try {
        await playerRef.current.play()
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen()
        } else if (playerRef.current.requestFullscreen) {
          await playerRef.current.requestFullscreen()
        } else if ((playerRef.current.media as unknown as SafariVideoElement)?.webkitEnterFullscreen) {
          ;(playerRef.current.media as unknown as SafariVideoElement).webkitEnterFullscreen?.()
        }
      } catch (err) {
        console.error("Failed to enter fullscreen", err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleClose = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }

  return (
    <>
      <div onClick={handleTriggerClick} className='relative h-full w-full cursor-pointer'>
        {dialogTrigger}
        {isLoading && (
          <div className='absolute bottom-0 left-0 h-1 w-full bg-white/30'>
            <div className='h-full w-full animate-pulse bg-tangerine-flake' />
          </div>
        )}
      </div>
      <div
        ref={containerRef}
        className='group fixed bottom-0 right-0 z-9999 h-0 w-0 overflow-hidden opacity-0 transition-opacity duration-500 [&:fullscreen]:h-full [&:fullscreen]:w-full [&:fullscreen]:opacity-100'
      >
        <button
          onClick={handleClose}
          className='absolute right-5 top-5 z-50 hidden rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/70 group-[:fullscreen]:block group-[:fullscreen]:animate-in group-[:fullscreen]:fade-in group-[:fullscreen]:zoom-in-95'
        >
          <XIcon size={24} />
        </button>
        <MuxPlayer
          ref={playerRef}
          className='h-full w-full'
          playbackId={mediaId}
          playsInline
          streamType='on-demand'
          style={
            {
              aspectRatio: aspectRatio,
              "--media-object-fit": "contain",
              "--fullscreen-button": "none",
              "--pip-button": "none",
            } as React.CSSProperties & Record<`--${string}`, string>
          }
          thumbnailTime={3}
          loading={loading}
          accentColor={colors["tangerine-flake"]}
          primaryColor={colors["white"]}
          secondaryColor={colors["transparent"]}
          preload={preload}
        />
      </div>
    </>
  )
}
