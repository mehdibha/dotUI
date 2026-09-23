/* Tabs — the selected-tab signature. Segmented (shadcn, Radix Themes,
   dotUI today), line (Material, Geist, Linear, GitHub), pill (Radix Themes
   soft, dashboard navs) or enclosed (browser tabs, Chakra, classic
   Bootstrap).

   Engine: the `style` enum param on `tabs` — every look ships as the
   `variant` prop's values, the param sets the default. Color is a leaf of
   Color's Primary: the `color` param paints the selected tab's ink per look. */

import { SOURCE } from "./color"
import type { Resolved, StudioState } from "./index"
import { oneOf } from "./schema"
import type { Schema } from "./schema"

export const TAB_DEFAULTS = {
  tabStyle: "segmented",
  tabsColor: "neutral",
}

export const TAB_STYLE_OPTIONS = [
  { value: "segmented", label: "Segmented" },
  { value: "line", label: "Line" },
  { value: "pill", label: "Pill" },
  { value: "enclosed", label: "Enclosed" },
]

export const TAB_SCHEMA: Schema<typeof TAB_DEFAULTS> = {
  tabStyle: oneOf(TAB_STYLE_OPTIONS),
  tabsColor: SOURCE,
}

export function resolveTabs(state: StudioState): Resolved {
  return { params: { tabs: { style: state.tabStyle, color: state.tabsColor } } }
}
