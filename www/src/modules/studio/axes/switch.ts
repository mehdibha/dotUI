/* Switch — always a pill, so its look is Fill, a leaf of Color's Primary
   (Geist's blue toggle beside near-black checkboxes; see checkbox.ts for the
   mechanism), and its motion: how long the thumb, track and card take to
   flip (`--studio-switch-state-*`). */

import { fillScope, SOURCE_OPTIONS } from "./color"
import type { Resolved, StudioState } from "./index"
import { resolveStateChange, TAILWIND_TIMING } from "./motion"
import { oneOf, STATE_CHANGE } from "./schema"
import type { ChapterSchema } from "./schema"

/* shadcn's switch and thumb ride Tailwind's default timing. */
const MOTION = TAILWIND_TIMING

export const SWITCH_DEFAULTS = {
  switchColor: "accent",
  switchMotion: MOTION,
}

export const SWITCH_SCHEMA: ChapterSchema<typeof SWITCH_DEFAULTS> = {
  switchColor: oneOf(SOURCE_OPTIONS),
  switchMotion: STATE_CHANGE,
}

export function resolveSwitch(state: StudioState): Resolved {
  return {
    tokens: resolveStateChange("switch", state.switchMotion, MOTION),
    color: fillScope(state, "switch", state.switchColor),
  }
}
