import { SOURCE_OPTIONS } from "./color.meta"
import { options } from "./core/meta"
import {
  MARKER_VALUES,
  PILL_VALUES,
  TAB_STYLE_VALUES,
  WEIGHT_VALUES,
} from "./navigation"

export const TAB_STYLE_OPTIONS = options(TAB_STYLE_VALUES, {
  segmented: { label: "Segmented", description: "shadcn, HeroUI, Apple HIG" },
  line: {
    label: "Line",
    description: "Material 3, Geist, Primer, Carbon, Radix Themes",
  },
  pill: { label: "Pill", description: "Polaris, Linear, Notion" },
})

export const MARKER_OPTIONS = options(MARKER_VALUES, {
  fill: { label: "Fill", description: "shadcn, Material 3, Untitled UI" },
  surface: { label: "Surface", description: "Polaris" },
  bar: { label: "Bar", description: "Fluent 2, Catalyst" },
  "fill-bar": { label: "Fill + bar", description: "Primer, Carbon" },
  ink: { label: "Ink only", description: "Stripe" },
  outline: { label: "Outline", description: "Duolingo" },
})

export const WEIGHT_OPTIONS = options(WEIGHT_VALUES, {
  regular: { label: "Regular", description: "Geist, Airbnb" },
  "regular-medium": {
    label: "Regular → Medium",
    description: "Radix Themes, shadcn sidebar",
  },
  "regular-semibold": {
    label: "Regular → Semibold",
    description: "Primer, Carbon",
  },
  medium: {
    label: "Medium",
    description: "shadcn tabs, Linear, Material 3, Notion, Supabase",
  },
  "medium-semibold": { label: "Medium → Semibold", description: "Polaris" },
  semibold: { label: "Semibold", description: "Untitled UI, Stripe" },
  bold: { label: "Bold", description: "Duolingo, Spotify" },
})

export const ITEM_WEIGHT_OPTIONS = [
  { value: "auto", label: "Auto", description: "shadcn" },
  ...WEIGHT_OPTIONS,
]

const PILLS = options(PILL_VALUES, {
  tone: { label: "Tone", description: "Claude" },
  solid: { label: "Solid", description: "Mantine" },
  tint: { label: "Tint", description: "Fluent 2" },
  // Only Same as toggles reaches it: Spotify's filter chips, not its tabs.
  inverse: { label: "Inverse", description: "Spotify chips" },
})

export const PILL_OPTIONS = [
  {
    value: "same",
    label: "Same as toggles",
    description: "Polaris, Linear, Notion",
  },
  ...PILLS,
]

export const OPTIONS = {
  tabStyle: TAB_STYLE_OPTIONS,
  tabsColor: SOURCE_OPTIONS,
  navMarker: MARKER_OPTIONS,
  navWeight: WEIGHT_OPTIONS,
  navItemWeight: WEIGHT_OPTIONS,
  tabsPill: PILLS,
}
