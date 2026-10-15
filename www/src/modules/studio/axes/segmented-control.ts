/* Segmented control — the chip against its track. Auto pairs the chip with
   the button style (Primer's Hairline rings it, Polaris-style Bevel raises
   it). Track: a filled well (iOS, shadcn) or an outline (Geist, Carbon).

   Engine: `selected` and `track` enum params on `segmented-control`, and
   `chip` and `track` on `tabs` (one recipe, segmented-control's). */

import { STYLE_VALUES } from "./buttons"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const SEGMENTED_DEFAULTS = {
  segmentedSelected: "auto" as "auto" | "tone" | "raised" | "ring" | "inverse",
  segmentedTrack: "filled",
}

export const SELECTED_VALUES = ["tone", "raised", "ring", "inverse"] as const

export const TRACK_VALUES = ["filled", "outline"] as const

export const SEGMENTED_SCHEMA: ChapterSchema<typeof SEGMENTED_DEFAULTS> = {
  segmentedSelected: oneOf(SELECTED_VALUES),
  segmentedTrack: oneOf(TRACK_VALUES),
}

const CHIP_AUTO: Record<string, string> = {
  ...Object.fromEntries(STYLE_VALUES.map((value) => [value, "tone"])),
  hairline: "ring",
  bevel: "raised",
}

export function resolveSegmentedControl(state: Effective): Resolved {
  return {
    params: {
      "segmented-control": {
        selected: state.segmentedSelected,
        track: state.segmentedTrack,
      },
      // Segmented tabs are the same bar.
      tabs: { chip: state.segmentedSelected, track: state.segmentedTrack },
    },
  }
}

export const chapter = defineChapter({
  id: "segmented-control",
  defaults: SEGMENTED_DEFAULTS,
  schema: SEGMENTED_SCHEMA,
  resolve: resolveSegmentedControl,
  follows: {
    segmentedSelected: [
      { kind: "auto", id: "auto", from: "buttonStyle", table: CHIP_AUTO },
    ],
  },
})
