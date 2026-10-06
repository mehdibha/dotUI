/* Radio — the selected mark (`radio-group.mark`) and its fill, a leaf of
   Color's Primary (see checkbox.ts). */

import { fillScope, SOURCE_OPTIONS } from "./color"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const RADIO_DEFAULTS = {
  radioColor: "accent",
  radioMark: "dot",
}

/* Dot: a filled disc with an on-fill dot (shadcn, Primer, Polaris, Linear).
   Ring: a colored ring around a colored dot (Material 3, Carbon, Geist,
   Supabase). */
export const MARK_OPTIONS = [
  { value: "dot", label: "Dot" },
  { value: "ring", label: "Ring" },
]

export const RADIO_SCHEMA: ChapterSchema<typeof RADIO_DEFAULTS> = {
  radioColor: oneOf(SOURCE_OPTIONS),
  radioMark: oneOf(MARK_OPTIONS),
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
