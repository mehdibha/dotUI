/* Alert: the inline notice's fill, edge and status ink. A solid status
   alert stays per instance, never a style. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

export const STYLE_VALUES = [
  "neutral",
  "soft",
  "soft-outline",
  "outline",
  "inverse",
] as const

export const chapter = defineChapter({
  id: "alert",
  defaults: {
    alertStyle: "neutral",
  },
  schema: {
    alertStyle: oneOf(STYLE_VALUES),
  },
  resolve(state: Effective): Resolved {
    return { params: { alert: { style: state.alertStyle } } }
  },
})
