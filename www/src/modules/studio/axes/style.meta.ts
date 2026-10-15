import { options } from "./core/meta"
import type { Option } from "./core/meta"
import { STYLE_VALUES } from "./style"
import type { Style } from "./style"

export const STYLE_OPTIONS = options(STYLE_VALUES, {
  flat: {
    label: "Flat",
    description: "Borders on every edge, no shadows",
    credits: ["shadcn", "Geist", "Primer", "Stripe", "Radix"],
  },
  soft: {
    label: "Soft",
    description: "Diffuse light: soft, low shadows",
    credits: ["Linear", "Notion", "Airbnb", "Fluent 2"],
  },
  tonal: {
    label: "Tonal",
    description: "Tinted surfaces instead of borders",
    credits: ["Material 3", "Carbon", "Spotify"],
  },
  tactile: {
    label: "Tactile",
    description: "Raised, beveled controls with soft shadows",
    credits: ["Polaris", "Untitled UI", "Clerk"],
  },
  chunky: {
    label: "Chunky",
    description: "Thick solid ledges under controls",
    credits: ["Duolingo", "PostHog", "Kahoot"],
  },
})

/** Each Style's finish row: the options it allows, for the key
 *  FINISH_KEYS names. A Style with one finish has no row. */
export const FINISHES: Partial<Record<Style, readonly Option[]>> = {
  soft: [
    {
      value: "line",
      label: "Hairline",
      description: "Cards keep a hairline edge",
    },
    {
      value: "none",
      label: "Shadow only",
      description: "No edge; soft shadows alone",
    },
  ],
  tactile: [
    {
      value: "rim-light",
      label: "Rim",
      description: "A bright top rim inside a dark edge",
    },
    {
      value: "gloss",
      label: "Gloss",
      description: "A top sheen that fades on hover",
    },
    {
      value: "bevel",
      label: "Bevel",
      description: "A raised bevel that sinks when pressed",
    },
  ],
}

/** A Style key's follow option, first in its picker ("Style · Line"). */
export const FOLLOW_STYLE: Option = {
  value: "style",
  label: "Style",
  description: "Follows the global Style",
}

export const OPTIONS = {
  style: STYLE_OPTIONS,
}
