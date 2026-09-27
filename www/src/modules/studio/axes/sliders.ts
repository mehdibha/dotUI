/* Sliders — the two decisions real systems fork on. Thumb: a solid disc
   (dotUI, Material 2), a bordered white disc (iOS, shadcn, Radix), or
   Material 3's tall handle. Track: a hairline the thumb rides (iOS, Radix,
   shadcn) or a chunky level bar (M3's 16dp track, media UIs).

   Engine: `thumb` and `track` are enum params on `slider`; the thick track
   scales the thumb with it through the component's own size vars. Color is
   a leaf of Color's Primary: the fill rides `--studio-slider-fill-color`,
   the primary tokens by default, re-pointed only when the slider leaves the
   buttons' source. The thumb's focus ring eases on the
   `--studio-slider-state-*` vars. The color-slider stays out: its track is
   a gradient swatch and its thumb the shared color-thumb, so no axis
   applies. */

import { SOURCE_OPTIONS } from "./color"
import type { Resolved, StudioState } from "./index"
import { resolveStateChange, TAILWIND_TIMING } from "./motion"
import { oneOf, STATE_CHANGE } from "./schema"
import type { ChapterSchema } from "./schema"

/* shadcn's thumb: `transition-[color,box-shadow]` on Tailwind's default
   timing. */
const MOTION = TAILWIND_TIMING

export const SLIDER_DEFAULTS = {
  sliderThumb: "circle",
  sliderTrack: "thin",
  sliderColor: "accent",
  sliderMotion: MOTION,
}

const FILL_TOKENS: Record<string, string> = {
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

export const SLIDER_SCHEMA: ChapterSchema<typeof SLIDER_DEFAULTS> = {
  sliderThumb: oneOf(THUMB_OPTIONS),
  sliderTrack: oneOf(TRACK_OPTIONS),
  sliderColor: oneOf(SOURCE_OPTIONS),
  sliderMotion: STATE_CHANGE,
}

export function resolveSliders(state: StudioState): Resolved {
  const tokens = resolveStateChange("slider", state.sliderMotion, MOTION)
  const fill = FILL_TOKENS[state.sliderColor]
  if (fill && state.sliderColor !== state.buttonColor)
    tokens["--studio-slider-fill-color"] = fill
  return {
    params: {
      slider: {
        thumb: state.sliderThumb,
        track: state.sliderTrack,
      },
    },
    tokens,
  }
}
