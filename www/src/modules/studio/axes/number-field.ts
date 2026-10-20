/* Number field — where the steppers sit. They are parts of the field shell,
   so they wear Inputs › Style. Each layout ships its own base file: they
   differ in structure, not classes. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

export const NUMBER_LAYOUT_VALUES = [
  "right-cells",
  "stacked-cells",
  "stacked-inset",
  "split",
] as const

export const chapter = defineChapter({
  id: "number-field",
  defaults: {
    numberLayout: "right-cells",
  },
  schema: {
    numberLayout: oneOf(NUMBER_LAYOUT_VALUES),
  },
  resolve(state: Effective): Resolved {
    return {
      params: {
        "number-field": {
          steppers: state.numberLayout,
        },
      },
    }
  },
})
