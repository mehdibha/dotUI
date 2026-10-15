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
  segmented: {
    label: "Segmented",
    description: "A sliding chip inside a track",
    credits: ["shadcn", "HeroUI", "Apple HIG"],
  },
  line: {
    label: "Line",
    description: "An underline marks the current tab",
    credits: ["Material 3", "Geist", "Primer", "Carbon", "Radix Themes"],
  },
  pill: {
    label: "Pill",
    description: "A filled pill behind the current tab",
    credits: ["Polaris", "Linear", "Notion"],
  },
})

export const MARKER_OPTIONS = options(MARKER_VALUES, {
  fill: {
    label: "Fill",
    description: "A soft wash behind the current item",
    credits: ["shadcn", "Untitled UI"],
  },
  surface: {
    label: "Surface",
    description: "A page-colored chip on a darker sidebar",
    credits: ["Polaris"],
  },
  bar: {
    label: "Bar",
    description: "A thin bar at the start edge, no fill",
    credits: ["Fluent 2", "Catalyst"],
  },
  "fill-bar": {
    label: "Fill + bar",
    description: "A wash plus a wider bar at the start edge",
    credits: ["Primer", "Carbon"],
  },
  ink: {
    label: "Ink only",
    description: "Only the label and icon change color",
    credits: ["Stripe"],
  },
  outline: {
    label: "Outline",
    description: "A wash inside a thick ring",
    credits: ["Duolingo"],
  },
  pill: {
    label: "Pill",
    description: "A wash on a fully rounded item",
    credits: ["Material 3"],
  },
})

export const INDICATOR_OPTIONS = options(INDICATOR_VALUES, {
  full: {
    label: "Full",
    description: "A thin underline across the whole tab",
    credits: ["Carbon", "Geist", "Primer"],
  },
  label: {
    label: "Label",
    description: "A thicker underline hugging the label",
    credits: ["Material 3"],
  },
})

export const CASE_OPTIONS = [
  {
    value: "same",
    label: "Same as buttons",
    description: "Follows the button case",
    credits: ["Duolingo"],
  },
  ...BUTTON_CASES,
]

export const WEIGHT_OPTIONS = options(WEIGHT_VALUES, {
  regular: {
    label: "Regular",
    description: "Regular weight, selected or not",
    credits: ["Geist", "Airbnb"],
  },
  "regular-medium": {
    label: "Regular → Medium",
    description: "Regular, medium when selected",
    credits: ["Radix Themes", "shadcn sidebar"],
  },
  "regular-semibold": {
    label: "Regular → Semibold",
    description: "Regular, semibold when selected",
    credits: ["Primer", "Carbon"],
  },
  medium: {
    label: "Medium",
    description: "Medium weight, selected or not",
    credits: ["shadcn tabs", "Linear", "Material 3", "Notion", "Supabase"],
  },
  "medium-semibold": {
    label: "Medium → Semibold",
    description: "Medium, semibold when selected",
    credits: ["Polaris"],
  },
  semibold: {
    label: "Semibold",
    description: "Semibold weight, selected or not",
    credits: ["Untitled UI", "Stripe"],
  },
  bold: {
    label: "Bold",
    description: "Bold weight, selected or not",
    credits: ["Duolingo", "Spotify"],
  },
})

export const ITEM_WEIGHT_OPTIONS = [
  {
    value: "auto",
    label: "Auto",
    description: "Follows the tab weight; Medium rests at Regular",
    credits: ["shadcn"],
  },
  ...WEIGHT_OPTIONS,
]

const PILLS = options(PILL_VALUES, {
  tone: {
    label: "Tone",
    description: "A neutral shade behind the current tab",
    credits: ["Claude"],
  },
  solid: {
    label: "Solid",
    description: "Selection-color fill, contrasting text",
    credits: ["Mantine"],
  },
  tint: {
    label: "Tint",
    description: "A light selection-color wash",
    credits: ["Fluent 2"],
  },
  // Only Same as toggles reaches it: Spotify's filter chips, not its tabs.
  inverse: {
    label: "Inverse",
    description: "Full-contrast fill, inverted text",
    credits: ["Spotify chips"],
  },
})

export const PILL_OPTIONS = [
  {
    value: "same",
    label: "Same as toggles",
    description: "Follows the toggle's selected look",
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
