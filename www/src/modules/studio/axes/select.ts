/* Select — what draws the trigger and its caret. `select.trigger`
   swaps the shipped base file (a Button, or the field shell); `select.caret`
   swaps the glyph (select/meta.ts `source`). */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

export const TRIGGER_VALUES = ["field", "button"] as const

export const CARET_VALUES = ["chevron", "double"] as const

export const chapter = defineChapter({
  id: "select",
  defaults: {
    selectTrigger: "button",
    pickerCaret: "chevron",
  },
  schema: {
    selectTrigger: oneOf(TRIGGER_VALUES),
    pickerCaret: oneOf(CARET_VALUES),
  },
  resolve(state: Effective): Resolved {
    return {
      params: {
        select: { trigger: state.selectTrigger, caret: state.pickerCaret },
      },
    }
  },
})
