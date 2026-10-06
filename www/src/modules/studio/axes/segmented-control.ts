/* Segmented control — the container+chip archetype. Selected: how the chip
   reads against the track (raised: iOS/Radix/shadcn Tabs; flat: Linear,
   Geist, dotUI today; inverse: Carbon, pricing toggles). Track: filled well
   (iOS, shadcn, Linear) or an outline hairline (Carbon, Material 3).

   Engine: `selected` and `track` enum params on `segmented-control`. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

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

export const SEGMENTED_SCHEMA: ChapterSchema<typeof SEGMENTED_DEFAULTS> = {
  segmentedSelected: oneOf(SELECTED_OPTIONS),
  segmentedTrack: oneOf(TRACK_OPTIONS),
}

export function resolveSegmentedControl(state: Effective): Resolved {
  return {
    params: {
      "segmented-control": {
        selected: state.segmentedSelected,
        track: state.segmentedTrack,
      },
    },
  }
}

export const chapter = defineChapter({
  id: "segmented-control",
  defaults: SEGMENTED_DEFAULTS,
  schema: SEGMENTED_SCHEMA,
  resolve: resolveSegmentedControl,
})
