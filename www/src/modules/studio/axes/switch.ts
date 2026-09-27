/* Switch — always a pill, so its look is Fill, a leaf of Color's Primary
   (Geist's blue toggle beside near-black checkboxes; see checkbox.ts for the
   mechanism), and its motion: how long the thumb, track and card take to
   flip (`--studio-switch-state-*`). */

import { fillScope } from "./color"
import type { Resolved, StudioState } from "./index"
import { resolveStateChange, TAILWIND_TIMING } from "./motion"

/* shadcn's switch and thumb ride Tailwind's default timing. */
const MOTION = TAILWIND_TIMING

export const SWITCH_DEFAULTS = {
  switchColor: "neutral",
  switchMotion: MOTION,
}

export function resolveSwitch(state: StudioState): Resolved {
  return {
    tokens: resolveStateChange("switch", state.switchMotion, MOTION),
    color: fillScope(state, "switch", state.switchColor),
  }
}
