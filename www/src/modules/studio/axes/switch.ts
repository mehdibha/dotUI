/* Switch — always a pill, so its only axis is Fill, a leaf of Color's
   Primary (Geist's blue toggle beside near-black checkboxes). See checkbox.ts
   for the mechanism. */

import { fillScope } from "./color"
import type { Resolved, StudioState } from "./index"

export const SWITCH_DEFAULTS = {
  switchFill: "neutral",
}

export function resolveSwitch(state: StudioState): Resolved {
  return { color: fillScope(state, "switch", state.switchFill) }
}
