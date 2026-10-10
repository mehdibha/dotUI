/* Select — what draws the trigger and its caret. Engine: `select.trigger`
   swaps the shipped base file (a Button, or the field shell); `select.caret`
   swaps the glyph (select/meta.ts `source`). */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const SELECT_DEFAULTS = {
  selectTrigger: "button",
  pickerCaret: "chevron",
}

export const TRIGGER_VALUES = ["field", "button"] as const

export const CARET_VALUES = ["chevron", "double"] as const

export const SELECT_SCHEMA: ChapterSchema<typeof SELECT_DEFAULTS> = {
  selectTrigger: oneOf(TRIGGER_VALUES),
  pickerCaret: oneOf(CARET_VALUES),
}

export function resolveSelect(state: Effective): Resolved {
  return {
    params: {
      select: { trigger: state.selectTrigger, caret: state.pickerCaret },
    },
  }
}

export const chapter = defineChapter({
  id: "select",
  defaults: SELECT_DEFAULTS,
  schema: SELECT_SCHEMA,
  resolve: resolveSelect,
})
