import {
  CASE_VALUES,
  PRESS_VALUES,
  RADIUS_VALUES,
  SECONDARY_VALUES,
} from "./buttons"
import { options } from "./core/meta"

export const SECONDARY_OPTIONS = options(SECONDARY_VALUES, {
  "as-style": {
    label: "As style",
    description: "The Style's own secondary",
    credits: ["Primer", "Polaris"],
  },
  outline: {
    label: "Outline",
    description: "An edge, no fill",
    credits: ["shadcn", "Geist", "Notion", "Stripe"],
  },
  raised: {
    label: "Raised",
    description: "A light plate on an edge, small shadow",
    credits: ["Supabase", "Claude"],
  },
  soft: {
    label: "Soft",
    description: "A gray fill, no edge",
    credits: ["Radix", "Airbnb", "Spectrum 2"],
  },
  tonal: {
    label: "Tonal",
    description: "A muted tint of the brand color",
    credits: ["Material 3"],
  },
  solid: {
    label: "Solid",
    description: "A dark gray fill, light text",
    credits: ["Carbon"],
  },
})

export const RADIUS_OPTIONS = options(RADIUS_VALUES, {
  same: {
    label: "Same as controls",
    description: "Follows the control radius",
    credits: ["Primer", "shadcn"],
  },
  pill: {
    label: "Pill",
    description: "Fully rounded ends",
    credits: ["Material 3", "Spectrum 2", "Spotify"],
  },
})

export const PRESS_OPTIONS = options(PRESS_VALUES, {
  "as-style": {
    label: "As style",
    description: "The Style's own press",
    credits: ["Primer", "Carbon"],
  },
  nudge: {
    label: "Nudge",
    description: "Moves down a pixel when pressed",
    credits: ["shadcn", "Mantine"],
  },
  scale: {
    label: "Scale",
    description: "Shrinks slightly when pressed",
    credits: ["Supabase", "Claude"],
  },
})

export const CASE_OPTIONS = options(CASE_VALUES, {
  sentence: {
    label: "Sentence",
    description: "Labels as written",
    credits: ["shadcn", "Primer"],
  },
  uppercase: {
    label: "Uppercase",
    description: "All caps, wider letter spacing",
    credits: ["Duolingo"],
  },
})

export const OPTIONS = {
  buttonSecondary: SECONDARY_OPTIONS,
  buttonRadius: RADIUS_OPTIONS,
  buttonPress: PRESS_OPTIONS,
  buttonCase: CASE_OPTIONS,
}
