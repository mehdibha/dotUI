import { options } from "./core/meta"
import type { Option } from "./core/meta"
import { STYLE_VALUES } from "./style"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  flat: {
    label: "Flat",
    credits: ["shadcn", "Geist", "Radix"],
  },
  hairline: {
    label: "Hairline",
    credits: ["Primer", "Supabase", "Stripe"],
  },
  rim: {
    label: "Rim",
    credits: ["Untitled UI"],
  },
  gloss: {
    label: "Gloss",
    credits: ["Clerk"],
  },
  bevel: {
    label: "Bevel",
    credits: ["Polaris", "Radix classic"],
  },
  chunky: {
    label: "Chunky",
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
