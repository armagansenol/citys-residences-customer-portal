"use client"

import { CaretLeftIcon, XIcon } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import { useLenis } from "lenis/react"
import { AnimatePresence, motion } from "motion/react"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useLocale, useTranslations } from "next-intl"

import { Logo } from "@/components/icons"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ExpiredProposalDialog } from "@/components/dialogs/expired-proposal-dialog"
import { PDFViewer } from "@/components/residence-plan/pdf-viewer"
import { ResidencePlanCard } from "@/components/residence-plan/residence-plan-card"
import { useEsc } from "@/hooks/useEsc"
import { useMobileLandscapeHeader } from "@/hooks/use-mobile-landscape-header"
import { fetchProposalById, generateProposalSlug, type ProposalItem } from "@/lib/api/proposals"
import { useStore } from "@/lib/store/ui"
import { cn, toAllUppercase } from "@/lib/utils"

/**
 * Get the fetch URL for a PDF file (handles proxy for external URLs)
 */
function getPdfFetchUrl(file: string): string {
  const isExternalUrl = file.startsWith("http://") || file.startsWith("https://")
  return isExternalUrl ? `/api/pdf-proxy?url=${encodeURIComponent(file)}` : file
}

/**
 * Prefetch PDF files to warm up the browser cache
 * Uses low priority fetch to avoid blocking other requests
 */
async function prefetchPDF(file: string): Promise<void> {
  try {
    const url = getPdfFetchUrl(file)
    await fetch(url, {
      method: "GET",
      // Use cache to ensure the response is stored
      cache: "force-cache",
      // Low priority to not block other requests
      priority: "low",
    } as RequestInit)
  } catch {
    // Silently fail - prefetch is an optimization, not critical
    console.debug(`[PDF Prefetch] Failed to prefetch: ${file}`)
  }
}

// Placeholder images - you can replace these with actual images or use a default
const PLACEHOLDER_IMAGES = ["/img/rp-1.jpg", "/img/rp-2.jpg", "/img/rp-3.jpg", "/img/rp-4.jpg"]

function getPlaceholderImage(index: number): string {
  return PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length]
}

export function ResidencePlanModal() {
  const isOpen = useStore((state) => state.isResidencePlanModalOpen)
  const setIsOpen = useStore((state) => state.setIsResidencePlanModalOpen)
  const slug = useStore((state) => state.residencePlanModalSlug)
  const setSlug = useStore((state) => state.setResidencePlanModalSlug)
  const lenis = useLenis()
  const searchParams = useSearchParams()
  const proposalId = searchParams?.get("id") || null
  const locale = useLocale()
  const tCommon = useTranslations("common")
  const [showExpiredDialog, setShowExpiredDialog] = useState(false)
  const [expiredProposalUser, setExpiredProposalUser] = useState<{ name?: string; phone?: string }>({})

  const prefetchedRef = useRef<Set<string>>(new Set())
  const modalContentRef = useRef<HTMLDivElement>(null)

  // Custom hook for mobile landscape header hide/show behavior
  const { showHeader, isLandscape } = useMobileLandscapeHeader({ isOpen })

  const { data, isLoading, isError } = useQuery({
    queryKey: ["proposal", proposalId],
    queryFn: () => {
      if (!proposalId) {
        throw new Error("Proposal ID is required")
      }
      return fetchProposalById(proposalId)
    },
    enabled: Boolean(proposalId) && isOpen,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  })

  // Prefetch all PDFs when data loads and we're in list view
  const prefetchAllPDFs = useCallback((proposals: ProposalItem[]) => {
    proposals.forEach((proposal) => {
      // Skip if already prefetched
      if (prefetchedRef.current.has(proposal.File)) return

      prefetchedRef.current.add(proposal.File)
      prefetchPDF(proposal.File)
    })
  }, [])

  // Trigger prefetch when modal opens and data is available
  useEffect(() => {
    if (isOpen && data && !slug) {
      // Prefetch all PDFs from both active and expired lists
      const allProposals = [...data.data.active, ...data.data.expired]
      prefetchAllPDFs(allProposals)
    }
  }, [isOpen, data, slug, prefetchAllPDFs])

  // Scroll modal content to top when switching views (slug changes)
  useLayoutEffect(() => {
    if (!modalContentRef.current) return

    if (slug) {
      modalContentRef.current.scrollTop = 0
      return
    }

    modalContentRef.current.scrollTop = 0
  }, [slug])

  useEsc(() => {
    if (slug) {
      setSlug(null)
    } else {
      setIsOpen(false)
    }
  }, isOpen)

  useEffect(() => {
    if (isOpen) {
      lenis?.stop()
      document.body.style.overflow = "hidden"
    } else {
      lenis?.start()
      document.body.style.overflow = ""
      setSlug(null)
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen, lenis, setSlug])

  const handleCardClick = (selectedSlug: string) => {
    // Check if proposal is in the expired list
    const expiredProposal = data?.data.expired.find((p) => generateProposalSlug(p) === selectedSlug)

    if (expiredProposal) {
      setExpiredProposalUser({
        name: expiredProposal.User,
        phone: expiredProposal.UserMobilePhone,
      })
      setShowExpiredDialog(true)
    } else {
      setSlug(selectedSlug)
    }
  }

  const handleBack = () => {
    setSlug(null)
  }

  // Find the proposal that matches the slug
  const selectedProposal = slug && data?.data.active.find((p) => generateProposalSlug(p) === slug)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='fixed inset-0 z-200 bg-white'
            onClick={() => {
              if (slug) {
                handleBack()
              } else {
                setIsOpen(false)
              }
            }}
          />

          {/* Modal Content */}
          <motion.div
            ref={modalContentRef}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className='fixed inset-0 z-201 overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
            data-modal-content
          >
            <div
              className={cn(
                "h-header-height-mobile xl:h-header-height fixed top-0 left-0 right-0 z-202 flex items-center justify-between px-6 lg:px-16 xl:px-16",
                "transition-opacity duration-500 ease-in-out",
                isLandscape && !showHeader && "opacity-0 pointer-events-none"
              )}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className={cn(
                  "size-24 sm:size-24 lg:size-36",
                  "flex items-center justify-center",
                  "text-bricky-brick",
                  "transition-opacity duration-300 hover:opacity-70",
                  "cursor-pointer"
                )}
                aria-label='Close'
                type='button'
              >
                <Logo className='size-full text-bricky-brick' />
              </button>
              <span
                className={cn(
                  "block ml-8 xl:ml-24",
                  "text-bricky-brick font-medium mr-auto relative tracking-[0.25em] whitespace-nowrap",
                  "text-xs xl:text-lg 2xl:text-xl 3xl:text-xl",
                  'before:content-[""] before:absolute before:-left-4 sm:before:-left-6 lg:before:-left-10 before:top-1/2 before:-translate-y-1/2 before:bg-bricky-brick/80 before:h-16 lg:before:h-12 before:w-px before:block'
                )}
              >
                {toAllUppercase(tCommon("navigation.residencePlan"), locale)}
              </span>

              {/* Close Button */}
              <button
                onClick={() => {
                  if (slug) {
                    handleBack()
                  } else {
                    setIsOpen(false)
                  }
                }}
                className={cn(
                  "size-10 sm:size-12 lg:size-14",
                  "flex items-center justify-center",
                  "text-bricky-brick",
                  "transition-opacity duration-300 hover:opacity-70",
                  "cursor-pointer"
                )}
                aria-label={slug ? "Back" : "Close"}
                type='button'
              >
                {slug ? (
                  // <span className='flex items-center justify-center'>
                  //   <CaretLeftIcon className='size-full' weight='light' />
                  //   <span className='text-bricky-brick font-primary font-medium text-lg tracking-[0.25em] whitespace-nowrap'>
                  //     {toAllUppercase(tCommon("backToProposals"), locale)}
                  //   </span>
                  // </span>
                  <CaretLeftIcon className='size-full' weight='light' />
                ) : (
                  <XIcon className='size-full' weight='light' />
                )}
              </button>
            </div>

            {/* Content */}
            <div className='min-h-screen w-full py-header-height-mobile lg:py-header-height'>
              {/* Fixed Header Background */}
              <div
                className={cn(
                  "fixed top-0 left-0 right-0 z-40 h-header-height-mobile 2xl:h-[calc(var(--spacing-header-height)/1.35)]",
                  "gradient-bg-white",
                  "transition-opacity duration-500 ease-in-out",
                  isLandscape && !showHeader && "opacity-0"
                )}
              ></div>
              {isLoading ? (
                <section className='w-full px-8 lg:px-16 xl:px-24 2xl:px-32'>
                  <div className='flex min-h-screen items-center justify-center'>
                    <LoadingSpinner />
                  </div>
                </section>
              ) : isError || !data ? (
                <section className='w-full px-8 lg:px-16 xl:px-24 2xl:px-32'>
                  <div className='flex min-h-screen items-center justify-center'>
                    <p className='text-sm text-red-500'>
                      Teklif bilgileri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
                    </p>
                  </div>
                </section>
              ) : slug && selectedProposal ? (
                // PDF Viewer View
                <section className='w-full px-8 lg:px-16 xl:px-16 py-10 lg:py-0 space-y-6' data-lenis-prevent>
                  <div className='w-full'>
                    <PDFViewer
                      file={selectedProposal.File}
                      title={`${selectedProposal.Block} ${selectedProposal.UnitNo} ${selectedProposal.UnitType} pdf viewer`}
                    />
                  </div>
                </section>
              ) : (
                // List View
                <section className='w-full px-6 lg:px-16 xl:px-24 2xl:px-32'>
                  <div className='flex flex-col gap-8 lg:gap-8 xl:gap-6 2xl:gap-4 3xl:gap-8 pt-12 lg:grid lg:grid-cols-3 xl:grid-cols-4'>
                    {[...data.data.active, ...data.data.expired].map((proposal, index) => {
                      const proposalSlug = generateProposalSlug(proposal)
                      return (
                        <ResidencePlanCard
                          key={`${proposal.Block}-${proposal.UnitNo}-${proposal.UnitType}-${index}`}
                          onClick={() => handleCardClick(proposalSlug)}
                          href='#'
                          image={getPlaceholderImage(index)}
                          block={proposal.Block}
                          floor={proposal.Floor}
                          number={`No ${proposal.UnitNo} | ${proposal.UnitType}`}
                          installmentPeriod={proposal.InstallmentPeriod}
                        />
                      )
                    })}
                  </div>
                </section>
              )}
            </div>
          </motion.div>

          <ExpiredProposalDialog
            isOpen={showExpiredDialog}
            onClose={() => setShowExpiredDialog(false)}
            userName={expiredProposalUser.name}
            userPhone={expiredProposalUser.phone}
          />
        </>
      )}
    </AnimatePresence>
  )
}
