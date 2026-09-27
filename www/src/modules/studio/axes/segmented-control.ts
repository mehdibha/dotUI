/* Segmented control — the container+chip archetype. Selected: how the chip
   reads against the track (raised: iOS/Radix/shadcn Tabs; flat: Linear,
   Geist, dotUI today; inverse: Carbon, pricing toggles). Track: filled well
   (iOS, shadcn, Linear) or an outline hairline (Carbon, Material 3).

   Motion: how long the chip takes to glide to its new item.

   Engine: `selected` and `track` enum params on `segmented-control`, plus
   its `--studio-segmented-control-state-*` timing vars. */

import type { Resolved, StudioState } from "./index"
import { ease, resolveStateChange } from "./motion"
import type { StateChange } from "./motion"
import { oneOf, STATE_CHANGE } from "./schema"
import type { ChapterSchema } from "./schema"

/* shadcn has no segmented control: today's glide, 150ms on ease-out. */
const MOTION: StateChange = { duration: 150, ease: ease("ease-out") }

export const SEGMENTED_DEFAULTS = {
  segmentedSelected: "flat",
  segmentedTrack: "filled",
  segmentedControlMotion: MOTION,
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
  segmentedControlMotion: STATE_CHANGE,
}

export function resolveSegmentedControl(state: StudioState): Resolved {
  return {
    tokens: resolveStateChange(
      "segmented-control",
      state.segmentedControlMotion,
      MOTION,
    ),
    params: {
      "segmented-control": {
        selected: state.segmentedSelected,
        track: state.segmentedTrack,
      },
    },
  }
}
