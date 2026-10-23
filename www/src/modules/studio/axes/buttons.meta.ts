import {
  CASE_VALUES,
  PRESS_VALUES,
  RADIUS_VALUES,
  SECONDARY_VALUES,
  STYLE_VALUES,
} from "./buttons"
import { options } from "./core/meta"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  flat: {
    label: "Flat",
    description: "Solid fills, no edge or shadow",
    credits: ["shadcn", "Geist", "Carbon"],
  },
  hairline: {
    label: "Hairline",
    description: "A thin dark rim and a soft drop",
    credits: ["Primer", "Supabase", "Stripe"],
  },
  "rim-light": {
    label: "Rim light",
    description: "A light top rim inside a dark edge",
    credits: ["Untitled UI"],
  },
  gloss: {
    label: "Gloss",
    description: "A top sheen that fades on hover",
    credits: ["Clerk"],
  },
  bevel: {
    label: "Bevel",
    description: "A raised bevel that sinks when pressed",
    credits: ["Polaris", "Radix classic"],
  },
  ledge: {
    label: "Ledge",
    description: "A solid lip below that presses flat",
    credits: ["Duolingo"],
  },
  offset: {
    label: "Offset",
    description: "An ink edge on a hard shadow it presses into",
    credits: ["Gumroad", "neobrutalism.dev"],
  },
})

export const SECONDARY_OPTIONS = options(SECONDARY_VALUES, {
  "as-style": {
    label: "As style",
    description: "Follows the button Style",
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
    description: "Follows the button Style",
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
  buttonStyle: STYLE_OPTIONS,
  buttonSecondary: SECONDARY_OPTIONS,
  buttonRadius: RADIUS_OPTIONS,
  buttonPress: PRESS_OPTIONS,
  buttonCase: CASE_OPTIONS,
}
