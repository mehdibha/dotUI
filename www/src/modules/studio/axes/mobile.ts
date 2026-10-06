/* Mobile — how dialogs adapt below the mobile line (the `use-mobile` hook's
   768px viewport breakpoint; Tailwind's `md`): the classic modal stays
   centered, iOS-style systems drop it to a sheet. Pickers are Menus'.

   Engine: `modal.mobile` is a class slice that docks the modal to the bottom
   edge. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const MOBILE_DEFAULTS = {
  mobileDialogs: "center",
}

export const DIALOG_OPTIONS = [
  { value: "center", label: "Center" },
  { value: "sheet", label: "Sheet" },
]

export const MOBILE_SCHEMA: ChapterSchema<typeof MOBILE_DEFAULTS> = {
  mobileDialogs: oneOf(DIALOG_OPTIONS),
}

export function resolveMobile(state: Effective): Resolved {
  return { params: { modal: { mobile: state.mobileDialogs } } }
}

export const chapter = defineChapter({
  id: "mobile",
  defaults: MOBILE_DEFAULTS,
  schema: MOBILE_SCHEMA,
  resolve: resolveMobile,
})
