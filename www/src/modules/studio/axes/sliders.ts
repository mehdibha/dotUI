/* Sliders — the two decisions real systems fork on. Thumb: a solid disc
   (dotUI, Material 2), a bordered white disc (iOS, shadcn, Radix), or
   Material 3's tall handle. Track: a hairline the thumb rides (iOS, Radix,
   shadcn) or a chunky level bar (M3's 16dp track, media UIs).

   Engine: `thumb` and `track` are enum params on `slider`; the thick track
   scales the thumb with it through the component's own size vars. Color is
   a leaf of Color's Primary: the fill rides `--studio-slider-fill-color`,
   the primary tokens by default, re-pointed only when the slider leaves the
   buttons' source. The color-slider stays out: its track is a gradient
   swatch and its thumb the shared color-thumb, so no axis applies. */

import { SOURCE } from "./color"
import type { Resolved, StudioState } from "./index"
import { oneOf } from "./schema"
import type { Schema } from "./schema"

export const SLIDER_DEFAULTS = {
  sliderThumb: "circle",
  sliderTrack: "thin",
  sliderColor: "neutral",
}

const FILL_TOKENS = {
  neutral: "var(--color-inverse)",
  accent: "var(--color-accent)",
}

export const THUMB_OPTIONS = [
  { value: "circle", label: "Circle" },
  { value: "outline", label: "Outline" },
  { value: "bar", label: "Bar" },
]

export const TRACK_OPTIONS = [
  { value: "thin", label: "Thin" },
  { value: "thick", label: "Thick" },
]

export const SLIDER_SCHEMA: Schema<typeof SLIDER_DEFAULTS> = {
  sliderThumb: oneOf(THUMB_OPTIONS),
  sliderTrack: oneOf(TRACK_OPTIONS),
  sliderColor: SOURCE,
}

export function resolveSliders(state: StudioState): Resolved {
  return {
    params: {
      slider: { thumb: state.sliderThumb, track: state.sliderTrack },
    },
    tokens:
      state.sliderColor !== state.buttonColor
        ? {
            "--studio-slider-fill-color":
              FILL_TOKENS[state.sliderColor as keyof typeof FILL_TOKENS],
          }
        : undefined,
  }
}
