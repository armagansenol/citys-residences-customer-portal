import { MouseEventHandler } from "react"
import { create } from "zustand"

enum CursorType {
  default = "default",
  view = "view",
}

interface CursorEvents {
  cursorView: {
    onMouseEnter: MouseEventHandler
    onMouseLeave: MouseEventHandler
  }
}

interface State {
  type: CursorType
  visible: boolean
  magnetEl: HTMLDivElement | null
  toggleVisibility: () => void
  setCursor: (type: CursorType) => void
  setMagnetEl: (el: HTMLDivElement | null) => void
  events: CursorEvents
  reset: () => void
}

const useStore = create<State>((set, get) => ({
  magnetEl: null,
  type: CursorType.default,
  visible: false,
  toggleVisibility: () => set({ visible: !get().visible }),
  setCursor: (type) => set({ type }),
  setMagnetEl: (magnetEl) => set({ magnetEl }),
  reset: () => get().type !== CursorType.default && set(() => ({ type: CursorType.default })),
  events: {
    cursorView: {
      onMouseEnter: () => get().type !== CursorType.view && set(() => ({ type: CursorType.view })),
      onMouseLeave: () => set(() => ({ type: CursorType.default })),
    },
  },
}))

export const useCursorStore = useStore
