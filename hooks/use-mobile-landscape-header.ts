import { useEffect, useState, useRef } from "react"

interface UseMobileLandscapeHeaderOptions {
  isOpen: boolean
  scrollThreshold?: number
  hideTimeout?: number
  mobileBreakpoint?: number
}

export function useMobileLandscapeHeader({
  isOpen,
  scrollThreshold = 50,
  hideTimeout = 2000,
  mobileBreakpoint = 1024,
}: UseMobileLandscapeHeaderOptions) {
  const [showHeader, setShowHeader] = useState(true)
  const [isLandscape, setIsLandscape] = useState(false)
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)

  // Detect landscape orientation on mobile
  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth < mobileBreakpoint
      const isLandscapeMode = window.innerWidth > window.innerHeight
      setIsLandscape(isMobile && isLandscapeMode)

      // Reset header visibility when orientation changes
      setShowHeader(true)
      lastScrollY.current = 0
    }

    checkOrientation()
    window.addEventListener("resize", checkOrientation)
    window.addEventListener("orientationchange", checkOrientation)

    return () => {
      window.removeEventListener("resize", checkOrientation)
      window.removeEventListener("orientationchange", checkOrientation)
    }
  }, [mobileBreakpoint])

  // Handle scroll events on the modal content
  useEffect(() => {
    if (!isOpen || !isLandscape) return

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement
      const currentScrollY = target.scrollTop

      // Clear any existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }

      // Hide header when scrolling down
      if (currentScrollY > lastScrollY.current && currentScrollY > scrollThreshold) {
        setShowHeader(false)
      }

      // Show header when scrolling up or at the top
      if (currentScrollY < lastScrollY.current || currentScrollY < scrollThreshold) {
        setShowHeader(true)
      }

      lastScrollY.current = currentScrollY

      // Show header again after timeout of no scrolling
      scrollTimeout.current = setTimeout(() => {
        setShowHeader(true)
      }, hideTimeout)
    }

    const modalContent = document.querySelector("[data-modal-content]") as HTMLElement
    if (modalContent) {
      modalContent.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (modalContent) {
        modalContent.removeEventListener("scroll", handleScroll)
      }
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
    }
  }, [isOpen, isLandscape, scrollThreshold, hideTimeout])

  return { showHeader, isLandscape }
}

