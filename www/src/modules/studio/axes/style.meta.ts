import { options } from "./core/meta"
import type { Option } from "./core/meta"
import { STYLE_VALUES } from "./style"
import type { Style } from "./style"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  flat: {
    label: "Flat",
    description: "No light: lines draw every edge",
    credits: ["shadcn", "Geist", "Primer", "Stripe", "Radix"],
  },
  soft: {
    label: "Soft",
    description: "Diffuse light: soft, low shadows",
    credits: ["Linear", "Notion", "Airbnb", "Fluent 2"],
  },
  tonal: {
    label: "Tonal",
    description: "Tone stands in for light",
    credits: ["Material 3", "Carbon", "Spotify"],
  },
  tactile: {
    label: "Tactile",
    description: "A key light from above, on controls",
    credits: ["Polaris", "Untitled UI", "Clerk"],
  },
  chunky: {
    label: "Chunky",
    description: "Hard light on solid ledges",
    credits: ["Duolingo", "PostHog", "Kahoot"],
  },
})

/** Each Style's finish row: the options its light allows, for the key
 *  FINISH_KEYS names. A Style with one finish has no row. */
export const FINISHES: Partial<Record<Style, readonly Option[]>> = {
  soft: [
    { value: "line", label: "Hairline" },
    { value: "none", label: "Shadow only" },
  ],
  tactile: [
    { value: "rim-light", label: "Rim" },
    { value: "gloss", label: "Gloss" },
    { value: "bevel", label: "Bevel" },
  ],
}

/** A Style key's follow option, first in its picker ("Style · Line"). */
export const FOLLOW_STYLE: Option = { value: "style", label: "Style" }

export const OPTIONS = {
  style: STYLE_OPTIONS,
}
