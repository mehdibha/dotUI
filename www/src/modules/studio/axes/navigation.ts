/* Navigation — how the current location is marked: the default tab look,
   the sidebar's current item, the indicator color both share, and the
   weights and case of tabs, segmented items and sidebar items (the sidebar's
   weight follows the tabs', the case the buttons'). Segmented tabs wear the
   segmented control's chip (segmented-control.ts writes it), pill tabs a
   toggle's selected look.

   Engine: `style`, `color`, `indicator`, `pill`, `weight` and `case` params
   on `tabs`; `marker` (folded with the color), `weight` and `case` on
   `sidebar`; `weight` and `case` on `segmented-control`. */

import { CASE_VALUES } from "./buttons"
import { SOURCE_VALUES } from "./color"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const NAVIGATION_DEFAULTS = {
  tabStyle: "segmented",
  tabsColor: "neutral",
  navMarker: "fill",
  navWeight: "medium",
  navItemWeight: "auto" as
    | "auto"
    | "regular"
    | "regular-medium"
    | "regular-semibold"
    | "medium"
    | "medium-semibold"
    | "semibold"
    | "bold",
  tabsPill: "same" as "same" | "tone" | "solid" | "tint" | "inverse",
  tabIndicator: "full",
  navCase: "same" as "same" | "sentence" | "uppercase",
}

export const TAB_STYLE_VALUES = ["segmented", "line", "pill"] as const

export const MARKER_VALUES = [
  "fill",
  "surface",
  "bar",
  "fill-bar",
  "ink",
  "outline",
  "pill",
] as const

export const WEIGHT_VALUES = [
  "regular",
  "regular-medium",
  "regular-semibold",
  "medium",
  "medium-semibold",
  "semibold",
  "bold",
] as const

// Auto: shadcn's sidebar rests a step under its medium tabs.
const ITEM_WEIGHT_AUTO: Record<string, string> = {
  ...Object.fromEntries(WEIGHT_VALUES.map((value) => [value, value])),
  medium: "regular-medium",
}

export const PILL_VALUES = ["tone", "solid", "tint", "inverse"] as const

export const INDICATOR_VALUES = ["full", "label"] as const

export const NAVIGATION_SCHEMA: ChapterSchema<typeof NAVIGATION_DEFAULTS> = {
  tabStyle: oneOf(TAB_STYLE_VALUES),
  tabsColor: oneOf(SOURCE_VALUES),
  navMarker: oneOf(MARKER_VALUES),
  navWeight: oneOf(WEIGHT_VALUES),
  navItemWeight: oneOf(WEIGHT_VALUES),
  tabsPill: oneOf(PILL_VALUES),
  tabIndicator: oneOf(INDICATOR_VALUES),
  navCase: oneOf(CASE_VALUES),
}

export function resolveNavigation(state: Effective): Resolved {
  const marker =
    state.tabsColor === "accent" && state.navMarker !== "surface"
      ? `${state.navMarker}-accent`
      : state.navMarker
  return {
    params: {
      tabs: {
        style: state.tabStyle,
        color: state.tabsColor,
        indicator: state.tabIndicator,
        pill: state.tabsPill,
        weight: state.navWeight,
        case: state.navCase,
      },
      sidebar: { marker, weight: state.navItemWeight, case: state.navCase },
      "segmented-control": { weight: state.navWeight, case: state.navCase },
    },
  }
}

export const chapter = defineChapter({
  id: "navigation",
  defaults: NAVIGATION_DEFAULTS,
  schema: NAVIGATION_SCHEMA,
  resolve: resolveNavigation,
  follows: {
    navItemWeight: [
      { kind: "auto", id: "auto", from: "navWeight", table: ITEM_WEIGHT_AUTO },
    ],
    tabsPill: [{ kind: "same", id: "same", from: "toggleSelected" }],
    navCase: [{ kind: "same", id: "same", from: "buttonCase" }],
  },
  rules: [
    {
      // The page-toned chip reads only on a sidebar below the page.
      id: "navigation/surface-needs-shell",
      target: "navMarker",
      when: { key: "shellTone", notIn: ["recessed"] },
      effect: { kind: "exclude", options: ["surface"], fallback: "fill" },
      cause: "shellTone",
    },
  ],
})
