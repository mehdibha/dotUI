/* Segmented control — the chip against its track. Auto pairs the chip with
   the button style (Primer's Hairline rings it, Polaris-style Bevel raises
   it). Track: a filled well (iOS, shadcn) or an outline (Geist, Carbon).
   Segmented tabs share the recipe (`tabs.chip`, `tabs.track`). */

import { STYLE_VALUES } from "./buttons"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

export const SELECTED_VALUES = ["tone", "raised", "ring", "inverse"] as const

export const TRACK_VALUES = ["filled", "outline"] as const

const CHIP_AUTO: Record<string, string> = {
  ...Object.fromEntries(STYLE_VALUES.map((value) => [value, "tone"])),
  hairline: "ring",
  // A lit finish lifts its chip (Untitled UI, Clerk, Polaris).
  "rim-light": "raised",
  gloss: "raised",
  bevel: "raised",
}

export const chapter = defineChapter({
  id: "segmented-control",
  defaults: {
    segmentedSelected: "auto" as
      | "auto"
      | "tone"
      | "raised"
      | "ring"
      | "inverse",
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
  follows: {
    segmentedSelected: [
      { kind: "auto", id: "auto", from: "buttonStyle", table: CHIP_AUTO },
    ],
  },
})
