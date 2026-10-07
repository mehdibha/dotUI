import { options } from "./core/meta"
import {
  FIELD_TEXT_VALUES,
  LABEL_WEIGHT_VALUES,
  SECTION_LABEL_VALUES,
  TITLE_VALUES,
  UI_TEXT_VALUES,
} from "./type"

export const TITLE_OPTIONS = options(TITLE_VALUES, {
  quiet: { label: "Quiet", credits: ["shadcn"] },
  compact: { label: "Compact", credits: ["Primer", "Polaris"] },
  tight: { label: "Tight", credits: ["Geist", "Linear"] },
  bold: { label: "Bold", credits: ["Radix Themes", "Atlassian"] },
  display: { label: "Display", credits: ["Material 3", "Carbon"] },
  caps: { label: "Caps", credits: ["shadcn sera"] },
})

export const UI_TEXT_OPTIONS = options(UI_TEXT_VALUES, {
  auto: { label: "Auto" },
  "13": { label: "13px", credits: ["Linear", "Polaris"] },
  "14": { label: "14px", credits: ["Notion", "Stripe"] },
})

export const FIELD_TEXT_OPTIONS = options(FIELD_TEXT_VALUES, {
  same: { label: "Same" },
  large: { label: "Large", credits: ["Untitled UI", "Spotify", "Material 3"] },
})

export const LABEL_WEIGHT_OPTIONS = options(LABEL_WEIGHT_VALUES, {
  normal: { label: "Normal", credits: ["Carbon", "Ant Design"] },
  medium: { label: "Medium", credits: ["shadcn", "Geist", "Primer"] },
  semibold: { label: "Semibold", credits: ["Untitled UI", "Fluent"] },
  bold: { label: "Bold", credits: ["Duolingo"] },
})

export const SECTION_LABEL_OPTIONS = options(SECTION_LABEL_VALUES, {
  sentence: { label: "Sentence", credits: ["Spectrum 2", "Atlassian"] },
  caps: { label: "Caps", credits: ["shadcn sera", "Duolingo"] },
  "mono-caps": { label: "Mono caps", credits: ["Supabase"] },
})

export const OPTIONS = {
  titleStyle: TITLE_OPTIONS,
  uiTextSize: UI_TEXT_OPTIONS,
  fieldTextSize: FIELD_TEXT_OPTIONS,
  labelWeight: LABEL_WEIGHT_OPTIONS,
  sectionLabels: SECTION_LABEL_OPTIONS,
}
