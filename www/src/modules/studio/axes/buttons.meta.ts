import {
  CASE_VALUES,
  PRESS_VALUES,
  RADIUS_VALUES,
  SECONDARY_VALUES,
  STYLE_VALUES,
} from "./buttons"
import { options } from "./core/meta"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  flat: { label: "Flat", description: "shadcn, Geist, Carbon" },
  hairline: { label: "Hairline", description: "Primer, Supabase" },
  "rim-light": { label: "Rim light", description: "Untitled UI" },
  gloss: { label: "Gloss", description: "Clerk" },
  bevel: { label: "Bevel", description: "Polaris, Radix classic" },
  ledge: { label: "Ledge", description: "Duolingo" },
})

export const SECONDARY_OPTIONS = options(SECONDARY_VALUES, {
  "as-style": { label: "As style", description: "Primer, Polaris" },
  outline: { label: "Outline", description: "shadcn, Geist, Notion, Stripe" },
  raised: { label: "Raised", description: "Supabase, Claude" },
  soft: { label: "Soft", description: "Radix, Airbnb, Spectrum 2" },
  tonal: { label: "Tonal", description: "Material 3" },
})

export const RADIUS_OPTIONS = options(RADIUS_VALUES, {
  same: { label: "Same as controls", description: "Primer, shadcn" },
  pill: { label: "Pill", description: "Material 3, Spectrum 2, Spotify" },
})

export const PRESS_OPTIONS = options(PRESS_VALUES, {
  "as-style": { label: "As style", description: "Primer, Carbon" },
  nudge: { label: "Nudge", description: "shadcn, Mantine" },
  scale: { label: "Scale", description: "Supabase, Claude" },
})

export const CASE_OPTIONS = options(CASE_VALUES, {
  sentence: { label: "Sentence", description: "shadcn, Primer" },
  uppercase: { label: "Uppercase", description: "Duolingo" },
})

export const OPTIONS = {
  buttonStyle: STYLE_OPTIONS,
  buttonSecondary: SECONDARY_OPTIONS,
  buttonRadius: RADIUS_OPTIONS,
  buttonPress: PRESS_OPTIONS,
  buttonCase: CASE_OPTIONS,
}
