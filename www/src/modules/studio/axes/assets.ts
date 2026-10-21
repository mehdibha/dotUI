/* Assets — the brand a system wears in the preview: its logo and wordmark,
   each in a light and a dark variant. Built-in brands only for now (the
   products the presets recreate); uploads come later. Preview-only: no
   asset reaches exported code. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

export const BRAND_VALUES = [
  "none",
  "airbnb",
  "claude",
  "duolingo",
  "github",
  "ibm",
  "linear",
  "material",
  "notion",
  "radix",
  "shopify",
  "spotify",
  "stripe",
  "supabase",
  "vercel",
] as const

export type BrandName = Exclude<(typeof BRAND_VALUES)[number], "none">

export const chapter = defineChapter({
  id: "assets",
  defaults: {
    brandAssets: "none",
  },
  schema: {
    brandAssets: oneOf(BRAND_VALUES),
  },
  resolve(state: Effective): Resolved {
    return state.brandAssets === "none"
      ? {}
      : { assets: state.brandAssets as BrandName }
  },
})
