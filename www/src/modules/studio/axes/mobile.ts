/* Mobile — how overlays adapt below the mobile line (the `use-mobile` hook's
   768px viewport breakpoint; Tailwind's `md`). Popover + Center renders the
   same everywhere (Radix Themes). Pickers is the loudest split: shadcn/Vaul and
   most product apps slide selects, menus and date pickers into a bottom
   drawer, Geist keeps the popover anchored. Dialogs: the classic modal stays
   centered, iOS-style systems drop it to a sheet.

   Engine: `popover.mobile` swaps the shipped popover file — the drawer
   variant renders a Drawer below the line for modal popovers and nests one
   per submenu (a combobox list keeps its anchor); `modal.mobile` is a class
   slice that docks the modal to the bottom edge. */

import type { Resolved, StudioState } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const MOBILE_DEFAULTS = {
  mobilePickers: "drawer",
  mobileDialogs: "center",
}

export const PICKER_OPTIONS = [
  { value: "drawer", label: "Drawer" },
  { value: "popover", label: "Popover" },
]

export const DIALOG_OPTIONS = [
  { value: "center", label: "Center" },
  { value: "sheet", label: "Sheet" },
]

export const MOBILE_SCHEMA: ChapterSchema<typeof MOBILE_DEFAULTS> = {
  mobilePickers: oneOf(PICKER_OPTIONS),
  mobileDialogs: oneOf(DIALOG_OPTIONS),
}

export function resolveMobile(state: StudioState): Resolved {
  return {
    params: {
      popover: { mobile: state.mobilePickers },
      modal: { mobile: state.mobileDialogs },
    },
  }
}
