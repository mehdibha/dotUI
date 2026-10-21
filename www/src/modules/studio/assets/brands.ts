/* The built-in brands' assets: the real marks of the products the presets
   recreate, from Simple Icons (CC0 path data; each mark stays its owner's
   trademark). Single-color marks, so light and dark differ only where the
   brand color would vanish on a dark page. No wordmarks yet: Simple Icons
   ships marks only. */

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
  airbnb: mark(siAirbnb, "FF385C"),
  claude: mark(siClaude),
  duolingo: mark(siDuolingo),
  github: mark(siGithub),
  linear: mark(siLinear),
  material: mark(siMaterialdesign),
  notion: mark(siNotion),
  radix: { ...mark(siRadixui), name: "Radix" },
  shopify: mark(siShopify),
  spotify: mark(siSpotify),
  stripe: mark(siStripe),
  supabase: mark(siSupabase),
  vercel: mark(siVercel),
}
