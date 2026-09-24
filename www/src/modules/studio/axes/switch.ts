/* Switch — always a pill, so its only axis is Fill, a leaf of Color's
   Primary (Geist's blue toggle beside near-black checkboxes). See checkbox.ts
   for the mechanism. */

import { fillScope, SOURCE_OPTIONS } from "./color"
import type { Resolved, StudioState } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const SWITCH_DEFAULTS = {
  switchColor: "neutral",
}

export const SWITCH_SCHEMA: ChapterSchema<typeof SWITCH_DEFAULTS> = {
  switchColor: oneOf(SOURCE_OPTIONS),
}

export function resolveSwitch(state: StudioState): Resolved {
  return { color: fillScope(state, "switch", state.switchColor) }
}
