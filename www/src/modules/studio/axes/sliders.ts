/* Slider — thumb and track are enum params on `slider`; the track sets the
   thumb's size through the control's own vars. The fill paints with the
   selection tokens, re-declared under `[data-slider]` when the slider's leaf
   differs from them. The color-slider stays out: its track is a gradient
   swatch and its thumb the shared color-thumb. */

import type { PrimaryColorSource } from "@/registry/theme"

import { SOURCE_VALUES } from "./color"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const SLIDER_DEFAULTS = {
  sliderThumb: "knob",
  sliderTrack: "auto" as "auto" | (typeof TRACK_VALUES)[number],
  sliderColor: "accent",
}

/* Knob: a light disc with a neutral edge. Ring: a light disc ringed in the
   fill. Solid: a disc in the fill. Handle: a bar with a cut-away gap and a
   stop dot. */
export const THUMB_VALUES = ["knob", "ring", "solid", "handle"] as const

/* 2, 4, 8 or 16px. */
export const TRACK_VALUES = ["hairline", "thin", "medium", "thick"] as const

/** Each thumb's own track: Material 3's handle rides a 16px track. */
export const THUMB_TRACK: Record<string, string> = {
  knob: "thin",
  ring: "thin",
  solid: "thin",
  handle: "thick",
}

export const SLIDER_SCHEMA: ChapterSchema<typeof SLIDER_DEFAULTS> = {
  sliderThumb: oneOf(THUMB_VALUES),
  sliderTrack: oneOf(TRACK_VALUES),
  sliderColor: oneOf(SOURCE_VALUES),
}

export function resolveSliders(state: Effective): Resolved {
  // A selection seed repaints the selection tokens, so any leaf scopes.
  const scoped =
    state.sliderColor !== state.selectionColor || state.selectionSeed !== ""
  return {
    params: { slider: { thumb: state.sliderThumb, track: state.sliderTrack } },
    color: scoped
      ? { scopes: { slider: state.sliderColor as PrimaryColorSource } }
      : undefined,
  }
}

export const chapter = defineChapter({
  id: "sliders",
  defaults: SLIDER_DEFAULTS,
  schema: SLIDER_SCHEMA,
  resolve: resolveSliders,
  follows: {
    sliderTrack: [
      { kind: "auto", id: "auto", from: "sliderThumb", table: THUMB_TRACK },
    ],
  },
  rules: [
    {
      // The stop dot and the gap clip inside a 2px track.
      id: "sliders/handle-needs-track",
      target: "sliderTrack",
      when: { key: "sliderThumb", in: ["handle"] },
      effect: { kind: "exclude", options: ["hairline"], fallback: "thin" },
      cause: "sliderThumb",
    },
  ],
})
