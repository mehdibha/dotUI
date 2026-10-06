/* Progress — the linear bar's three forks. Track weight: hairline 4px (iOS,
   Material 3, Spectrum, Carbon) vs chunky 8px (Ant, shadcn h-2) — independent
   of the slider track. Indeterminate motion: a sliding segment (Material,
   Carbon) vs a pulsing fill (Bootstrap striped, dashboard shimmer). Track
   gap: M3's cut track + stop dot, a boolean for preset fidelity.

   Motion: how long the fill takes to reach a new value.

   Engine: three enum params on `progress-bar` (`track`, `indeterminate`,
   `gap`) plus its `--studio-progress-state-*` timing vars; end caps ride the
   global Shape chapter. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { resolveStateChange, TAILWIND_TIMING } from "./motion"
import { BOOLEAN, oneOf, STATE_CHANGE } from "./schema"
import type { ChapterSchema } from "./schema"

/* shadcn's indicator rides Tailwind's default timing. */
const MOTION = TAILWIND_TIMING

export const PROGRESS_DEFAULTS = {
  progressTrack: "thin",
  progressIndeterminate: "slide",
  progressGap: false,
  progressMotion: MOTION,
}

export const TRACK_OPTIONS = [
  { value: "thin", label: "Thin" },
  { value: "thick", label: "Thick" },
]

export const INDETERMINATE_OPTIONS = [
  { value: "slide", label: "Slide" },
  { value: "pulse", label: "Pulse" },
]

export const PROGRESS_SCHEMA: ChapterSchema<typeof PROGRESS_DEFAULTS> = {
  progressTrack: oneOf(TRACK_OPTIONS),
  progressIndeterminate: oneOf(INDETERMINATE_OPTIONS),
  progressGap: BOOLEAN,
  progressMotion: STATE_CHANGE,
}

export function resolveProgress(state: Effective): Resolved {
  return {
    tokens: resolveStateChange("progress", state.progressMotion, MOTION),
    params: {
      "progress-bar": {
        track: state.progressTrack,
        indeterminate: state.progressIndeterminate,
        gap: state.progressGap ? "cut" : "none",
      },
    },
  }
}

export const chapter = defineChapter({
  id: "progress",
  defaults: PROGRESS_DEFAULTS,
  schema: PROGRESS_SCHEMA,
  resolve: resolveProgress,
})
