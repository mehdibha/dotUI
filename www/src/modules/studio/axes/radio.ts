/* Radio — always a circle, so its only axis is Fill, a leaf of Color's
   Primary. See checkbox.ts for the mechanism. */

import { fillScope } from "./color"
import type { Resolved, StudioState } from "./index"

export const RADIO_DEFAULTS = {
  radioColor: "accent",
}

export function resolveRadio(state: StudioState): Resolved {
  return { color: fillScope(state, "radio", state.radioColor) }
}
