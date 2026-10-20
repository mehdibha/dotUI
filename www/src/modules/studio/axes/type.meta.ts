import { options } from "./core/meta"
import {
  FIELD_TEXT_VALUES,
  LABEL_WEIGHT_VALUES,
  SECTION_LABEL_VALUES,
  TITLE_VALUES,
  UI_TEXT_VALUES,
} from "./type"

export const TITLE_OPTIONS = options(TITLE_VALUES, {
  quiet: {
    label: "Quiet",
    description: "Modest size, medium weight",
    credits: ["shadcn"],
  },
  compact: {
    label: "Compact",
    description: "Small and semibold",
    credits: ["Primer", "Polaris"],
  },
  tight: {
    label: "Tight",
    description: "Semibold with tightened letter spacing",
    credits: ["Geist", "Linear"],
  },
  bold: {
    label: "Bold",
    description: "Larger and bold",
    credits: ["Radix Themes", "Atlassian"],
  },
  display: {
    label: "Display",
    description: "Large and light, regular weight",
    credits: ["Material 3", "Carbon"],
  },
  caps: {
    label: "Caps",
    description: "Uppercase, semibold, widely spaced",
    credits: ["shadcn sera"],
  },
})

export const UI_TEXT_OPTIONS = options(UI_TEXT_VALUES, {
  auto: { label: "Auto", description: "Follows the density's text size" },
  "13": {
    label: "13px",
    description: "Smaller control text at every density",
    credits: ["Linear", "Polaris"],
  },
  "14": {
    label: "14px",
    description: "Standard control text at every density",
    credits: ["Notion", "Stripe"],
  },
})

export const FIELD_TEXT_OPTIONS = options(FIELD_TEXT_VALUES, {
  same: { label: "Same", description: "Field values match control text" },
  large: {
    label: "Large",
    description: "Field values one size up",
    credits: ["Untitled UI", "Spotify", "Material 3"],
  },
})

export const LABEL_WEIGHT_OPTIONS = options(LABEL_WEIGHT_VALUES, {
  normal: {
    label: "Normal",
    description: "Button labels at body weight",
    credits: ["Carbon", "Ant Design"],
  },
  medium: {
    label: "Medium",
    description: "A touch heavier than body text",
    credits: ["shadcn", "Geist", "Primer"],
  },
  semibold: {
    label: "Semibold",
    description: "Firm, clearly emphasized labels",
    credits: ["Untitled UI", "Fluent"],
  },
  bold: {
    label: "Bold",
    description: "Heavy, punchy button labels",
    credits: ["Duolingo"],
  },
})

export const SECTION_LABEL_OPTIONS = options(SECTION_LABEL_VALUES, {
  sentence: {
    label: "Sentence",
    description: "Small text in normal case",
    credits: ["Spectrum 2", "Atlassian"],
  },
  caps: {
    label: "Caps",
    description: "Tiny uppercase, widely spaced",
    credits: ["shadcn sera", "Duolingo"],
  },
  "mono-caps": {
    label: "Mono caps",
    description: "Uppercase in the monospace font",
    credits: ["Supabase"],
  },
})

export const OPTIONS = {
  titleStyle: TITLE_OPTIONS,
  uiTextSize: UI_TEXT_OPTIONS,
  fieldTextSize: FIELD_TEXT_OPTIONS,
  labelWeight: LABEL_WEIGHT_OPTIONS,
  sectionLabels: SECTION_LABEL_OPTIONS,
}
