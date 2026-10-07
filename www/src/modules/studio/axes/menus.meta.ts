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
  neutral: { label: "Neutral", description: "shadcn, Geist, Linear" },
  accent: { label: "Accent", description: "Radix Themes, macOS" },
})

export const INSET_OPTIONS = options(INSET_VALUES, {
  inset: { label: "Inset", description: "shadcn, Geist, Linear" },
  "full-bleed": {
    label: "Full bleed",
    description: "Material 3, Carbon, Airbnb",
  },
})

export const ARROWS_OPTIONS = options(ARROWS_VALUES, {
  tooltips: { label: "Tooltips", description: "shadcn, Geist, Polaris" },
  none: { label: "None", description: "Linear, Primer, Material 3" },
  popovers: { label: "Popovers", description: "Spotify" },
  both: { label: "Both", description: "Carbon, Duolingo" },
})

export const INDICATOR_OPTIONS = options(INDICATOR_VALUES, {
  "check-end": { label: "End", description: "shadcn, Geist, Linear" },
  "check-start": { label: "Start", description: "Radix Themes, Primer" },
  none: { label: "None", description: "Material 3, Airbnb" },
})

export const SELECTED_ROW_OPTIONS = options(SELECTED_ROW_VALUES, {
  none: { label: "None", description: "shadcn, Radix Themes" },
  tint: { label: "Tint", description: "Material 3, Polaris, Carbon" },
})

export const ROWS_OPTIONS = options(ROWS_VALUES, {
  auto: { label: "Auto", description: "shadcn, Notion, Supabase, Carbon" },
  match: {
    label: "Match",
    description: "Radix Themes, Linear, Geist, Primer, Claude",
  },
  step: {
    label: "Step up",
    description: "Polaris, Stripe, Material 3 (approx.)",
  },
})

export const PICKER_OPTIONS = options(PICKER_VALUES, {
  drawer: { label: "Drawer", description: "Geist, Notion, Stripe" },
  anchored: { label: "Anchored", description: "Primer, Radix Themes" },
})

export const SEARCH_OPTIONS = options(SEARCH_VALUES, {
  field: { label: "Field", description: "shadcn" },
  bar: { label: "Bar", description: "Supabase, Geist" },
  prompt: { label: "Prompt", description: "Linear, Raycast" },
})

export const SCALE_OPTIONS = options(SCALE_VALUES, {
  default: { label: "Default", description: "shadcn" },
  large: { label: "Large", description: "Linear, Raycast" },
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
