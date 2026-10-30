import { options } from "./core/meta"
import type { Option } from "./core/meta"
import { STYLE_VALUES } from "./style"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  flat: {
    label: "Flat",
    description: "Solid fills and hairline cards, no shadows",
    credits: ["shadcn", "Geist", "Radix"],
  },
  hairline: {
    label: "Hairline",
    description: "A thin dark rim on every fill, inset fields",
    credits: ["Primer", "Supabase", "Stripe"],
  },
  rim: {
    label: "Rim",
    description: "A light top rim inside a dark edge, raised fields",
    credits: ["Untitled UI"],
  },
  gloss: {
    label: "Gloss",
    description: "A top sheen that fades on hover, soft shadows",
    credits: ["Clerk"],
  },
  bevel: {
    label: "Bevel",
    description: "Bevelled buttons and cards that sink when pressed",
    credits: ["Polaris", "Radix classic"],
  },
  chunky: {
    label: "Chunky",
    description: "Thick solid ledges under buttons and cards",
    credits: ["Duolingo", "PostHog", "Kahoot"],
  },
})

/** A Style key's follow option, first in its picker ("Style · Line"). */
export const FOLLOW_STYLE: Option = {
  value: "style",
  label: "Style",
  description: "Follows the global Style",
}

export const OPTIONS = {
  style: STYLE_OPTIONS,
}
