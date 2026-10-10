import { CASE_OPTIONS as BUTTON_CASES } from "./buttons.meta"
import { SOURCE_OPTIONS } from "./color.meta"
import { options } from "./core/meta"
import {
  INDICATOR_VALUES,
  MARKER_VALUES,
  PILL_VALUES,
  TAB_STYLE_VALUES,
  WEIGHT_VALUES,
} from "./navigation"

export const TAB_STYLE_OPTIONS = options(TAB_STYLE_VALUES, {
  segmented: { label: "Segmented", credits: ["shadcn", "HeroUI", "Apple HIG"] },
  line: {
    label: "Line",
    credits: ["Material 3", "Geist", "Primer", "Carbon", "Radix Themes"],
  },
  pill: { label: "Pill", credits: ["Polaris", "Linear", "Notion"] },
})

export const MARKER_OPTIONS = options(MARKER_VALUES, {
  fill: { label: "Fill", credits: ["shadcn", "Untitled UI"] },
  surface: { label: "Surface", credits: ["Polaris"] },
  bar: { label: "Bar", credits: ["Fluent 2", "Catalyst"] },
  "fill-bar": { label: "Fill + bar", credits: ["Primer", "Carbon"] },
  ink: { label: "Ink only", credits: ["Stripe"] },
  outline: { label: "Outline", credits: ["Duolingo"] },
  pill: { label: "Pill", credits: ["Material 3"] },
})

export const INDICATOR_OPTIONS = options(INDICATOR_VALUES, {
  full: { label: "Full", credits: ["Carbon", "Geist", "Primer"] },
  label: { label: "Label", credits: ["Material 3"] },
})

export const CASE_OPTIONS = [
  { value: "same", label: "Same as buttons", credits: ["Duolingo"] },
  ...BUTTON_CASES,
]

export const WEIGHT_OPTIONS = options(WEIGHT_VALUES, {
  regular: { label: "Regular", credits: ["Geist", "Airbnb"] },
  "regular-medium": {
    label: "Regular → Medium",
    credits: ["Radix Themes", "shadcn sidebar"],
  },
  "regular-semibold": {
    label: "Regular → Semibold",
    credits: ["Primer", "Carbon"],
  },
  medium: {
    label: "Medium",
    credits: ["shadcn tabs", "Linear", "Material 3", "Notion", "Supabase"],
  },
  "medium-semibold": { label: "Medium → Semibold", credits: ["Polaris"] },
  semibold: { label: "Semibold", credits: ["Untitled UI", "Stripe"] },
  bold: { label: "Bold", credits: ["Duolingo", "Spotify"] },
})

export const ITEM_WEIGHT_OPTIONS = [
  { value: "auto", label: "Auto", credits: ["shadcn"] },
  ...WEIGHT_OPTIONS,
]

const PILLS = options(PILL_VALUES, {
  tone: { label: "Tone", credits: ["Claude"] },
  solid: { label: "Solid", credits: ["Mantine"] },
  tint: { label: "Tint", credits: ["Fluent 2"] },
  // Only Same as toggles reaches it: Spotify's filter chips, not its tabs.
  inverse: { label: "Inverse", credits: ["Spotify chips"] },
})

export const PILL_OPTIONS = [
  {
    value: "same",
    label: "Same as toggles",
    credits: ["Polaris", "Linear", "Notion"],
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
  tabIndicator: INDICATOR_OPTIONS,
  navCase: BUTTON_CASES,
}
