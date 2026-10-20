import { options } from "./core/meta"
import {
  ARROWS_VALUES,
  HIGHLIGHT_VALUES,
  INDICATOR_VALUES,
  INSET_VALUES,
  PICKER_VALUES,
  ROWS_VALUES,
  SCALE_VALUES,
  SEARCH_VALUES,
  SELECTED_ROW_VALUES,
} from "./menus"

export const HIGHLIGHT_OPTIONS = options(HIGHLIGHT_VALUES, {
  neutral: {
    label: "Neutral",
    description: "Gray wash on the focused row",
    credits: ["shadcn", "Geist", "Linear"],
  },
  accent: {
    label: "Accent",
    description: "Solid accent fill on the focused row",
    credits: ["Radix Themes", "macOS"],
  },
})

export const INSET_OPTIONS = options(INSET_VALUES, {
  inset: {
    label: "Inset",
    description: "Rounded rows set in from the edge",
    credits: ["shadcn", "Geist", "Linear"],
  },
  "full-bleed": {
    label: "Full bleed",
    description: "Square rows that reach the edge",
    credits: ["Material 3", "Carbon", "Airbnb"],
  },
})

export const ARROWS_OPTIONS = options(ARROWS_VALUES, {
  tooltips: {
    label: "Tooltips",
    description: "Only tooltips point at their trigger",
    credits: ["shadcn", "Geist", "Polaris"],
  },
  none: {
    label: "None",
    description: "No arrows on any floating layer",
    credits: ["Linear", "Primer", "Material 3"],
  },
  popovers: {
    label: "Popovers",
    description: "Only popovers point at their trigger",
    credits: ["Spotify"],
  },
  both: {
    label: "Both",
    description: "Tooltips and popovers both point",
    credits: ["Carbon", "Duolingo"],
  },
})

export const INDICATOR_OPTIONS = options(INDICATOR_VALUES, {
  "check-end": {
    label: "End",
    description: "Checkmark after the label",
    credits: ["shadcn", "Geist", "Linear"],
  },
  "check-start": {
    label: "Start",
    description: "Checkmark before the label",
    credits: ["Radix Themes", "Primer"],
  },
  none: {
    label: "None",
    description: "No checkmark, a tinted row marks selection",
    credits: ["Material 3", "Airbnb"],
  },
})

export const SELECTED_ROW_OPTIONS = options(SELECTED_ROW_VALUES, {
  none: {
    label: "None",
    description: "Only the checkmark shows selection",
    credits: ["shadcn", "Radix Themes"],
  },
  tint: {
    label: "Tint",
    description: "Selected rows keep a tinted fill",
    credits: ["Material 3", "Polaris", "Carbon"],
  },
})

export const ROWS_OPTIONS = options(ROWS_VALUES, {
  auto: {
    label: "Auto",
    description: "Row height set by the density",
    credits: ["shadcn", "Notion", "Supabase", "Carbon"],
  },
  match: {
    label: "Match",
    description: "Rows as tall as buttons and fields",
    credits: ["Radix Themes", "Linear", "Geist", "Primer", "Claude"],
  },
  step: {
    label: "Step up",
    description: "Rows one step taller than controls",
    credits: ["Polaris", "Stripe", "Material 3"],
  },
})

export const PICKER_OPTIONS = options(PICKER_VALUES, {
  drawer: {
    label: "Sheet",
    description: "Pickers open as a bottom sheet on phones",
    credits: ["Geist", "Notion", "Stripe"],
  },
  anchored: {
    label: "Anchored",
    description: "Pickers stay by their trigger on phones",
    credits: ["Primer", "Radix Themes"],
  },
})

export const SEARCH_OPTIONS = options(SEARCH_VALUES, {
  field: {
    label: "Field",
    description: "Boxed search field above the list",
    credits: ["shadcn"],
  },
  bar: {
    label: "Bar",
    description: "Borderless search over a divider line",
    credits: ["Supabase", "Geist"],
  },
  prompt: {
    label: "Prompt",
    description: "Bare text prompt over a divider, no icon",
    credits: ["Linear", "Raycast"],
  },
})

export const SCALE_OPTIONS = options(SCALE_VALUES, {
  default: {
    label: "Default",
    description: "Command menu sized like other menus",
    credits: ["shadcn"],
  },
  large: {
    label: "Large",
    description: "Taller search, bigger rows and icons",
    credits: ["Linear", "Raycast"],
  },
})

export const OPTIONS = {
  menuHighlight: HIGHLIGHT_OPTIONS,
  menuInset: INSET_OPTIONS,
  menuArrows: ARROWS_OPTIONS,
  menuIndicator: INDICATOR_OPTIONS,
  menuSelectedRow: SELECTED_ROW_OPTIONS,
  menuRows: ROWS_OPTIONS,
  mobilePickers: PICKER_OPTIONS,
  menuSearch: SEARCH_OPTIONS,
  menuScale: SCALE_OPTIONS,
}
