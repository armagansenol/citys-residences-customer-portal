"use client"

import Link from "next/link"
import type { ComponentProps } from "react"

type LocaleTransitionLinkProps = ComponentProps<typeof Link>

export function LocaleTransitionLink({ href, ...rest }: LocaleTransitionLinkProps) {
  return <Link {...rest} href={href} />
}
