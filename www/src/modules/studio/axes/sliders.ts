/* Sliders — the two decisions real systems fork on: the thumb, and the
   track's weight.

   Engine: `thumb` and `track` are enum params on `slider`; the thick track
   scales the thumb with it through the component's own size vars. Color is
   a leaf of Color's Primary: the fill rides `--studio-slider-fill-color`,
   the primary tokens by default, re-pointed only when the slider leaves the
   buttons' source. The color-slider stays out: its track is a gradient
   swatch and its thumb the shared color-thumb, so no axis applies. */

import { PRIMARY_LEAF_LABELS, SOURCE_OPTIONS } from "./color"
import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

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
  {
    value: "circle",
    label: "Circle",
    description: "A solid disc in the text color.",
    seenIn: ["Carbon"],
  },
  {
    value: "outline",
    label: "Outline",
    description: "A page-colored disc inside a 2px control-border ring.",
    seenIn: ["Radix Themes", "Spectrum 2"],
  },
  {
    value: "bar",
    label: "Bar",
    description:
      "A 4px-wide upright handle in the fill color, twice the disc's " +
      "height, with a 3px page-colored gap cut into the track around it.",
    seenIn: ["Material 3"],
  },
]

export const TRACK_OPTIONS = [
  {
    value: "thin",
    label: "Thin",
    description: "A 4px track with a 12px thumb.",
    seenIn: ["shadcn/ui", "Carbon"],
  },
  {
    value: "thick",
    label: "Thick",
    description: "A 12px track with a 20px thumb — a level bar.",
    seenIn: ["HeroUI", "Material 3"],
  },
]

const SEEN_IN: Record<string, string[]> = {
  neutral: ["shadcn/ui", "Carbon"],
  accent: ["Radix Themes", "Material 3", "HeroUI"],
}

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

export const SLIDER_SPEC = {
  label: "Sliders",
  description:
    "The range slider's thumb, track weight and fill color. The color " +
    "slider keeps its gradient track and shared color thumb.",
  axes: {
    sliderThumb: {
      label: "Thumb",
      description: "The handle's shape and paint.",
      value: { type: "enum", options: THUMB_OPTIONS },
      guidance:
        "The bordered white disc is the most common (Radix Themes, " +
        "Spectrum 2); Carbon uses a solid dark disc; Material 3 replaced the " +
        "disc with an upright bar. shadcn/ui, Mantine and HeroUI ring the " +
        "thumb in the fill color, which no option here draws.",
    },
    sliderTrack: {
      label: "Track",
      description:
        "The track's thickness; the thumb scales with it. Applies to every " +
        "thumb.",
      value: { type: "enum", options: TRACK_OPTIONS },
      guidance:
        "Hairline tracks suit forms and settings (Carbon 2px, shadcn/ui " +
        "6px); Material 3 (16dp) and HeroUI (12px at md) draw a chunky " +
        "level bar that reads like a meter. Radix Themes and Mantine sit " +
        "between at 8px.",
    },
    sliderColor: {
      label: PRIMARY_LEAF_LABELS.sliderColor,
      description:
        "What fills the track up to the thumb, and the Bar thumb. A leaf of " +
        "Color's Primary: on the Buttons leaf's value it paints with the " +
        "primary tokens, off it it forks to its own source.",
      value: {
        type: "enum",
        options: SOURCE_OPTIONS.map((option) => ({
          ...option,
          seenIn: SEEN_IN[option.value],
        })),
      },
      guidance:
        "shadcn/ui and Carbon fill the range near-black; Radix Themes, " +
        "Material 3 and HeroUI with the accent. Match Buttons unless the " +
        "slider is a brand moment, such as a media scrubber.",
    },
  },
} satisfies ChapterSpec<typeof SLIDER_DEFAULTS>
