import { create } from 'zustand'

interface State {
  resetAnimatedLogo: boolean
  setResetAnimatedLogo: (status: boolean) => void
  isMenuOpen: boolean
  setIsMenuOpen: (status: boolean) => void
  isModalContactFormOpen: boolean
  setIsModalContactFormOpen: (status: boolean) => void
  isCitysLivingModalOpen: boolean
  setIsCitysLivingModalOpen: (status: boolean) => void
  isMasterplanModalOpen: boolean
  setIsMasterplanModalOpen: (status: boolean) => void
  isResidencePlanModalOpen: boolean
  setIsResidencePlanModalOpen: (status: boolean) => void
  residencePlanModalSlug: string | null
  setResidencePlanModalSlug: (slug: string | null) => void
  isInquiryVisible: boolean
  setIsInquiryVisible: (status: boolean) => void
  isStickySidebarVisible: boolean
  setIsStickySidebarVisible: (status: boolean) => void
}

export const useStore = create<State>(set => ({
  isMenuOpen: false,
  setIsMenuOpen: status => set({ isMenuOpen: status }),
  resetAnimatedLogo: false,
  setResetAnimatedLogo: status => set({ resetAnimatedLogo: status }),
  isModalContactFormOpen: false,
  setIsModalContactFormOpen: status => set({ isModalContactFormOpen: status }),
  isCitysLivingModalOpen: false,
  setIsCitysLivingModalOpen: status => set({ isCitysLivingModalOpen: status }),
  isMasterplanModalOpen: false,
  setIsMasterplanModalOpen: status => set({ isMasterplanModalOpen: status }),
  isResidencePlanModalOpen: false,
  setIsResidencePlanModalOpen: status => set({ isResidencePlanModalOpen: status }),
  residencePlanModalSlug: null,
  setResidencePlanModalSlug: slug => set({ residencePlanModalSlug: slug }),
  isInquiryVisible: true,
  setIsInquiryVisible: status => set({ isInquiryVisible: status }),
  isStickySidebarVisible: true,
  setIsStickySidebarVisible: status => set({ isStickySidebarVisible: status }),
}))

export const useUiStore = useStore
