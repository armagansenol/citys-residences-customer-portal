"use client"

import { useState } from "react"

interface PDFViewerProps {
  file: string
  title?: string
}

export function PDFViewer({ file, title }: PDFViewerProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <div className='text-center space-y-4'>
          <div className='text-sm text-gray-400'>PDF görüntüleyici yüklenemedi.</div>
          <a
            href={file}
            target='_blank'
            rel='noreferrer'
            className='inline-block rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white hover:bg-white/20 transition-colors'
          >
            PDF&apos;yi Yeni Sekmede Aç
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full overflow-hidden rounded-lg bg-white'>
      <iframe
        src={`${file}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&view=FitH`}
        className='w-full aspect-[1/1.414] border-0'
        title={title}
        onError={() => setHasError(true)}
      />
    </div>
  )
}
