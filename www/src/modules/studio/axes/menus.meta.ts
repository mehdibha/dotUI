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
  neutral: { label: "Neutral", credits: ["shadcn", "Geist", "Linear"] },
  accent: { label: "Accent", credits: ["Radix Themes", "macOS"] },
})

export const INSET_OPTIONS = options(INSET_VALUES, {
  inset: { label: "Inset", credits: ["shadcn", "Geist", "Linear"] },
  "full-bleed": {
    label: "Full bleed",
    credits: ["Material 3", "Carbon", "Airbnb"],
  },
})

export const ARROWS_OPTIONS = options(ARROWS_VALUES, {
  tooltips: { label: "Tooltips", credits: ["shadcn", "Geist", "Polaris"] },
  none: { label: "None", credits: ["Linear", "Primer", "Material 3"] },
  popovers: { label: "Popovers", credits: ["Spotify"] },
  both: { label: "Both", credits: ["Carbon", "Duolingo"] },
})

export const INDICATOR_OPTIONS = options(INDICATOR_VALUES, {
  "check-end": { label: "End", credits: ["shadcn", "Geist", "Linear"] },
  "check-start": { label: "Start", credits: ["Radix Themes", "Primer"] },
  none: { label: "None", credits: ["Material 3", "Airbnb"] },
})

export const SELECTED_ROW_OPTIONS = options(SELECTED_ROW_VALUES, {
  none: { label: "None", credits: ["shadcn", "Radix Themes"] },
  tint: { label: "Tint", credits: ["Material 3", "Polaris", "Carbon"] },
})

export const ROWS_OPTIONS = options(ROWS_VALUES, {
  auto: { label: "Auto", credits: ["shadcn", "Notion", "Supabase", "Carbon"] },
  match: {
    label: "Match",
    credits: ["Radix Themes", "Linear", "Geist", "Primer", "Claude"],
  },
  step: {
    label: "Step up",
    credits: ["Polaris", "Stripe", "Material 3"],
  },
})

export const PICKER_OPTIONS = options(PICKER_VALUES, {
  drawer: { label: "Drawer", credits: ["Geist", "Notion", "Stripe"] },
  anchored: { label: "Anchored", credits: ["Primer", "Radix Themes"] },
})

export const SEARCH_OPTIONS = options(SEARCH_VALUES, {
  field: { label: "Field", credits: ["shadcn"] },
  bar: { label: "Bar", credits: ["Supabase", "Geist"] },
  prompt: { label: "Prompt", credits: ["Linear", "Raycast"] },
})

export const SCALE_OPTIONS = options(SCALE_VALUES, {
  default: { label: "Default", credits: ["shadcn"] },
  large: { label: "Large", credits: ["Linear", "Raycast"] },
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
