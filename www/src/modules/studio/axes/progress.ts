/* Progress: the linear bar's thickness, how its track sits around the fill,
   and which control's fill it shares. End caps ride Shape's tracks.

   Engine: `track` and `trackStyle` are enum params on `progress-bar`; the
   fill rides `--studio-progress-fill-color` (the primary tokens), re-pointed
   only when the bar reads another source than the buttons. */

import { SOURCE_OPTIONS } from "./color"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const PROGRESS_DEFAULTS = {
  progressTrack: "thin",
  progressTrackStyle: "plain",
  progressColor: "same-buttons",
}

export const TRACK_OPTIONS = [
  { value: "thin", label: "Thin", description: "Material 3, shadcn" },
  {
    value: "medium",
    label: "Medium",
    description: "Spectrum 2, Radix Themes",
  },
  {
    value: "thick",
    label: "Thick",
    description: "Primer, Carbon, Ant Design, Mantine, HeroUI",
  },
  { value: "x-heavy", label: "Extra heavy", description: "Polaris" },
]

export const TRACK_STYLE_OPTIONS = [
  {
    value: "plain",
    label: "Plain",
    description: "shadcn, Spectrum 2, Carbon, Ant Design, Primer",
  },
  { value: "bordered", label: "Bordered", description: "Radix Themes" },
  { value: "gap", label: "Gap", description: "Material 3" },
]

export const COLOR_OPTIONS = [
  {
    value: "same-buttons",
    label: "Same as buttons",
    description: "Carbon, Primer, Duolingo",
  },
  {
    value: "same-checks",
    label: "Same as checks",
    description: "Supabase, Spectrum 2",
  },
]

const FILL_TOKENS: Record<string, string> = {
  neutral: "var(--color-inverse)",
  accent: "var(--color-accent)",
}

export const PROGRESS_SCHEMA: ChapterSchema<typeof PROGRESS_DEFAULTS> = {
  progressTrack: oneOf(TRACK_OPTIONS),
  progressTrackStyle: oneOf(TRACK_STYLE_OPTIONS),
  // The panel offers only the two follows; this is what they resolve to.
  progressColor: oneOf(SOURCE_OPTIONS),
}

export function resolveProgress(state: Effective): Resolved {
  const fill = FILL_TOKENS[state.progressColor]
  return {
    params: {
      "progress-bar": {
        track: state.progressTrack,
        trackStyle: state.progressTrackStyle,
      },
    },
    tokens:
      fill && state.progressColor !== state.buttonColor
        ? { "--studio-progress-fill-color": fill }
        : {},
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
      { kind: "same", id: "same-checks", from: "checkboxColor" },
    ],
  },
})
