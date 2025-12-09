"use client"

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useLenis } from "lenis/react"
import { useEffect, useState } from "react"

interface ZoomImageDialogProps {
  dialogTrigger?: React.ReactNode
  dialogContent?: React.ReactNode
  aspectRatio?: number
}

export function ZoomImageDialog({ dialogTrigger, dialogContent, aspectRatio }: ZoomImageDialogProps) {
  const lenis = useLenis()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      lenis?.stop()
    } else {
      lenis?.start()
    }
  }, [lenis, open])

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {dialogTrigger && (
        <DialogTrigger
          className='group relative w-full cursor-pointer'
          style={
            {
              aspectRatio: aspectRatio,
            } as React.CSSProperties
          }
        >
          {dialogTrigger}
        </DialogTrigger>
      )}
      <DialogContent className='relative' showCloseButton={false}>
        <DialogTitle className='sr-only'>Enlarged Image View</DialogTitle>
        <div
          className={cn(
            "relative",
            "flex flex-col items-center justify-center",
            "max-h-[95vh] max-w-[100vw] xl:max-w-[90vw]",
            "h-full w-screen xl:h-[95vh] xl:w-full"
          )}
          style={
            {
              aspectRatio: aspectRatio,
            } as React.CSSProperties
          }
        >
          {dialogContent}
        </div>
      </DialogContent>
    </Dialog>
  )
}
