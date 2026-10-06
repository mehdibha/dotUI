/* Segmented control — the chip against its track. Auto pairs the chip with
   the button style (Primer's Hairline rings it, Polaris-style Bevel raises
   it). Track: a filled well (iOS, shadcn) or an outline (Geist, Carbon).

   Engine: `selected` and `track` enum params on `segmented-control`. */

import { STYLE_OPTIONS } from "./buttons"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const SEGMENTED_DEFAULTS = {
  segmentedSelected: "auto" as "auto" | "tone" | "raised" | "ring" | "inverse",
  segmentedTrack: "filled",
}

export const SELECTED_OPTIONS = [
  { value: "auto", label: "Auto", description: "Primer, Radix classic" },
  { value: "tone", label: "Tone", description: "Geist, Linear" },
  { value: "raised", label: "Raised", description: "shadcn, iOS, Claude" },
  { value: "ring", label: "Ring", description: "Radix, Primer, Stripe" },
  { value: "inverse", label: "Inverse", description: "Carbon" },
]

export const TRACK_OPTIONS = [
  { value: "filled", label: "Filled", description: "shadcn, Radix, iOS" },
  { value: "outline", label: "Outline", description: "Geist, Carbon" },
]

export const SEGMENTED_SCHEMA: ChapterSchema<typeof SEGMENTED_DEFAULTS> = {
  segmentedSelected: oneOf(SELECTED_OPTIONS.slice(1)),
  segmentedTrack: oneOf(TRACK_OPTIONS),
}

const CHIP_AUTO: Record<string, string> = {
  ...Object.fromEntries(STYLE_OPTIONS.map(({ value }) => [value, "tone"])),
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
