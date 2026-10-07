import { options } from "./core/meta"
import {
  LABEL_WEIGHT_VALUES,
  SECTION_LABEL_VALUES,
  TITLE_VALUES,
  UI_TEXT_VALUES,
} from "./type"

export const TITLE_OPTIONS = options(TITLE_VALUES, {
  quiet: { label: "Quiet", description: "shadcn" },
  compact: { label: "Compact", description: "Primer, Polaris" },
  tight: { label: "Tight", description: "Geist, Linear" },
  bold: { label: "Bold", description: "Radix Themes, Atlassian" },
  display: { label: "Display", description: "Material 3, Carbon" },
  caps: { label: "Caps", description: "shadcn sera" },
})

export const UI_TEXT_OPTIONS = options(UI_TEXT_VALUES, {
  auto: { label: "Auto" },
  "13": { label: "13px", description: "Linear, Polaris" },
})

export const LABEL_WEIGHT_OPTIONS = options(LABEL_WEIGHT_VALUES, {
  normal: { label: "Normal", description: "Carbon, Ant Design" },
  medium: { label: "Medium", description: "shadcn, Geist, Primer" },
  semibold: { label: "Semibold", description: "Untitled UI, Fluent" },
  bold: { label: "Bold", description: "Duolingo" },
})

export const SECTION_LABEL_OPTIONS = options(SECTION_LABEL_VALUES, {
  sentence: { label: "Sentence" },
  caps: { label: "Caps" },
})

export const OPTIONS = {
  titleStyle: TITLE_OPTIONS,
  uiTextSize: UI_TEXT_OPTIONS,
  labelWeight: LABEL_WEIGHT_OPTIONS,
  sectionLabels: SECTION_LABEL_OPTIONS,
}
