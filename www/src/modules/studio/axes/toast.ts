/* Toast: its surface, independent of alert and tooltip, and how a status
   toast shows its status. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const TOAST_DEFAULTS = {
  toastStyle: "surface",
  toastStatus: "icon",
}

export const STYLE_VALUES = ["surface", "inverse"] as const

export const STATUS_VALUES = ["icon", "bold", "soft"] as const

export const TOAST_SCHEMA: ChapterSchema<typeof TOAST_DEFAULTS> = {
  toastStyle: oneOf(STYLE_VALUES),
  toastStatus: oneOf(STATUS_VALUES),
}

export function resolveToast(state: Effective): Resolved {
  // On Inverse, the status icon takes the solid color to read.
  const status =
    state.toastStatus === "icon" && state.toastStyle === "inverse"
      ? "solid-icon"
      : state.toastStatus
  return {
    params: { toast: { surface: state.toastStyle, status } },
  }
}

export const chapter = defineChapter({
  id: "toast",
  defaults: TOAST_DEFAULTS,
  schema: TOAST_SCHEMA,
  resolve: resolveToast,
})
