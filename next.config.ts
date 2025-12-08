import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

// Point the plugin to the request config so `next-intl/config`
// resolves correctly during build/runtime.
const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "image.mux.com",
      },
    ],
  },
}

export default withNextIntl(nextConfig)
