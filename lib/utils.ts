import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getUtmParameter = (param: string) => {
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(param) || ""
  }
  return ""
}

export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function toAllUppercase(str: string, locale?: string): string {
  // locale-aware uppercasing ensures characters like Turkish "i/ı" are handled correctly
  return locale ? str.toLocaleUpperCase(locale) : str.toLocaleUpperCase()
}

export function calculateRatio(width: number, height: number): number {
  const ratio = Number((width / height).toFixed(2))
  return ratio
}
