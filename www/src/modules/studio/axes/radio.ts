/* Radio — always a circle, so its only axis is Fill, a leaf of Color's
   Primary. See checkbox.ts for the mechanism. */

import { fillScope, SOURCE_OPTIONS } from "./color"
import type { Resolved, StudioState } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const RADIO_DEFAULTS = {
  radioColor: "neutral",
}

export const RADIO_SCHEMA: ChapterSchema<typeof RADIO_DEFAULTS> = {
  radioColor: oneOf(SOURCE_OPTIONS),
}

export function resolveRadio(state: StudioState): Resolved {
  return { color: fillScope(state, "radio", state.radioColor) }
}
