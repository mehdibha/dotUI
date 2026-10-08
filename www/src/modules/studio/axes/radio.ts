/* Radio — the selected mark (`radio-group.mark`) and its fill, a leaf of
   Color's Primary (see checkbox.ts). */

import { fillScope, SOURCE_VALUES } from "./color"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const RADIO_DEFAULTS = {
  radioColor: "accent",
  radioMark: "dot",
}

/* Dot: a filled disc with an on-fill dot. Ring: a colored ring around a
   colored dot. */
export const MARK_VALUES = ["dot", "ring"] as const

export const RADIO_SCHEMA: ChapterSchema<typeof RADIO_DEFAULTS> = {
  radioColor: oneOf(SOURCE_VALUES),
  radioMark: oneOf(MARK_VALUES),
}

export function resolveRadio(state: Effective): Resolved {
  return {
    params: { "radio-group": { mark: state.radioMark } },
    color: fillScope(state, "radio", state.radioColor),
  }
}

export const chapter = defineChapter({
  id: "radio",
  defaults: RADIO_DEFAULTS,
  schema: RADIO_SCHEMA,
  resolve: resolveRadio,
})
