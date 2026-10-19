import { options } from "./core/meta"
import { SELECTED_VALUES, TRACK_VALUES } from "./segmented-control"

const SELECTED = options(SELECTED_VALUES, {
  tone: {
    label: "Tone",
    description: "A darker neutral chip, small shadow",
    credits: ["Geist", "Linear"],
  },
  raised: {
    label: "Raised",
    description: "A page-colored chip on an edge and shadow",
    credits: ["shadcn", "iOS", "Claude"],
  },
  ring: {
    label: "Ring",
    description: "A page-colored chip on an edge, no shadow",
    credits: ["Radix", "Primer", "Stripe"],
  },
  inverse: {
    label: "Inverse",
    description: "A full-contrast chip, inverted text",
    credits: ["Carbon"],
  },
})

export const SELECTED_OPTIONS = [
  {
    value: "auto",
    label: "Auto",
    description: "Follows the button Style",
    credits: ["Primer", "Radix classic"],
  },
  ...SELECTED,
]

export const TRACK_OPTIONS = options(TRACK_VALUES, {
  filled: {
    label: "Filled",
    description: "A gray well behind the items",
    credits: ["shadcn", "Radix", "iOS"],
  },
  outline: {
    label: "Outline",
    description: "A bordered track, no fill",
    credits: ["Geist", "Carbon"],
  },
})

export const OPTIONS = {
  segmentedSelected: SELECTED,
  segmentedTrack: TRACK_OPTIONS,
}
