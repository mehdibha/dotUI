/* Segmented control — the container+chip archetype. Selected: how the chip
   reads against the track (raised: iOS/Radix/shadcn Tabs; flat: Linear,
   Geist, dotUI today; inverse: Carbon, pricing toggles). Track: filled well
   (iOS, shadcn, Linear) or an outline hairline (Carbon, Material 3).

   Engine: `selected` and `track` enum params on `segmented-control`. */

import type { Resolved, StudioState } from "./index"

export const SEGMENTED_DEFAULTS = {
  segmentedSelected: "flat",
  segmentedTrack: "filled",
}

export const SELECTED_OPTIONS = [
  { value: "raised", label: "Raised" },
  { value: "flat", label: "Flat" },
  { value: "inverse", label: "Inverse" },
]

export const TRACK_OPTIONS = [
  { value: "filled", label: "Filled" },
  { value: "outline", label: "Outline" },
]

const pick = (options: { value: string }[], value: string, fallback: string) =>
  options.some((o) => o.value === value) ? value : fallback

export const WIRED = true

export function resolveSegmentedControl(state: StudioState): Resolved {
  return {
    params: {
      "segmented-control": {
        selected: pick(SELECTED_OPTIONS, state.segmentedSelected, "flat"),
        track: pick(TRACK_OPTIONS, state.segmentedTrack, "filled"),
      },
    },
  }
}
