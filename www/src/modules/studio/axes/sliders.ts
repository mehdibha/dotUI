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

import type { Resolved, StudioState } from "./index"

export const SLIDER_DEFAULTS = {
  sliderThumb: "circle",
  sliderTrack: "thin",
  sliderColor: "neutral",
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

const pick = (options: { value: string }[], value: string, fallback: string) =>
  options.some((o) => o.value === value) ? value : fallback

export function resolveSliders(state: StudioState): Resolved {
  const fill = FILL_TOKENS[state.sliderColor]
  return {
    params: {
      slider: {
        thumb: pick(THUMB_OPTIONS, state.sliderThumb, "circle"),
        track: pick(TRACK_OPTIONS, state.sliderTrack, "thin"),
      },
    },
    tokens:
      fill && state.sliderColor !== state.buttonColor
        ? { "--studio-slider-fill-color": fill }
        : undefined,
  }
}
