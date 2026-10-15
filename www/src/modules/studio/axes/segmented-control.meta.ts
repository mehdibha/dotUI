import { options } from "./core/meta"
import { SELECTED_VALUES, TRACK_VALUES } from "./segmented-control"

const SELECTED = options(SELECTED_VALUES, {
  tone: { label: "Tone", credits: ["Geist", "Linear"] },
  raised: { label: "Raised", credits: ["shadcn", "iOS", "Claude"] },
  ring: { label: "Ring", credits: ["Radix", "Primer", "Stripe"] },
  inverse: { label: "Inverse", credits: ["Carbon"] },
})

export const SELECTED_OPTIONS = [
  { value: "auto", label: "Auto", credits: ["Primer", "Radix classic"] },
  ...SELECTED,
]

export const TRACK_OPTIONS = options(TRACK_VALUES, {
  filled: { label: "Filled", credits: ["shadcn", "Radix", "iOS"] },
  outline: { label: "Outline", credits: ["Geist", "Carbon"] },
})

export const OPTIONS = {
  segmentedSelected: SELECTED,
  segmentedTrack: TRACK_OPTIONS,
}
