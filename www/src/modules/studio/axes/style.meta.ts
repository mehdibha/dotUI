import { options } from "./core/meta"
import type { Option } from "./core/meta"
import { STYLE_VALUES } from "./style"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  flat: {
    label: "Flat",
    description: "Lines, no depth",
    credits: ["shadcn", "Vercel", "GitHub", "Stripe", "Radix"],
  },
  soft: {
    label: "Soft",
    description: "Low shadows, raised controls",
    credits: ["Linear", "Notion", "Airbnb", "Untitled UI"],
  },
  tonal: {
    label: "Tonal",
    description: "Layers by tone, not lines",
    credits: ["Material 3", "Carbon", "Spotify"],
  },
  tactile: {
    label: "Tactile",
    description: "Bevels and ledges you can press",
    credits: ["Polaris", "Duolingo"],
  },
})

/** A Style key's follow option, first in its picker ("Style · Line"). */
export const FOLLOW_STYLE: Option = { value: "style", label: "Style" }

export const OPTIONS = {
  style: STYLE_OPTIONS,
}
