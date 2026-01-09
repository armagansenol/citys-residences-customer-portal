"use client"

import { useState, useEffect, useRef } from "react"
import Script from "next/script"
import { LoadingSpinner } from "@/components/loading-spinner"
import "@ungap/with-resolvers"

interface PDFViewerProps {
  file: string
  title?: string
}

declare global {
  interface Window {
    pdfjsLib: typeof import("pdfjs-dist/types/src/pdf")
  }
}

export function PDFViewer({ file, title }: PDFViewerProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  // Check if pdfjsLib is already loaded (e.g., from a previous mount)
  const [pdfjsReady, setPdfjsReady] = useState(() => typeof window !== "undefined" && !!window.pdfjsLib)
  const containerRef = useRef<HTMLDivElement>(null)

  // Also check on mount in case SSR hydration set it to false
  useEffect(() => {
    if (window.pdfjsLib && !pdfjsReady) {
      setPdfjsReady(true)
    }
  }, [])

  useEffect(() => {
    async function renderPDF() {
      if (typeof window === "undefined" || !containerRef.current || !pdfjsReady || !window.pdfjsLib) return

      try {
        const pdfjs = window.pdfjsLib as typeof import("pdfjs-dist/types/src/pdf")

        // Set worker source to local file path
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs"

        // Use proxy for external URLs to avoid CORS issues
        const isExternalUrl = file.startsWith("http://") || file.startsWith("https://")
        const pdfUrl = isExternalUrl ? `/api/pdf-proxy?url=${encodeURIComponent(file)}` : file

        // Fetch PDF as ArrayBuffer
        const pdfResponse = await fetch(pdfUrl)
        if (!pdfResponse.ok) {
          throw new Error(`Failed to fetch PDF: ${pdfResponse.status}`)
        }
        const pdfData = await pdfResponse.arrayBuffer()

        const loadingTask = pdfjs.getDocument({ data: pdfData })
        const pdf = await loadingTask.promise

        // Clear existing canvases
        const container = containerRef.current
        container.innerHTML = ""

        // Calculate container width for scaling
        const containerWidth = container.clientWidth || 800

        // Render all pages
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum)

          // Calculate scale to fit container width, accounting for device pixel ratio
          const viewport = page.getViewport({ scale: 1.0 })
          const baseScale = containerWidth / viewport.width
          const devicePixelRatio = window.devicePixelRatio || 1

          // Use a multiplier that scales with device pixel ratio but stays within a stable range (2x to 3x).
          // 5x was causing extremely large canvases on desktop, leading to rendering artifacts ("over-resolutioned" look).
          const qualityMultiplier = Math.min(Math.max(devicePixelRatio, 2), 3)
          const renderScale = baseScale * qualityMultiplier
          const scaledViewport = page.getViewport({ scale: renderScale })

          // Create canvas for this page
          const canvas = document.createElement("canvas")
          // Set canvas resolution for sharp rendering
          canvas.width = scaledViewport.width
          canvas.height = scaledViewport.height
          // Set CSS dimensions to display at correct size (scale back down)
          canvas.style.width = `${scaledViewport.width / qualityMultiplier}px`
          canvas.style.height = `${scaledViewport.height / qualityMultiplier}px`
          canvas.className = "block w-full h-auto"
          canvas.style.marginBottom = pageNum < pdf.numPages ? "1rem" : "0"
          canvas.style.imageRendering = "auto" // Ensure smooth downscaling

          container.appendChild(canvas)

          // Render PDF page to canvas
          const context = canvas.getContext("2d")!
          context.imageSmoothingEnabled = true
          context.imageSmoothingQuality = "high"

          const renderContext = {
            canvasContext: context,
            viewport: scaledViewport,
            canvas: canvas,
          }

          await page.render(renderContext).promise
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Failed to render PDF:", error)
        setHasError(true)
        setIsLoading(false)
      }
    }

    if (file && pdfjsReady) {
      renderPDF()
    }
  }, [file, pdfjsReady])

  if (hasError) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='space-y-4 text-center'>
          <div className='text-sm text-gray-400'>PDF görüntüleyici yüklenemedi.</div>
          <a
            href={file}
            target='_blank'
            rel='noreferrer'
            className='inline-block rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/20'
          >
            PDF&apos;yi Yeni Sekmede Aç
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      <Script
        src='/pdfjs/pdf.mjs'
        type='module'
        strategy='afterInteractive'
        onLoad={() => {
          // Wait for window.pdfjsLib to be available
          const checkInterval = setInterval(() => {
            if (window.pdfjsLib) {
              clearInterval(checkInterval)
              setPdfjsReady(true)
            }
          }, 50)

          // Timeout after 3 seconds
          setTimeout(() => {
            clearInterval(checkInterval)
            if (!window.pdfjsLib) {
              console.error("PDF.js failed to load: window.pdfjsLib is not available")
              setHasError(true)
              setIsLoading(false)
            }
          }, 3000)
        }}
        onError={() => {
          console.error("Failed to load PDF.js script")
          setHasError(true)
          setIsLoading(false)
        }}
      />
      <div className='relative w-full min-h-[calc(100vh-var(--spacing-header-height))] overflow-hidden bg-white'>
        {isLoading && (
          <div className='absolute inset-0 z-10 flex items-center justify-center bg-white'>
            <div className='size-10 text-bricky-brick'>
              <LoadingSpinner />
            </div>
          </div>
        )}
        <div ref={containerRef} className='w-full' title={title} />
      </div>
    </>
  )
}
