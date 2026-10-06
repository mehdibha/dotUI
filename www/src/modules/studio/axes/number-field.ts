/* Number field — where the steppers sit: an attached pair on the right (the
   registry today, Carbon), one at each end (Polaris mobile, HeroUI), or a
   stacked chevron column (Spectrum, Ant, classic desktop).

   Engine: `number-field.steppers` swaps the shipped base file — the layouts
   differ in structure, not classes. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const NUMBER_FIELD_DEFAULTS = {
  numberLayout: "right",
}

export const NUMBER_LAYOUT_OPTIONS = [
  { value: "right", label: "Right" },
  { value: "split", label: "Split" },
  { value: "stacked", label: "Stacked" },
]

export const NUMBER_FIELD_SCHEMA: ChapterSchema<typeof NUMBER_FIELD_DEFAULTS> =
  {
    numberLayout: oneOf(NUMBER_LAYOUT_OPTIONS),
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
