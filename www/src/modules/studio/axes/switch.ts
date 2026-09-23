/* Switch — always a pill, so its only axis is Fill, a leaf of Color's
   Primary (Geist's blue toggle beside near-black checkboxes). See checkbox.ts
   for the mechanism. */

import { fillScope, SOURCE } from "./color"
import type { Resolved, StudioState } from "./index"
import type { Schema } from "./schema"

export const SWITCH_DEFAULTS = {
  switchColor: "neutral",
}

export const SWITCH_SCHEMA: Schema<typeof SWITCH_DEFAULTS> = {
  switchColor: SOURCE,
}

export function resolveSwitch(state: StudioState): Resolved {
  return { color: fillScope(state, "switch", state.switchColor) }
}
