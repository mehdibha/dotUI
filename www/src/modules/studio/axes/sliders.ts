/* Slider — thumb and track are enum params on `slider`; the track sets the
   thumb's size through the control's own vars. The fill paints with the
   selection tokens, re-declared under `[data-slider]` when the slider's leaf
   differs from them. The color-slider stays out: its track is a gradient
   swatch and its thumb the shared color-thumb. */

import type { PrimaryColorSource } from "@/registry/theme"

import { SOURCE_OPTIONS } from "./color"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const SLIDER_DEFAULTS = {
  sliderThumb: "knob",
  sliderTrack: "auto",
  sliderColor: "accent",
}

/* Knob: a light disc with a neutral edge (shadcn nova/rhea/luma, Radix,
   Spectrum 2). Ring: a light disc ringed in the fill (shadcn vega/maia,
   Untitled UI, Ant Design). Solid: a disc in the fill (shadcn sera, Carbon,
   Supabase, Polaris). Handle: Material 3's bar with a cut-away gap and a stop
   dot. */
export const THUMB_OPTIONS = [
  { value: "knob", label: "Knob" },
  { value: "ring", label: "Ring" },
  { value: "solid", label: "Solid" },
  { value: "handle", label: "Handle" },
]

/* 2, 4, 8 or 16px. Hairline: Carbon, shadcn sera. Thin: shadcn nova,
   Supabase, Polaris. Medium: Radix, Untitled UI, Geist. Thick: Material 3. */
export const TRACK_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "hairline", label: "Hairline" },
  { value: "thin", label: "Thin" },
  { value: "medium", label: "Medium" },
  { value: "thick", label: "Thick" },
]

/** Each thumb's own track: Material 3's handle rides a 16px track. */
export const THUMB_TRACK: Record<string, string> = {
  knob: "thin",
  ring: "thin",
  solid: "thin",
  handle: "thick",
}

export const SLIDER_SCHEMA: ChapterSchema<typeof SLIDER_DEFAULTS> = {
  sliderThumb: oneOf(THUMB_OPTIONS),
  sliderTrack: oneOf(TRACK_OPTIONS),
  sliderColor: oneOf(SOURCE_OPTIONS),
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
