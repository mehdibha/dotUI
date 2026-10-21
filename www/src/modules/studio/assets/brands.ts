/* The built-in brands' assets: the real logos of the products the presets
   recreate, each still its owner's trademark. Marks come from Simple Icons
   (CC0 path data); single-color, so light and dark differ only where the
   brand color would vanish on a dark page. Wordmarks are the brands' own
   SVGs (press kits, or svgl.app where none is published), served from
   `public/studio/wordmarks/`.
   Notion and Material Design publish no wordmark. */

import {
  siAirbnb,
  siClaude,
  siDuolingo,
  siGithub,
  siLinear,
  siMaterialdesign,
  siNotion,
  siRadixui,
  siShopify,
  siSpotify,
  siStripe,
  siSupabase,
  siVercel,
} from "simple-icons"
import type { SimpleIcon } from "simple-icons"

import type { BrandName } from "../axes/assets"

/** An image source per mode; `dark` falls back to `light`. */
export interface Asset {
  light: string
  dark?: string
}

export interface BrandAssets {
  name: string
  logo: Asset
  wordmark?: Asset
}

const svg = (path: string, hex: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#${hex}"><path d="${path}"/></svg>`,
  )}`

/** Near-black marks (GitHub, Notion, Radix, Vercel) turn white on dark. */
const isNearBlack = (hex: string) =>
  [0, 2, 4].every((i) => parseInt(hex.slice(i, i + 2), 16) < 0x30)

/** A wordmark served from `public/studio/wordmarks/`. */
const wordmark = (file: string) => `/studio/wordmarks/${file}.svg`

function mark({ title, path, hex }: SimpleIcon, color = hex): BrandAssets {
  return {
    name: title,
    logo: {
      light: svg(path, color),
      dark: isNearBlack(color) ? svg(path, "FFFFFF") : undefined,
    },
  }
}

export const BRANDS: Record<BrandName, BrandAssets> = {
  // Rausch as airbnb.com paints it today; Simple Icons keeps the 2014 #FF5A5F.
  airbnb: {
    ...mark(siAirbnb, "FF385C"),
    wordmark: { light: wordmark("airbnb") },
  },
  claude: {
    ...mark(siClaude),
    wordmark: { light: wordmark("claude"), dark: wordmark("claude-dark") },
  },
  duolingo: { ...mark(siDuolingo), wordmark: { light: wordmark("duolingo") } },
  github: {
    ...mark(siGithub),
    wordmark: { light: wordmark("github"), dark: wordmark("github-dark") },
  },
  // The 8-bar logo is IBM's only mark, a wordmark itself.
  ibm: {
    name: "IBM",
    logo: { light: wordmark("ibm"), dark: wordmark("ibm-dark") },
    wordmark: { light: wordmark("ibm"), dark: wordmark("ibm-dark") },
  },
  linear: {
    ...mark(siLinear),
    wordmark: { light: wordmark("linear"), dark: wordmark("linear-dark") },
  },
  material: mark(siMaterialdesign),
  notion: mark(siNotion),
  radix: {
    ...mark(siRadixui),
    name: "Radix",
    wordmark: { light: wordmark("radix"), dark: wordmark("radix-dark") },
  },
  shopify: {
    ...mark(siShopify),
    wordmark: { light: wordmark("shopify"), dark: wordmark("shopify-dark") },
  },
  spotify: { ...mark(siSpotify), wordmark: { light: wordmark("spotify") } },
  stripe: { ...mark(siStripe), wordmark: { light: wordmark("stripe") } },
  supabase: {
    ...mark(siSupabase),
    wordmark: { light: wordmark("supabase"), dark: wordmark("supabase-dark") },
  },
  vercel: {
    ...mark(siVercel),
    wordmark: { light: wordmark("vercel"), dark: wordmark("vercel-dark") },
  },
}
