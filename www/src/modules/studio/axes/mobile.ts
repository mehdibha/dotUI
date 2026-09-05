/* Mobile — how overlays adapt below the mobile line (the `use-mobile` hook's
   768px viewport breakpoint; Tailwind's `md`). Off renders the same
   everywhere (Radix Themes). Pickers is the loudest split: shadcn/Vaul and
   most product apps slide selects, menus and date pickers into a bottom
   drawer, Geist keeps the popover anchored. Dialogs: the classic modal stays
   centered, iOS-style systems drop it to a sheet.

   Engine: `popover.mobile` swaps the shipped popover file — the drawer
   variant renders a Drawer below the line for modal popovers (non-modal ones,
   a combobox list or a submenu, keep their anchor); `modal.mobile` is a
   class slice that docks the modal to the bottom edge. */

import type { Resolved, StudioState } from "./index"

export const MOBILE_DEFAULTS = {
  mobileAdapt: true,
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

/** The overlay treatments in effect — Off resolves to no adaptation. */
export function mobileOverlays(state: StudioState) {
  return {
    pickers: state.mobileAdapt ? state.mobilePickers : "popover",
    dialogs: state.mobileAdapt ? state.mobileDialogs : "center",
  }
}

export const WIRED = true

export function resolveMobile(state: StudioState): Resolved {
  const { pickers, dialogs } = mobileOverlays(state)
  return {
    params: { popover: { mobile: pickers }, modal: { mobile: dialogs } },
  }
}
