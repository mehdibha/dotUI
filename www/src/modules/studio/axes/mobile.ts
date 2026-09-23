/* Mobile — how overlays adapt below the mobile line (the `use-mobile` hook's
   768px viewport breakpoint; Tailwind's `md`). Popover + Center renders the
   same everywhere (Radix Themes, Spectrum 2).

   Engine: `popover.mobile` swaps the shipped popover file — the drawer
   variant renders a Drawer below the line for modal popovers and nests one
   per submenu (a combobox list keeps its anchor); `modal.mobile` is a class
   slice that docks the modal to the bottom edge. */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const MOBILE_DEFAULTS = {
  mobilePickers: "drawer",
  mobileDialogs: "center",
}

export const PICKER_OPTIONS = [
  {
    value: "drawer",
    label: "Drawer",
    description:
      "On phones, every modal popover (selects, menus, submenus, date " +
      "pickers and popover dialogs) opens as a bottom drawer with a drag " +
      "handle instead of a floating popover.",
    caution:
      "Viewports under 768px only: tablets (iPad is 768px+) keep popovers.",
  },
  {
    value: "popover",
    label: "Popover",
    description: "Pickers stay anchored popovers at every size, as on desktop.",
    seenIn: ["Spectrum 2", "Radix Themes", "shadcn/ui"],
  },
]

export const DIALOG_OPTIONS = [
  {
    value: "center",
    label: "Center",
    description: "Dialogs stay centered cards at every size.",
    seenIn: ["Radix Themes", "shadcn/ui", "Spectrum 2"],
  },
  {
    value: "sheet",
    label: "Sheet",
    description:
      "On phones, dialogs dock to the bottom edge at full width, square at " +
      "the bottom, and rise in from below.",
    seenIn: ["HeroUI", "coss ui"],
    caution:
      "Viewports under 768px only: tablets (iPad is 768px+) keep centered " +
      "dialogs.",
  },
]

export function resolveMobile(state: StudioState): Resolved {
  return {
    params: {
      popover: { mobile: state.mobilePickers },
      modal: { mobile: state.mobileDialogs },
    },
  }
}

export const MOBILE_SPEC = {
  label: "Mobile",
  description:
    "How floating layers adapt below the 768px mobile breakpoint. Desktop " +
    "rendering is unchanged by every option.",
  axes: {
    mobilePickers: {
      label: "Pickers",
      description:
        "What modal popovers (selects, menus, date pickers, popover dialogs) " +
        "become on phones. Comboboxes and other non-modal popovers keep " +
        "their anchor either way.",
      value: { type: "enum", options: PICKER_OPTIONS },
      guidance:
        "Spectrum 2, Radix Themes and shadcn/ui keep pickers as popovers " +
        "on phones; Adobe's earlier React Spectrum (v3) opens pickers and " +
        "menus in a bottom tray, and Spectrum 2 plans to return to trays. " +
        "A drawer gives thumb-reachable, full-width options; a popover " +
        "keeps one behavior to design and test.",
    },
    mobileDialogs: {
      label: "Dialogs",
      description: "Where dialogs sit on phones.",
      value: { type: "enum", options: DIALOG_OPTIONS },
      guidance:
        "Radix Themes, shadcn/ui and Spectrum 2 center dialogs at every " +
        "size; HeroUI's default placement and coss ui's default " +
        "bottomStickOnMobile dock them to the bottom edge on small screens. " +
        "Sheet keeps actions in thumb reach.",
    },
  },
} satisfies ChapterSpec<typeof MOBILE_DEFAULTS>
