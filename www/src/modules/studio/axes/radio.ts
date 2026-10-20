/* Radio — the selected mark (`radio-group.mark`) and its fill, a leaf of
   Color's Primary (see checkbox.ts). */

import { fillScope, SOURCE_VALUES } from "./color"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

/* Dot: a filled disc with an on-fill dot. Ring: a colored ring around a
   colored dot. */
export const MARK_VALUES = ["dot", "ring"] as const

export const chapter = defineChapter({
  id: "radio",
  defaults: {
    radioColor: "accent",
    radioMark: "dot",
  },
  schema: {
    radioColor: oneOf(SOURCE_VALUES),
    radioMark: oneOf(MARK_VALUES),
  },
  resolve(state: Effective): Resolved {
    return {
      params: { "radio-group": { mark: state.radioMark } },
      color: fillScope(state, "radio", state.radioColor),
    }
  },
})
