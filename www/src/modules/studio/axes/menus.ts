/* Menus & popovers: one row language for every floating list (menu, the
   select and combobox list-box, command), the arrows on anchored layers, and
   what pickers become on phones.

   Engine: `indicator`, `highlight`, `inset`, `selected` and `rows` are enum params on
   `menu` and `list-box`, one recipe (list-box LIST_ROWS); `search`, `scale`
   and `inset` on `command`; `tip` on `popover` and `tooltip`; `mobile` swaps
   the shipped popover file; `--studio-list-box-highlight` is the row wash. */

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
  menuRows: "auto",
  mobilePickers: "drawer",
  menuSearch: "field",
  menuScale: "default",
}

export const HIGHLIGHT_VALUES = ["neutral", "accent"] as const

export const INSET_VALUES = ["inset", "full-bleed"] as const

export const ARROWS_VALUES = ["tooltips", "none", "popovers", "both"] as const

/* Which layers draw a tip: [popover, tooltip]. */
const TIPS: Record<string, [popover: string, tooltip: string]> = {
  tooltips: ["none", "tip"],
  none: ["none", "none"],
  popovers: ["tip", "none"],
  both: ["tip", "tip"],
}

export const INDICATOR_VALUES = ["check-end", "check-start", "none"] as const

export const SELECTED_ROW_VALUES = ["none", "tint"] as const

/* Auto: the density's own rows. Match: the control height. Step up: one
   step above it. */
export const ROWS_VALUES = ["auto", "match", "step"] as const

export const PICKER_VALUES = ["drawer", "anchored"] as const

export const SEARCH_VALUES = ["field", "bar", "prompt"] as const

export const SCALE_VALUES = ["default", "large"] as const

export const MENU_SCHEMA: ChapterSchema<typeof MENU_DEFAULTS> = {
  menuHighlight: oneOf(HIGHLIGHT_VALUES),
  menuInset: oneOf(INSET_VALUES),
  menuArrows: oneOf(ARROWS_VALUES),
  menuIndicator: oneOf(INDICATOR_VALUES),
  menuSelectedRow: oneOf(SELECTED_ROW_VALUES),
  menuRows: oneOf(ROWS_VALUES),
  mobilePickers: oneOf(PICKER_VALUES),
  menuSearch: oneOf(SEARCH_VALUES),
  menuScale: oneOf(SCALE_VALUES),
}

export function resolveMenus(state: Effective): Resolved {
  const rows = {
    indicator: state.menuIndicator,
    highlight: state.menuHighlight,
    inset: state.menuInset,
    selected: state.menuSelectedRow,
    rows: state.menuRows,
  }
  const [popoverTip, tooltipTip] = TIPS[state.menuArrows]!
  // Beside a neutral tinted selected row the neutral highlight steps back, so
  // hover and selection never share a tone (Carbon, Polaris: hover is the
  // lighter). A brand wash already sets the selection apart.
  const tokens: Record<string, string> =
    state.menuSelectedRow === "tint" &&
    state.menuHighlight === "neutral" &&
    state.selectedWash === "neutral"
      ? {
          "--studio-list-box-highlight":
            "color-mix(in oklab, var(--color-highlight) 60%, transparent)",
        }
      : {}
  return {
    tokens,
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
