/* Radio — always a circle, so its only axis is Fill, a leaf of Color's
   Primary. See checkbox.ts for the mechanism. */

import { fillScope, SOURCE } from "./color"
import type { Resolved, StudioState } from "./index"
import type { Schema } from "./schema"

export const RADIO_DEFAULTS = {
  radioColor: "neutral",
}

export const RADIO_SCHEMA: Schema<typeof RADIO_DEFAULTS> = {
  radioColor: SOURCE,
}

export function resolveRadio(state: StudioState): Resolved {
  return { color: fillScope(state, "radio", state.radioColor) }
}
