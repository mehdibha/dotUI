/* Spinner: the indeterminate loading signature, each style with its own
   loop, shipped as its own base file. Button, list-box, table and toast
   embed it. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

export const STYLE_VALUES = ["ring", "ring-track", "blades", "dots"] as const

export const chapter = defineChapter({
  id: "spinner",
  defaults: {
    spinnerStyle: "ring",
  },
  schema: {
    spinnerStyle: oneOf(STYLE_VALUES),
  },
  resolve(state: Effective): Resolved {
    return { params: { loader: { style: state.spinnerStyle } } }
  },
})
