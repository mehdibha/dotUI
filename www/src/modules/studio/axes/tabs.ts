/* Tabs — the selected-tab signature. Segmented (shadcn, Radix Themes,
   dotUI today), line (Material, Geist, Linear, GitHub), pill (Radix Themes
   soft, dashboard navs) or enclosed (browser tabs, Chakra, classic
   Bootstrap).

   Engine: the `style` enum param on `tabs` — every look ships as the
   `variant` prop's values, the param sets the default. Color is a leaf of
   Color's Primary: the `color` param paints the selected tab's ink per look.
   Motion: how long the selection takes to settle, the indicator's glide
   included (`--studio-tabs-state-*`). */

import { SOURCE_OPTIONS } from "./color"
import type { Resolved, StudioState } from "./index"
import { resolveStateChange, TAILWIND_TIMING } from "./motion"

/* shadcn's tab trigger rides Tailwind's default timing. */
const MOTION = TAILWIND_TIMING

export const TAB_DEFAULTS = {
  tabStyle: "segmented",
  tabsColor: "neutral",
  tabsMotion: MOTION,
}

export const TAB_STYLE_OPTIONS = [
  { value: "segmented", label: "Segmented" },
  { value: "line", label: "Line" },
  { value: "pill", label: "Pill" },
  { value: "enclosed", label: "Enclosed" },
]

export function resolveTabs(state: StudioState): Resolved {
  const style = TAB_STYLE_OPTIONS.some((o) => o.value === state.tabStyle)
    ? state.tabStyle
    : TAB_DEFAULTS.tabStyle
  const color = SOURCE_OPTIONS.some((o) => o.value === state.tabsColor)
    ? state.tabsColor
    : TAB_DEFAULTS.tabsColor
  return {
    tokens: resolveStateChange("tabs", state.tabsMotion, MOTION),
    params: { tabs: { style, color } },
  }
}
