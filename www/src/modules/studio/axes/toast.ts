/* Toast: its surface, independent of alert and tooltip, and how a status
   toast shows its status. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

export const STYLE_VALUES = ["surface", "inverse"] as const

export const STATUS_VALUES = ["icon", "bold", "soft"] as const

export const chapter = defineChapter({
  id: "toast",
  defaults: {
    toastStyle: "surface",
    toastStatus: "icon",
  },
  schema: {
    toastStyle: oneOf(STYLE_VALUES),
    toastStatus: oneOf(STATUS_VALUES),
  },
  resolve(state: Effective): Resolved {
    // On Inverse, the status icon takes the solid color to read.
    const status =
      state.toastStatus === "icon" && state.toastStyle === "inverse"
        ? "solid-icon"
        : state.toastStatus
    return {
      params: { toast: { surface: state.toastStyle, status } },
    }
  },
})
