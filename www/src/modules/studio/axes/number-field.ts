/* Number field — where the steppers sit. They are parts of the field shell,
   so they wear Inputs › Style. Engine: `number-field.steppers` swaps the
   shipped base file (the layouts differ in structure, not classes). */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const NUMBER_FIELD_DEFAULTS = {
  numberLayout: "right-cells",
}

export const NUMBER_LAYOUT_VALUES = [
  "right-cells",
  "stacked-cells",
  "stacked-inset",
  "split",
] as const

export const NUMBER_FIELD_SCHEMA: ChapterSchema<typeof NUMBER_FIELD_DEFAULTS> =
  {
    numberLayout: oneOf(NUMBER_LAYOUT_VALUES),
  }

export function resolveNumberField(state: Effective): Resolved {
  return {
    params: {
      "number-field": {
        steppers: state.numberLayout,
      },
    },
  }
}

export const chapter = defineChapter({
  id: "number-field",
  defaults: NUMBER_FIELD_DEFAULTS,
  schema: NUMBER_FIELD_SCHEMA,
  resolve: resolveNumberField,
})
