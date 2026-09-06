/* Tabs — the selected-tab signature. Segmented (shadcn, Radix Themes,
   dotUI today), line (Material, Geist, Linear, GitHub), pill (Radix Themes
   soft, dashboard navs) or enclosed (browser tabs, Chakra, classic
   Bootstrap).

   Engine: the `style` enum param on `tabs` — every look ships as the
   `variant` prop's values, the param sets the default. */

import type { Resolved, StudioState } from "./index"

export const TAB_DEFAULTS = {
  tabStyle: "segmented",
}

export const TAB_STYLE_OPTIONS = [
  { value: "segmented", label: "Segmented" },
  { value: "line", label: "Line" },
  { value: "pill", label: "Pill" },
  { value: "enclosed", label: "Enclosed" },
]

export const WIRED = true

export function resolveTabs(state: StudioState): Resolved {
  const style = TAB_STYLE_OPTIONS.some((o) => o.value === state.tabStyle)
    ? state.tabStyle
    : TAB_DEFAULTS.tabStyle
  return { params: { tabs: { style } } }
}
