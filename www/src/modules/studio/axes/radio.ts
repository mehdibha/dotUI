/* Radio — always a circle, so its only axis is Fill, a leaf of Color's
   Primary. See checkbox.ts for the mechanism. */

import { fillScope, SOURCE_OPTIONS } from "./color"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const RADIO_DEFAULTS = {
  radioColor: "accent",
}

export const RADIO_SCHEMA: ChapterSchema<typeof RADIO_DEFAULTS> = {
  radioColor: oneOf(SOURCE_OPTIONS),
}

export function resolveRadio(state: Effective): Resolved {
  return { color: fillScope(state, "radio", state.radioColor) }
}

export const chapter = defineChapter({
  id: "radio",
  defaults: RADIO_DEFAULTS,
  schema: RADIO_SCHEMA,
  resolve: resolveRadio,
})
