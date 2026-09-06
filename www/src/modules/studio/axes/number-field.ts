/* Number field — where the steppers sit: an attached pair on the right (the
   registry today, Carbon), one at each end (Polaris mobile, HeroUI), or a
   stacked chevron column (Spectrum, Ant, classic desktop).

   Engine: `number-field.steppers` swaps the shipped base file — the layouts
   differ in structure, not classes. */

import type { Resolved, StudioState } from "./index"
import { pick } from "./inputs"

export const NUMBER_FIELD_DEFAULTS = {
  numberLayout: "right",
}

export const NUMBER_LAYOUT_OPTIONS = [
  { value: "right", label: "Right" },
  { value: "split", label: "Split" },
  { value: "stacked", label: "Stacked" },
]

export function resolveNumberField(state: StudioState): Resolved {
  return {
    params: {
      "number-field": {
        steppers: pick(NUMBER_LAYOUT_OPTIONS, state.numberLayout, "right"),
      },
    },
  }
}
