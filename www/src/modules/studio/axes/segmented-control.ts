/* Segmented control — the chip against its track. The chip follows the
   Style's look (Hairline rings it, the lit looks raise it). Track: a filled
   well (iOS, shadcn) or an outline (Geist, Carbon). Segmented tabs share
   the recipe (`tabs.chip`, `tabs.track`). */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

export const SELECTED_VALUES = ["tone", "raised", "ring", "inverse"] as const

export const TRACK_VALUES = ["filled", "outline"] as const

export const chapter = defineChapter({
  id: "segmented-control",
  defaults: {
    segmentedSelected: "tone" as (typeof SELECTED_VALUES)[number],
    segmentedTrack: "filled",
  },
  schema: {
    segmentedSelected: oneOf(SELECTED_VALUES),
    segmentedTrack: oneOf(TRACK_VALUES),
  },
  resolve(state: Effective): Resolved {
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
  },
})
