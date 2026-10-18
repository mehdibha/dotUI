/* Kbd — the chrome a keyboard key wears: a flat muted chip, a hairline
   outline, or a raised keycap. Menu and list rows strip it to text in
   every style. Corners read the small control rung. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

export const TREATMENT_VALUES = ["chip", "outline", "keycap"] as const

export const chapter = defineChapter({
  id: "kbd",
  defaults: {
    kbdTreatment: "chip",
  },
  schema: {
    kbdTreatment: oneOf(TREATMENT_VALUES),
  },
  resolve(state: Effective): Resolved {
    return {
      params: {
        kbd: { style: state.kbdTreatment },
      },
    }
  },
})
