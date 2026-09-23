/* Progress — the linear bar's three forks. Track weight: hairline 4px (iOS,
   Material 3, Spectrum, Carbon) vs chunky 8px (Ant, shadcn h-2) — independent
   of the slider track. Indeterminate motion: a sliding segment (Material,
   Carbon) vs a pulsing fill (Bootstrap striped, dashboard shimmer). Track
   gap: M3's cut track + stop dot, a boolean for preset fidelity.

   Engine: three enum params on `progress-bar` (`track`, `indeterminate`,
   `gap`); end caps ride the global Shape chapter. */

import type { Resolved, StudioState } from "./index"
import { BOOLEAN, oneOf } from "./schema"
import type { Schema } from "./schema"

export const PROGRESS_DEFAULTS = {
  progressTrack: "thin",
  progressIndeterminate: "slide",
  progressGap: false,
}

export const TRACK_OPTIONS = [
  { value: "thin", label: "Thin" },
  { value: "thick", label: "Thick" },
]

export const INDETERMINATE_OPTIONS = [
  { value: "slide", label: "Slide" },
  { value: "pulse", label: "Pulse" },
]

export const PROGRESS_SCHEMA: Schema<typeof PROGRESS_DEFAULTS> = {
  progressTrack: oneOf(TRACK_OPTIONS),
  progressIndeterminate: oneOf(INDETERMINATE_OPTIONS),
  progressGap: BOOLEAN,
}

export function resolveProgress(state: StudioState): Resolved {
  return {
    params: {
      "progress-bar": {
        track: state.progressTrack,
        indeterminate: state.progressIndeterminate,
        gap: state.progressGap ? "cut" : "none",
      },
    },
  }
}
