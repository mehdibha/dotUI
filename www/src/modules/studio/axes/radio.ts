/* Radio — always a circle, so its only axis is Fill: Auto follows the
   selection tokens, Neutral / Accent fork the radio off them. See checkbox.ts
   for the mechanism. */

import { fillScope } from "./color"
import type { Resolved, StudioState } from "./index"

export const RADIO_DEFAULTS = {
  radioFill: "auto",
}

export function resolveRadio(state: StudioState): Resolved {
  return { color: fillScope(state, "radio", state.radioFill) }
}
