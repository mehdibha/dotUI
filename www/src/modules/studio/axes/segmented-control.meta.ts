import { options } from "./core/meta"
import { SELECTED_VALUES, TRACK_VALUES } from "./segmented-control"

const SELECTED = options(SELECTED_VALUES, {
  tone: { label: "Tone", description: "Geist, Linear" },
  raised: { label: "Raised", description: "shadcn, iOS, Claude" },
  ring: { label: "Ring", description: "Radix, Primer, Stripe" },
  inverse: { label: "Inverse", description: "Carbon" },
})

export const SELECTED_OPTIONS = [
  { value: "auto", label: "Auto", description: "Primer, Radix classic" },
  ...SELECTED,
]

export const TRACK_OPTIONS = options(TRACK_VALUES, {
  filled: { label: "Filled", description: "shadcn, Radix, iOS" },
  outline: { label: "Outline", description: "Geist, Carbon" },
})

export const OPTIONS = {
  segmentedSelected: SELECTED,
  segmentedTrack: TRACK_OPTIONS,
}
