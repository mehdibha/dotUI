/* Menus & popovers: one row language for every floating list (menu, the
   select and combobox list-box, command), the arrows on anchored layers, and
   what pickers become on phones.

   Engine: `indicator`, `highlight`, `inset` and `selected` are enum params on
   `menu` and `list-box`, one recipe (list-box LIST_ROWS); `search`, `scale`
   and `inset` on `command`; `tip` on `popover` and `tooltip`; `mobile` swaps
   the shipped popover file. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const MENU_DEFAULTS = {
  menuHighlight: "neutral",
  menuInset: "inset",
  menuArrows: "tooltips",
  menuIndicator: "check-end",
  menuSelectedRow: "none",
  mobilePickers: "drawer",
  menuSearch: "field",
  menuScale: "default",
}

export const HIGHLIGHT_OPTIONS = [
  { value: "neutral", label: "Neutral", description: "shadcn, Geist, Linear" },
  { value: "accent", label: "Accent", description: "Radix Themes, macOS" },
]

export const INSET_OPTIONS = [
  { value: "inset", label: "Inset", description: "shadcn, Geist, Linear" },
  {
    value: "full-bleed",
    label: "Full bleed",
    description: "Material 3, Carbon, Airbnb",
  },
]

export const ARROWS_OPTIONS = [
  {
    value: "tooltips",
    label: "Tooltips",
    description: "shadcn, Geist, Polaris",
  },
  { value: "none", label: "None", description: "Linear, Primer, Material 3" },
  { value: "popovers", label: "Popovers", description: "Spotify" },
  { value: "both", label: "Both", description: "Carbon, Duolingo" },
]

/* Which layers draw a tip: [popover, tooltip]. */
const TIPS: Record<string, [popover: string, tooltip: string]> = {
  tooltips: ["none", "tip"],
  none: ["none", "none"],
  popovers: ["tip", "none"],
  both: ["tip", "tip"],
}

export const INDICATOR_OPTIONS = [
  { value: "check-end", label: "End", description: "shadcn, Geist, Linear" },
  { value: "check-start", label: "Start", description: "Radix Themes, Primer" },
  { value: "none", label: "None", description: "Material 3, Airbnb" },
]

export const SELECTED_ROW_OPTIONS = [
  { value: "none", label: "None", description: "shadcn, Radix Themes" },
  { value: "tint", label: "Tint", description: "Material 3, Polaris, Carbon" },
]

export const PICKER_OPTIONS = [
  { value: "drawer", label: "Drawer", description: "Geist, Notion, Stripe" },
  { value: "anchored", label: "Anchored", description: "Primer, Radix Themes" },
]

export const SEARCH_OPTIONS = [
  { value: "field", label: "Field", description: "shadcn" },
  { value: "bar", label: "Bar", description: "Supabase, Geist" },
  { value: "prompt", label: "Prompt", description: "Linear, Raycast" },
]

export const SCALE_OPTIONS = [
  { value: "default", label: "Default", description: "shadcn" },
  { value: "large", label: "Large", description: "Linear, Raycast" },
]

export const MENU_SCHEMA: ChapterSchema<typeof MENU_DEFAULTS> = {
  menuHighlight: oneOf(HIGHLIGHT_OPTIONS),
  menuInset: oneOf(INSET_OPTIONS),
  menuArrows: oneOf(ARROWS_OPTIONS),
  menuIndicator: oneOf(INDICATOR_OPTIONS),
  menuSelectedRow: oneOf(SELECTED_ROW_OPTIONS),
  mobilePickers: oneOf(PICKER_OPTIONS),
  menuSearch: oneOf(SEARCH_OPTIONS),
  menuScale: oneOf(SCALE_OPTIONS),
}

export function resolveMenus(state: Effective): Resolved {
  const rows = {
    indicator: state.menuIndicator,
    highlight: state.menuHighlight,
    inset: state.menuInset,
    selected: state.menuSelectedRow,
  }
  const [popoverTip, tooltipTip] = TIPS[state.menuArrows]!
  return {
    params: {
      menu: rows,
      "list-box": rows,
      command: {
        search: state.menuSearch,
        inset: state.menuInset,
        scale: state.menuScale,
      },
      popover: { tip: popoverTip, mobile: state.mobilePickers },
      tooltip: { tip: tooltipTip },
    },
  }
}

export const chapter = defineChapter({
  id: "menus",
  defaults: MENU_DEFAULTS,
  schema: MENU_SCHEMA,
  resolve: resolveMenus,
  rules: [
    {
      // Neither a check nor a fill would leave the selection invisible.
      id: "menus/check-or-fill",
      target: "menuSelectedRow",
      when: { key: "menuIndicator", in: ["none"] },
      effect: { kind: "pin", value: "tint" },
      cause: "menuIndicator",
    },
  ],
})
