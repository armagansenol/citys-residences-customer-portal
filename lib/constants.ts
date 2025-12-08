import { routing, type Locale, type Pathnames } from "@/i18n/routing"

export const baseUrl = "citysresidences.com"
export const initialScroll = true
export const scrollDelay = 0.4

export const countryPhoneCodes = {
  en: [
    { name: "Argentina", code: "+54" },
    { name: "Australia", code: "+61" },
    { name: "Bangladesh", code: "+880" },
    { name: "Brazil", code: "+55" },
    { name: "Canada", code: "+1" },
    { name: "China", code: "+86" },
    { name: "Egypt", code: "+20" },
    { name: "France", code: "+33" },
    { name: "Germany", code: "+49" },
    { name: "India", code: "+91" },
    { name: "Indonesia", code: "+62" },
    { name: "Italy", code: "+39" },
    { name: "Japan", code: "+81" },
    { name: "Malaysia", code: "+60" },
    { name: "Mexico", code: "+52" },
    { name: "Nigeria", code: "+234" },
    { name: "Pakistan", code: "+92" },
    { name: "Philippines", code: "+63" },
    { name: "Russia", code: "+7" },
    { name: "Saudi Arabia", code: "+966" },
    { name: "Singapore", code: "+65" },
    { name: "South Africa", code: "+27" },
    { name: "South Korea", code: "+82" },
    { name: "Spain", code: "+34" },
    { name: "Thailand", code: "+66" },
    { name: "Turkey", code: "+90" },
    { name: "United Arab Emirates", code: "+971" },
    { name: "United Kingdom", code: "+44" },
    { name: "United States", code: "+1" },
    { name: "Vietnam", code: "+84" },
  ],
  tr: [
    { name: "Almanya", code: "+49" },
    { name: "Amerika Birleşik Devletleri", code: "+1" },
    { name: "Arjantin", code: "+54" },
    { name: "Avustralya", code: "+61" },
    { name: "Bangladeş", code: "+880" },
    { name: "Birleşik Arap Emirlikleri", code: "+971" },
    { name: "Birleşik Krallık", code: "+44" },
    { name: "Brezilya", code: "+55" },
    { name: "Çin", code: "+86" },
    { name: "Endonezya", code: "+62" },
    { name: "Filipinler", code: "+63" },
    { name: "Fransa", code: "+33" },
    { name: "Güney Afrika", code: "+27" },
    { name: "Güney Kore", code: "+82" },
    { name: "Hindistan", code: "+91" },
    { name: "İspanya", code: "+34" },
    { name: "İtalya", code: "+39" },
    { name: "Japonya", code: "+81" },
    { name: "Kanada", code: "+1" },
    { name: "Malezya", code: "+60" },
    { name: "Meksika", code: "+52" },
    { name: "Mısır", code: "+20" },
    { name: "Nijerya", code: "+234" },
    { name: "Pakistan", code: "+92" },
    { name: "Rusya", code: "+7" },
    { name: "Singapur", code: "+65" },
    { name: "Suudi Arabistan", code: "+966" },
    { name: "Tayland", code: "+66" },
    { name: "Türkiye", code: "+90" },
    { name: "Vietnam", code: "+84" },
  ],
}

export const citysIstanbulAvmGoogleMaps = "https://maps.app.goo.gl/R2mE9iNws7GrVDZg8"

// Navigation metadata for routes that should appear in navigation
// Keys MUST exist in routing.pathnames (type-safe!)
export type NavigationMetadata = {
  title: string
  titleKey: string
  href: string
  id: string
  order: number
  mainRoute: boolean
  isOnSidebar: boolean
  sections?: {
    [key: string]: {
      label: string
      id: string
    }
  }
}

// Only define metadata for routes that should appear in navigation
type NavigationConfigItem = {
  titleKey: string
  id: string
  order: number
  disabled: boolean
  isExternal: boolean
  href: string
  inNavbar: boolean
}

export const navigationConfig: Record<string, NavigationConfigItem> = {
  "/": {
    titleKey: "navigation.home",
    href: "/",
    id: "home",
    order: 4,
    disabled: false,
    isExternal: false,
    inNavbar: false,
  },
  "/residence-plan": {
    titleKey: "navigation.residencePlan",
    href: "/residence-plan",
    id: "residence-plan",
    order: 1,
    disabled: false,
    isExternal: false,
    inNavbar: true,
  },
  "/masterplan": {
    titleKey: "navigation.masterplan",
    href: "/masterplan",
    id: "masterplan",
    order: 2,
    disabled: false,
    isExternal: false,
    inNavbar: true,
  },
  "/citys-living": {
    titleKey: "navigation.citysLiving",
    href: "/citys-living",
    id: "citys-living",
    order: 3,
    disabled: false,
    isExternal: false,
    inNavbar: true,
  },
  "/website": {
    titleKey: "navigation.website",
    href: "https://citysresidences.com",
    id: "website",
    order: 5,
    disabled: false,
    isExternal: true,
    inNavbar: true,
  },
}

// Get routes that should appear in navigation
function getNavigationRoutes() {
  return Object.entries(navigationConfig)
    .filter(([, config]) => config !== undefined)
    .map(([routeKey, config]) => ({
      routeKey: routeKey as Pathnames,
      titleKey: config!.titleKey,
      id: config!.id,
      order: config!.order,
      disabled: config!.disabled,
      isExternal: config!.isExternal,
      href: config!.href,
    }))
    .sort((a, b) => a.order - b.order)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getNavigationItems = (t: (key: any) => string, locale: Locale) =>
  getNavigationRoutes().map((item) => ({
    title: t(item.titleKey),
    titleKey: item.titleKey,
    href: getLocalizedPath(item.routeKey, locale),
    id: item.id,
    order: item.order,
    disabled: item.disabled,
    isExternal: item.isExternal,
  }))

export const getNavigationItem = (
  id: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (key: any) => string,
  locale: Locale
) => {
  const item = getNavigationRoutes().find((navItem) => navItem.id === id)
  if (!item) return null

  return {
    title: t(item.titleKey),
    href: getLocalizedPath(item.routeKey, locale),
    id: item.id,
  }
}

// Helper function to get localized path from routing configuration
function getLocalizedPath(routeKey: Pathnames, locale: Locale): string {
  const pathConfig = routing.pathnames[routeKey]

  // Fallback in case a routeKey is missing from routing.pathnames
  if (!pathConfig) {
    return routeKey
  }

  if (typeof pathConfig === "string") {
    return pathConfig
  }

  return pathConfig[locale] || pathConfig[routing.defaultLocale]
}

// Menu media configuration for navigation items

function calculateRatio(width: number, height: number): number {
  const ratio = Number((width / height).toFixed(2))
  return ratio
}
export type Media = {
  name: string
  aspect: () => number
  mediaId: string
  muxSrc?: string
  thumbnail?: string
  muxSrcMobile?: string
  thumbnailMobile?: string
  aspectMobile?: () => number
}
export const heroVideo: Media = {
  name: "hero",
  aspect: () => {
    return calculateRatio(16, 9)
  },
  mediaId: "e2tew1zhxj",
  muxSrc: "xFW02Bl3KwJGCzmUUbAwE5NC5WJW01hIqmm7heGEYx2NM",
  thumbnail: "https://image.mux.com/xFW02Bl3KwJGCzmUUbAwE5NC5WJW01hIqmm7heGEYx2NM/thumbnail.webp?width=1920&time=0",
}
export const livePeacefully: Media = {
  name: "daha huzurlu yaşa",
  aspect: () => {
    return calculateRatio(1280, 852)
  },
  mediaId: "dxd0f32sha",
  muxSrc: "y1KN58bThKtP2SOOn8wNl27K3nx01RbSvIcWB3lFycug",
  thumbnail: "https://image.mux.com/y1KN58bThKtP2SOOn8wNl27K3nx01RbSvIcWB3lFycug/thumbnail.webp?width=1920&time=0",
}
export const liveMore: Media = {
  name: "daha dolu yaşa",
  aspect: () => {
    return calculateRatio(1920, 1198)
  },
  mediaId: "cpkxfmdyvb",
  muxSrc: "Qj00KNCUeq1hO00Ad2Xk402XRGm8ekmqNfsGOamzsVVcQ00",
  thumbnail: "https://image.mux.com/Qj00KNCUeq1hO00Ad2Xk402XRGm8ekmqNfsGOamzsVVcQ00/thumbnail.webp?width=1920&time=0",
}
export const projectBanner: Media = {
  name: "proje banner",
  aspect: () => {
    return calculateRatio(1920, 896)
  },
  mediaId: "p4l0a63nut",
  muxSrc: "fWSlJj9pskvE7rWRKuNLVIY2vQyAOD02NFSNdPwpDLuE",
  thumbnail: "https://image.mux.com/fWSlJj9pskvE7rWRKuNLVIY2vQyAOD02NFSNdPwpDLuE/thumbnail.webp?width=1920&time=0",
}
export const residencesBanner: Media = {
  name: "daireler banner",
  aspect: () => {
    return calculateRatio(1920, 1088)
  },
  mediaId: "4g5plgua2p",
  muxSrc: "cSjhDoPNBkNtVNwRuAvtWKE9BbGko7zA2Db5FR2oRq4",
  thumbnail: "https://image.mux.com/cSjhDoPNBkNtVNwRuAvtWKE9BbGko7zA2Db5FR2oRq4/thumbnail.webp?width=1920&time=0",
}
export const citysIstanbulAvmBanner: Media = {
  name: "citys istanbul avm banner",
  aspect: () => {
    return calculateRatio(16, 9)
  },
  aspectMobile: () => {
    return calculateRatio(2160, 3840)
  },
  mediaId: "a5b5zn9o9x",
  muxSrc: "Zq5jSeSQegjDYMVonJbtidTBV01IusZ00yePcyQT3rUgc",
  muxSrcMobile: "m3Uji9xDCxVh7AUZ7M9opTY02yOH25FPqisHx3MbW7NQ",
  thumbnail: "https://image.mux.com/hLCddwmtOdUZ3vvZFqxAXvwusE9f8M3qg5KDXqVBGHY/thumbnail.webp?width=1920&time=0",
  thumbnailMobile:
    "https://image.mux.com/dMs3k8j02Rre5EE02b4VjR8ygDa01t7ZeISDdMFDSoemYE/thumbnail.webp?width=560&time=0",
}
export const citysTimesBanner: Media = {
  name: "citys times banner",
  aspect: () => {
    return calculateRatio(1920, 848)
  },
  mediaId: "luxxfpk3x3",
  muxSrc: "NB02x73haYbyN18zmvgUntrAutAeqhWaZGf8gkUYUkmA",
  thumbnail: "https://image.mux.com/NB02x73haYbyN18zmvgUntrAutAeqhWaZGf8gkUYUkmA/thumbnail.webp?width=1920&time=0",
}

export const menuMedia = {
  home: {
    src: "t02RQRZKvwDfeT4fx8geKsf2DJbYycekKIfuNVlN5Pxg",
    type: "video",
    aspect: () => {
      return calculateRatio(960, 448)
    },
  },
  project: {
    src: "6e1qY5YeSpFR5OMpJ1QlA6yClBrZ9OMIFsFsxD01UQeQ",
    type: "video",
    aspect: () => {
      return calculateRatio(640, 366)
    },
  },
  location: {
    src: "/img/menu/map.jpg",
    type: "image",
  },
  residences: {
    src: "BXqqdjWdoD43nAxkBRFYXyxrYhjlAhoF3la4FVKWO5E",
    type: "video",
    aspect: () => {
      return calculateRatio(960, 444)
    },
  },
  "citys-park": {
    src: "/img/menu/citys-park.jpg",
    type: "image",
  },
  "citys-members-club": {
    src: "/img/menu/citys-members-club.jpg",
    type: "image",
  },
  "citys-living": {
    src: "/img/menu/citys-living.jpg",
    type: "image",
  },
  "citys-psm": {
    src: "nOlgN01VRX02T6miPEV9yI01KaJT4VG7vxSKIbw9nEIsEw",
    type: "video",
    aspect: () => {
      return calculateRatio(640, 400)
    },
  },
  "citys-istanbul-avm": {
    src: "/img/menu/citys-istanbul-avm.jpg",
    type: "image",
  },
  "citys-times": {
    src: "/img/menu/citys-times.jpg",
    type: "image",
  },
  "citys-dna": {
    src: "/img/menu/dna.jpg",
    type: "image",
  },
}

export const dnaMedia = {
  "dna-1": {
    src: "HFvdWmDDl02T005KHSCaIwQ00GCBn202lspPDUhKzVr4DbI",
    aspect: () => {
      return calculateRatio(1920, 1080)
    },
  },
  "dna-2": {
    src: "XjHLxIZovbD7edp5ri4UGMGjq43kV6jWRdLYvoZQfFI",
    aspect: () => {
      return calculateRatio(1920, 1080)
    },
  },
  "dna-3": {
    src: "3Pbo7b7jOZLGxnIRSkGYezI14n588ufsDuFoaflVhQ00",
    aspect: () => {
      return calculateRatio(1920, 1080)
    },
  },
  "dna-4": {
    src: "yMNk302xcu2ceaM8GIU3NNshg8CQXDVGSiqipmoUHB900",
    aspect: () => {
      return calculateRatio(1920, 1080)
    },
  },
  "dna-5": {
    src: "FMwvqj6iY7d00E8hJ9Qua2iA4lVMM4U02pqL1b7c7fY6Q",
    aspect: () => {
      return calculateRatio(1920, 1080)
    },
  },
  "dna-6": {
    src: "ghOISWG5ze784tt38k5OM8uSpAUmOV8Aj6jAFJxRd5M",
    aspect: () => {
      return calculateRatio(1920, 1080)
    },
  },
  "dna-7": {
    src: "GRpTm02jkYX4KE7barTAKhXhflf5DRuNv8FNNgxAhPUI",
    aspect: () => {
      return calculateRatio(1920, 1080)
    },
  },
  "dna-8": {
    src: "bEp02GRfCI900shhm7LqLDnaPddl701CcD2XgjfjVaC01Pg",
    aspect: () => {
      return calculateRatio(1920, 1080)
    },
  },
}

// Get menu text key from item ID
export const getMenuTextKey = (itemId: string): string => {
  const keyMap: Record<string, string> = {
    home: "home",
    project: "project",
    location: "location",
    residences: "residences",
    "citys-park": "citysPark",
    "citys-members-club": "citysMembersClub",
    "citys-living": "citysLiving",
    "citys-psm": "citysPsm",
    "citys-istanbul-avm": "citysIstanbulAvm",
    "citys-times": "citysTimes",
    "citys-dna": "citysDna",
  }
  return keyMap[itemId] || itemId
}

export const citysLivingMedia: Media = {
  name: "daha huzurlu yaşa",
  aspect: () => {
    return calculateRatio(1280, 852)
  },
  mediaId: "dxd0f32sha",
  muxSrc: "y1KN58bThKtP2SOOn8wNl27K3nx01RbSvIcWB3lFycug",
  thumbnail: "https://image.mux.com/y1KN58bThKtP2SOOn8wNl27K3nx01RbSvIcWB3lFycug/thumbnail.webp?width=1920&time=0",
}
