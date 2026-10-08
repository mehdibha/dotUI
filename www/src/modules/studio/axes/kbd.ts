/* Kbd — the chrome a keyboard key wears: a flat muted chip, a hairline
   outline, or a raised keycap. Menu and list rows strip it to text in
   every style.

   Engine: one enum param on `kbd`; corners read the small control rung. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const KBD_DEFAULTS = {
  kbdTreatment: "chip",
}

export const TREATMENT_VALUES = ["chip", "outline", "keycap"] as const

export const KBD_SCHEMA: ChapterSchema<typeof KBD_DEFAULTS> = {
  kbdTreatment: oneOf(TREATMENT_VALUES),
}

export function resolveKbd(state: Effective): Resolved {
  return {
    params: {
      kbd: { style: state.kbdTreatment },
    },
  }
}

export const chapter = defineChapter({
  id: "kbd",
  defaults: KBD_DEFAULTS,
  schema: KBD_SCHEMA,
  resolve: resolveKbd,
})
