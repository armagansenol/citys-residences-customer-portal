import { create } from 'zustand'

interface State {
  resetAnimatedLogo: boolean
  setResetAnimatedLogo: (status: boolean) => void
  isMenuOpen: boolean
  setIsMenuOpen: (status: boolean) => void
  isModalContactFormOpen: boolean
  setIsModalContactFormOpen: (status: boolean) => void
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
  isInquiryVisible: true,
  setIsInquiryVisible: status => set({ isInquiryVisible: status }),
  isStickySidebarVisible: true,
  setIsStickySidebarVisible: status => set({ isStickySidebarVisible: status }),
}))

export const useUiStore = useStore
