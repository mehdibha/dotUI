/* Progress — the linear bar: track weight, indeterminate motion, and
   Material 3's cut track (gap + stop dot).

   Engine: three enum params on `progress-bar` (`track`, `indeterminate`,
   `gap`). The ends read `--studio-progress-radius`: pill, or square when
   Shape's Controls role is None. */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const PROGRESS_DEFAULTS = {
  progressTrack: "thin",
  progressIndeterminate: "slide",
  progressGap: false,
}

export const TRACK_OPTIONS = [
  {
    value: "thin",
    label: "Thin",
    description: "A 4px track.",
    seenIn: ["shadcn/ui", "Material 3", "Fluent 2"],
  },
  {
    value: "thick",
    label: "Thick",
    description: "An 8px track.",
    seenIn: ["Carbon"],
  },
]

export const INDETERMINATE_OPTIONS = [
  {
    value: "slide",
    label: "Slide",
    description:
      "A segment 40% of the track wide sweeps left to right every 1.4s.",
    seenIn: ["Carbon", "Spectrum 2", "Material 3"],
  },
  {
    value: "pulse",
    label: "Pulse",
    description:
      "The whole track fills and its opacity breathes between 35% and " +
      "100% every 1.6s.",
    seenIn: ["Radix Themes"],
  },
]

const pick = (options: { value: string }[], value: string, fallback: string) =>
  options.some((o) => o.value === value) ? value : fallback

export function resolveProgress(state: StudioState): Resolved {
  return {
    tokens:
      state.roleControl === "none"
        ? { "--studio-progress-radius": "0" }
        : undefined,
    params: {
      "progress-bar": {
        track: pick(TRACK_OPTIONS, state.progressTrack, "thin"),
        indeterminate: pick(
          INDETERMINATE_OPTIONS,
          state.progressIndeterminate,
          "slide",
        ),
        gap: state.progressGap ? "cut" : "none",
      },
    },
  }
}

export const PROGRESS_SPEC = {
  label: "Progress",
  description:
    "The linear progress bar: its thickness, how it moves when the amount " +
    "is unknown, and Material 3's split track. The fill is the primary " +
    "color. Its ends follow Shape: pill-shaped, or square when the " +
    "Controls role is None.",
  axes: {
    progressTrack: {
      label: "Track",
      description: "The bar's thickness, independent of the slider track.",
      value: { type: "enum", options: TRACK_OPTIONS },
      guidance:
        "shadcn, Material 3 and Fluent 2 (2–4px) stay thin; Carbon " +
        "defaults to 8px, and Spectrum 2 ranges 4–10px by size. Thin sits " +
        "quietly inside cards and toasts; thick suits uploads and " +
        "onboarding meters that are the point of the screen.",
    },
    progressIndeterminate: {
      label: "Indeterminate",
      description: "The motion shown while progress is unknown.",
      value: { type: "enum", options: INDETERMINATE_OPTIONS },
      guidance:
        "3 of 4 systems checked (Carbon, Spectrum 2, Material 3) slide a " +
        "segment across the track; Radix Themes pulses the fill's color " +
        "instead. Slide reads as work happening; pulse is calmer and " +
        "survives reduced-motion expectations better.",
    },
    progressGap: {
      label: "Track gap",
      description:
        "Material 3's split track: a 4px gap on each side of the fill " +
        "separates it from the remaining track, and a 4px stop dot marks " +
        "the end of determinate bars.",
      value: { type: "boolean" },
      guidance:
        "Material 3 only (4dp gap, 4dp stop indicator). Turn it on for " +
        "Material-faithful presets; everywhere else the fill sits " +
        "directly on the track.",
    },
  },
} satisfies ChapterSpec<typeof PROGRESS_DEFAULTS>
