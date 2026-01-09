import type { Locale, Pathnames } from "@/i18n/routing"

export const SectionId = {
  RESIDENCE_PLAN: "residence-plan",
  MASTERPLAN: "masterplan",
  CITYS_LIVING: "citys-living",
  WEBSITE: "website",
} as const

export type SectionIdType = (typeof SectionId)[keyof typeof SectionId]

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

export const baseUrl = "citysresidences.com"
export const initialScroll = true
export const scrollDelay = 0.4

export const citysIstanbulAvmGoogleMaps = "https://maps.app.goo.gl/R2mE9iNws7GrVDZg8"

export const websiteMedia: Media = {
  name: "website video",
  aspect: () => {
    return calculateRatio(1920, 848)
  },
  mediaId: "5z00572s3c",
  muxSrc: "IjIOxFqyazI4ANqxp2478BAKP3023gb0201TVMIktPmEPQ",
  thumbnail: "https://image.mux.com/IjIOxFqyazI4ANqxp2478BAKP3023gb0201TVMIktPmEPQ/thumbnail.webp?width=1920&time=0",
}

export const citysLivingMedia: Media = {
  name: "citys living video",
  aspect: () => {
    return calculateRatio(1920, 1198)
  },
  mediaId: "cpkxfmdyvb",
  muxSrc: "Qj00KNCUeq1hO00Ad2Xk402XRGm8ekmqNfsGOamzsVVcQ00",
  thumbnail: "https://image.mux.com/Qj00KNCUeq1hO00Ad2Xk402XRGm8ekmqNfsGOamzsVVcQ00/thumbnail.webp?width=1920&time=0",
}

export const residencePlanMedia: Media = {
  name: "residence plan video",
  aspect: () => {
    return calculateRatio(1920, 896)
  },
  mediaId: "p4l0a63nut",
  muxSrc: "fWSlJj9pskvE7rWRKuNLVIY2vQyAOD02NFSNdPwpDLuE",
  thumbnail: "https://image.mux.com/fWSlJj9pskvE7rWRKuNLVIY2vQyAOD02NFSNdPwpDLuE/thumbnail.webp?width=1920&time=0",
}

export const masterplanMedia: Media = {
  name: "masterplan video",
  aspect: () => {
    return calculateRatio(1920, 848)
  },
  mediaId: "luxxfpk3x3",
  muxSrc: "twlqfuHVasIAshKTVMuVIMPMKfzAMHS9r5c6wEFvido",
  thumbnail: "https://image.mux.com/twlqfuHVasIAshKTVMuVIMPMKfzAMHS9r5c6wEFvido/thumbnail.webp?width=1920&time=0",
}

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

type RouteConfig = {
  paths: Record<Locale, string>
  titleKey: string
  id?: SectionIdType
  order: number
  disabled: boolean
  isExternal: boolean
  inNavbar?: boolean
  media?: Media
}

export const routeConfig: Record<string, RouteConfig> = {
  "/": {
    paths: {
      tr: "/",
      en: "/",
    },
    titleKey: "navigation.home",
    order: 4,
    disabled: false,
    isExternal: false,
    inNavbar: false,
    media: websiteMedia,
  },
  "/residence-plan": {
    paths: {
      tr: "/daire-plani",
      en: "/residence-plan",
    },
    titleKey: "navigation.residencePlan",
    id: SectionId.RESIDENCE_PLAN,
    order: 1,
    disabled: false,
    isExternal: false,
    inNavbar: true,
    media: residencePlanMedia,
  },
  "/masterplan": {
    paths: {
      tr: "/masterplan",
      en: "/masterplan",
    },
    titleKey: "navigation.masterplan",
    id: SectionId.MASTERPLAN,
    order: 2,
    disabled: false,
    isExternal: false,
    inNavbar: true,
    media: masterplanMedia,
  },
  "/citys-living": {
    paths: {
      tr: "/citys-living",
      en: "/citys-living",
    },
    titleKey: "navigation.citysLiving",
    id: SectionId.CITYS_LIVING,
    order: 3,
    disabled: false,
    isExternal: false,
    inNavbar: true,
    media: citysLivingMedia,
  },
  "/website": {
    paths: {
      tr: "https://citysresidences.com",
      en: "https://citysresidences.com",
    },
    titleKey: "navigation.website",
    id: SectionId.WEBSITE,
    order: 5,
    disabled: false,
    isExternal: true,
    inNavbar: true,
    media: websiteMedia,
  },
}

export const pathnames = Object.entries(routeConfig).reduce((acc, [key, config]) => {
  if (config.isExternal) return acc
  acc[key] = config.paths
  return acc
}, {} as Record<string, string | { tr: string; en: string }>)

// Localize dynamic residence plan detail route without exposing it in nav config.
pathnames["/residence-plan/[slug]"] = {
  tr: "/daire-plani/[slug]",
  en: "/residence-plan/[slug]",
}

// Keep a local defaultLocale to avoid runtime import cycles with routing.ts.
const defaultLocale: Locale = "tr"

function getNavigationRoutes() {
  return Object.entries(routeConfig)
    .filter(([, config]) => config !== undefined)
    .map(([routeKey, config]) => {
      const defaultPath = config.paths[defaultLocale] || routeKey
      return {
        routeKey: routeKey as Pathnames,
        titleKey: config!.titleKey,
        id: config!.id,
        order: config!.order,
        disabled: config!.disabled,
        isExternal: config!.isExternal,
        href: defaultPath,
        inNavbar: config.inNavbar,
      }
    })
    .sort((a, b) => a.order - b.order)
}

export const getNavigationItems = (t: (key: any) => string, locale: Locale) =>
  getNavigationRoutes().map((item) => ({
    title: t(item.titleKey),
    titleKey: item.titleKey,
    href: item.isExternal
      ? routeConfig[item.routeKey]?.paths[locale] ?? item.href
      : getLocalizedPath(item.routeKey, locale),
    id: item.id,
    order: item.order,
    disabled: item.disabled,
    isExternal: item.isExternal,
    inNavbar: item.inNavbar,
  }))

export const getNavigationItem = (id: string, t: (key: any) => string, locale: Locale) => {
  const item = getNavigationRoutes().find((navItem) => navItem.id === id)
  if (!item) return null

  return {
    title: t(item.titleKey),
    href: getLocalizedPath(item.routeKey, locale),
    id: item.id,
  }
}

function getLocalizedPath(routeKey: Pathnames, locale: Locale): string {
  const pathConfig = pathnames[routeKey]

  if (!pathConfig) {
    return routeKey
  }

  if (typeof pathConfig === "string") {
    return pathConfig
  }

  return pathConfig[locale] || pathConfig[defaultLocale]
}

function calculateRatio(width: number, height: number): number {
  const ratio = Number((width / height).toFixed(2))
  return ratio
}

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

export const socialMedia = {
  facebook: "https://www.facebook.com/profile.php?id=61574032204752",
  instagram: "https://www.instagram.com/citysresidences",
  x: "https://www.x.com/citysresidences",
  tiktok: "https://www.tiktok.com/@citysresidences",
}
