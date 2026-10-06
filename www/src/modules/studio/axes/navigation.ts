/* Navigation — how the current location is marked: the default tab look,
   the sidebar's current item, the indicator color both share, and the
   weights tabs, segmented items and sidebar items rest and step to (the
   sidebar's follows the tabs'). Segmented tabs wear the segmented control's
   chip (segmented-control.ts writes it), pill tabs a toggle's selected look.

   Engine: `style`, `color`, `pill` and `weight` params on `tabs`; `marker`
   (folded with the color) and `weight` on `sidebar`; `weight` on
   `segmented-control`. */

import { SOURCE_OPTIONS } from "./color"
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
}

/* Descriptions credit the systems each option is copied from. */
export const TAB_STYLE_OPTIONS = [
  {
    value: "segmented",
    label: "Segmented",
    description: "shadcn, HeroUI, Apple HIG",
  },
  {
    value: "line",
    label: "Line",
    description: "Material 3, Geist, Primer, Carbon, Radix Themes",
  },
  { value: "pill", label: "Pill", description: "Polaris, Linear, Notion" },
]

export const MARKER_OPTIONS = [
  {
    value: "fill",
    label: "Fill",
    description: "shadcn, Material 3, Untitled UI",
  },
  { value: "surface", label: "Surface", description: "Polaris" },
  { value: "bar", label: "Bar", description: "Fluent 2, Catalyst" },
  { value: "fill-bar", label: "Fill + bar", description: "Primer, Carbon" },
  { value: "ink", label: "Ink only", description: "Stripe" },
  { value: "outline", label: "Outline", description: "Duolingo" },
]

export const WEIGHT_OPTIONS = [
  { value: "regular", label: "Regular", description: "Geist, Airbnb" },
  {
    value: "regular-medium",
    label: "Regular → Medium",
    description: "Radix Themes, shadcn sidebar",
  },
  {
    value: "regular-semibold",
    label: "Regular → Semibold",
    description: "Primer, Carbon",
  },
  {
    value: "medium",
    label: "Medium",
    description: "shadcn tabs, Linear, Material 3, Notion, Supabase",
  },
  {
    value: "medium-semibold",
    label: "Medium → Semibold",
    description: "Polaris",
  },
  { value: "semibold", label: "Semibold", description: "Untitled UI, Stripe" },
  { value: "bold", label: "Bold", description: "Duolingo, Spotify" },
]

// Auto: shadcn's sidebar rests a step under its medium tabs.
export const ITEM_WEIGHT_OPTIONS = [
  { value: "auto", label: "Auto", description: "shadcn" },
  ...WEIGHT_OPTIONS,
]

const ITEM_WEIGHT_AUTO: Record<string, string> = {
  ...Object.fromEntries(WEIGHT_OPTIONS.map(({ value }) => [value, value])),
  medium: "regular-medium",
}

export const PILL_OPTIONS = [
  {
    value: "same",
    label: "Same as toggles",
    description: "Polaris, Linear, Notion",
  },
  { value: "tone", label: "Tone", description: "Claude" },
  { value: "solid", label: "Solid", description: "Mantine" },
  { value: "tint", label: "Tint", description: "Fluent 2" },
  // Reached through Same as toggles (Spotify's inverse chips).
  { value: "inverse", label: "Inverse", description: "Spotify" },
]

export const NAVIGATION_SCHEMA: ChapterSchema<typeof NAVIGATION_DEFAULTS> = {
  tabStyle: oneOf(TAB_STYLE_OPTIONS),
  tabsColor: oneOf(SOURCE_OPTIONS),
  navMarker: oneOf(MARKER_OPTIONS),
  navWeight: oneOf(WEIGHT_OPTIONS),
  navItemWeight: oneOf(WEIGHT_OPTIONS),
  tabsPill: oneOf(PILL_OPTIONS.slice(1)),
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
        pill: state.tabsPill,
        weight: state.navWeight,
      },
      sidebar: { marker, weight: state.navItemWeight },
      "segmented-control": { weight: state.navWeight },
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
