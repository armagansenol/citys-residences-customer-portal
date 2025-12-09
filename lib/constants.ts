import { routing, type Locale, type Pathnames } from "@/i18n/routing"

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
  muxSrc: "OsgPIrhKWKCZk7Jt8zpV1MsOvJL59cXc77bomiWVYe4",
  thumbnail: "https://image.mux.com/OsgPIrhKWKCZk7Jt8zpV1MsOvJL59cXc77bomiWVYe4/thumbnail.webp?width=1920&time=0",
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
  id: string
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
    id: "home",
    order: 4,
    disabled: false,
    isExternal: false,
    inNavbar: false,
    media: websiteMedia,
  },
  "/residence-plan": {
    paths: {
      tr: "/residence-plan",
      en: "/residence-plan",
    },
    titleKey: "navigation.residencePlan",
    id: "residence-plan",
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
    id: "masterplan",
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
    id: "citys-living",
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
    id: "website",
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

function getNavigationRoutes() {
  return Object.entries(routeConfig)
    .filter(([, config]) => config !== undefined)
    .map(([routeKey, config]) => {
      const defaultPath = config.paths[routing.defaultLocale] || routeKey
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
  const pathConfig = routing.pathnames[routeKey]

  if (!pathConfig) {
    return routeKey
  }

  if (typeof pathConfig === "string") {
    return pathConfig
  }

  return pathConfig[locale] || pathConfig[routing.defaultLocale]
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
