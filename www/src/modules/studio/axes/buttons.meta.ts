import {
  CASE_VALUES,
  PRESS_VALUES,
  RADIUS_VALUES,
  SECONDARY_VALUES,
  STYLE_VALUES,
} from "./buttons"
import { options } from "./core/meta"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  flat: { label: "Flat", credits: ["shadcn", "Geist", "Carbon"] },
  hairline: { label: "Hairline", credits: ["Primer", "Supabase", "Stripe"] },
  "rim-light": { label: "Rim light", credits: ["Untitled UI"] },
  gloss: { label: "Gloss", credits: ["Clerk"] },
  bevel: { label: "Bevel", credits: ["Polaris", "Radix classic"] },
  ledge: { label: "Ledge", credits: ["Duolingo"] },
})

export const SECONDARY_OPTIONS = options(SECONDARY_VALUES, {
  "as-style": { label: "As style", credits: ["Primer", "Polaris"] },
  outline: {
    label: "Outline",
    credits: ["shadcn", "Geist", "Notion", "Stripe"],
  },
  raised: { label: "Raised", credits: ["Supabase", "Claude"] },
  soft: { label: "Soft", credits: ["Radix", "Airbnb", "Spectrum 2"] },
  tonal: { label: "Tonal", credits: ["Material 3"] },
  solid: { label: "Solid", credits: ["Carbon"] },
})

export const RADIUS_OPTIONS = options(RADIUS_VALUES, {
  same: { label: "Same as controls", credits: ["Primer", "shadcn"] },
  pill: { label: "Pill", credits: ["Material 3", "Spectrum 2", "Spotify"] },
})

export const PRESS_OPTIONS = options(PRESS_VALUES, {
  "as-style": { label: "As style", credits: ["Primer", "Carbon"] },
  nudge: { label: "Nudge", credits: ["shadcn", "Mantine"] },
  scale: { label: "Scale", credits: ["Supabase", "Claude"] },
})

export const CASE_OPTIONS = options(CASE_VALUES, {
  sentence: { label: "Sentence", credits: ["shadcn", "Primer"] },
  uppercase: { label: "Uppercase", credits: ["Duolingo"] },
})

export const OPTIONS = {
  buttonStyle: STYLE_OPTIONS,
  buttonSecondary: SECONDARY_OPTIONS,
  buttonRadius: RADIUS_OPTIONS,
  buttonPress: PRESS_OPTIONS,
  buttonCase: CASE_OPTIONS,
}
