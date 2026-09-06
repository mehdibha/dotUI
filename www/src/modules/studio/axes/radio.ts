/* Radio — always a circle, so its only axis is the family's synced Fill,
   resolved once by the Checkbox module (the key is shared, not copied). */

import { CHECKBOX_DEFAULTS } from "./checkbox"
import type { Resolved, StudioState } from "./index"

export const RADIO_DEFAULTS = {
  checkFill: CHECKBOX_DEFAULTS.checkFill,
}

export function resolveRadio(_state: StudioState): Resolved {
  return {}
}
