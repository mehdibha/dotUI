/* Progress: the linear bar's thickness, how its track sits around the fill,
   and which control's fill it shares. End caps ride Shape's tracks.

   Engine: `track` and `trackStyle` are enum params on `progress-bar`; the
   fill rides `--studio-progress-fill-color` (the primary tokens), re-pointed
   only when the bar reads another source than the buttons. */

import { SOURCE_VALUES } from "./color"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const PROGRESS_DEFAULTS = {
  progressTrack: "thin",
  progressTrackStyle: "plain",
  progressColor: "same-buttons",
}

export const TRACK_VALUES = ["thin", "medium", "thick", "x-heavy"] as const

export const TRACK_STYLE_VALUES = ["plain", "bordered", "gap"] as const

export const COLOR_VALUES = ["same-buttons", "same-checks"] as const

/** What the follows resolve to: a source, or whatever the checks paint. */
export const FILL_VALUES = [...SOURCE_VALUES, "checks"] as const

const FILL_TOKENS: Record<string, string> = {
  neutral: "var(--color-inverse)",
  accent: "var(--color-accent)",
}

export const PROGRESS_SCHEMA: ChapterSchema<typeof PROGRESS_DEFAULTS> = {
  progressTrack: oneOf(TRACK_VALUES),
  progressTrackStyle: oneOf(TRACK_STYLE_VALUES),
  progressColor: oneOf(FILL_VALUES),
}

/** The fill as a token, undefined where it is the buttons' own. */
function fillToken(state: Effective): string | undefined {
  const source = (value: string) =>
    value === state.buttonColor ? undefined : FILL_TOKENS[value]
  if (state.progressColor !== "checks") return source(state.progressColor)
  // Off the selection leaf the checks paint their own source.
  if (state.checkboxColor !== state.selectionColor)
    return source(state.checkboxColor)
  return state.selectionSeed || state.selectionColor !== state.buttonColor
    ? "var(--color-selection)"
    : undefined
}

export function resolveProgress(state: Effective): Resolved {
  const fill = fillToken(state)
  return {
    params: {
      "progress-bar": {
        track: state.progressTrack,
        trackStyle: state.progressTrackStyle,
      },
    },
    tokens: fill ? { "--studio-progress-fill-color": fill } : {},
  }
}

export const chapter = defineChapter({
  id: "progress",
  defaults: PROGRESS_DEFAULTS,
  schema: PROGRESS_SCHEMA,
  resolve: resolveProgress,
  follows: {
    progressColor: [
      { kind: "same", id: "same-buttons", from: "buttonColor" },
      {
        kind: "same",
        id: "same-checks",
        from: "checkboxColor",
        map: { neutral: "checks", accent: "checks" },
      },
    ],
  },
})
