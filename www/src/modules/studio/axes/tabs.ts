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
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { resolveStateChange, TAILWIND_TIMING } from "./motion"
import { oneOf, STATE_CHANGE } from "./schema"
import type { ChapterSchema } from "./schema"

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

export const TAB_SCHEMA: ChapterSchema<typeof TAB_DEFAULTS> = {
  tabStyle: oneOf(TAB_STYLE_OPTIONS),
  tabsColor: oneOf(SOURCE_OPTIONS),
  tabsMotion: STATE_CHANGE,
}

export function resolveTabs(state: Effective): Resolved {
  return {
    tokens: resolveStateChange("tabs", state.tabsMotion, MOTION),
    params: { tabs: { style: state.tabStyle, color: state.tabsColor } },
  }
}

export const chapter = defineChapter({
  id: "tabs",
  defaults: TAB_DEFAULTS,
  schema: TAB_SCHEMA,
  resolve: resolveTabs,
})
