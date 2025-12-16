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
  const [pdfjsReady, setPdfjsReady] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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

          // Calculate scale to fit container width
          const viewport = page.getViewport({ scale: 1.0 })
          const scale = containerWidth / viewport.width
          const scaledViewport = page.getViewport({ scale })

          // Create canvas for this page
          const canvas = document.createElement("canvas")
          canvas.width = scaledViewport.width
          canvas.height = scaledViewport.height
          canvas.className = "block w-full"
          canvas.style.marginBottom = pageNum < pdf.numPages ? "1rem" : "0"

          container.appendChild(canvas)

          // Render PDF page to canvas
          const renderContext = {
            canvasContext: canvas.getContext("2d")!,
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
