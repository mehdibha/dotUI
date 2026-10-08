import { SOURCE_VALUES } from "./color"
import { SOURCE_OPTIONS } from "./color.meta"
import { options } from "./core/meta"
import {
  CONTROL_TEXT_VALUES,
  CURSOR_CONTROL_VALUES,
  CURSOR_DISABLED_VALUES,
  DISABLED_VALUES,
  FOCUS_INPUT_STYLE_VALUES,
  FOCUS_INPUT_WEIGHT_VALUES,
  FOCUS_STYLE_VALUES,
  INVALID_VALUES,
  STRENGTH_VALUES,
} from "./states"

export const FOCUS_STYLE_OPTIONS = options(FOCUS_STYLE_VALUES, {
  ring: {
    label: "Ring",
    credits: [
      "Spectrum 2",
      "Geist",
      "Material 3",
      "Polaris",
      "Untitled UI",
      "Supabase",
      "Linear",
      "Notion",
      "Airbnb",
    ],
  },
  halo: { label: "Halo", credits: ["shadcn", "Bootstrap", "Stripe"] },
  inset: {
    label: "Inset",
    credits: ["Primer", "Carbon", "Fluent 2", "Spotify", "Claude"],
  },
})

export const STRENGTH_OPTIONS = options(STRENGTH_VALUES, {
  solid: {
    label: "Solid",
    credits: ["Spectrum 2", "Primer", "Carbon", "Geist", "Polaris"],
  },
  soft: { label: "Soft", credits: ["shadcn nova", "Supabase", "Radix Themes"] },
  faint: { label: "Faint", credits: ["Bootstrap", "Ant", "Stripe"] },
})

export const WIDTH_OPTIONS = [
  { value: 1, label: "1px", credits: ["Linear", "Claude"] },
  { value: 2, label: "2px", credits: ["Geist", "Primer", "Polaris", "Radix"] },
  { value: 3, label: "3px", credits: ["shadcn nova", "Material 3"] },
  { value: 4, label: "4px", credits: ["Bootstrap", "Stripe"] },
]

export const FOCUS_INPUT_STYLE_OPTIONS = options(FOCUS_INPUT_STYLE_VALUES, {
  ring: {
    label: "Ring",
    credits: [
      "shadcn",
      "Polaris",
      "Supabase",
      "Carbon",
      "Spectrum 2",
      "Stripe",
    ],
  },
  halo: { label: "Halo", credits: ["Geist", "Ant", "Clerk"] },
  border: {
    label: "Border",
    credits: [
      "Material 3",
      "Untitled UI",
      "Primer",
      "Radix Themes",
      "Duolingo",
      "Linear",
      "Notion",
      "Airbnb",
    ],
  },
})

export const FOCUS_INPUT_WEIGHT_OPTIONS = options(FOCUS_INPUT_WEIGHT_VALUES, {
  thin: { label: "Thin", credits: ["Ant", "Mantine", "Linear", "Claude"] },
  thick: {
    label: "Thick",
    credits: ["Geist", "Untitled UI", "Material 3", "Radix Themes", "Primer"],
  },
})

export const INVALID_OPTIONS = options(INVALID_VALUES, {
  edge: {
    label: "Edge",
    credits: ["Primer", "Material 3", "Carbon", "Atlassian", "Stripe"],
  },
  halo: { label: "Halo", credits: ["shadcn", "Geist"] },
  tint: { label: "Tint", credits: ["Polaris", "Supabase (approx.)"] },
})

const FIELD_INK_OPTIONS = options(SOURCE_VALUES, {
  neutral: { label: "Neutral", credits: ["Geist"] },
  accent: { label: "Accent" },
})

/* The row: the follow, then the credited option. */
export const FIELD_INK_ROW = [
  { value: "same", label: "Same as ring" },
  ...FIELD_INK_OPTIONS.filter((option) => option.value === "neutral"),
]

export const DISABLED_OPTIONS = options(DISABLED_VALUES, {
  solid: {
    label: "Solid",
    credits: ["Spectrum 2", "Geist", "Carbon", "Material 3", "Polaris"],
  },
  fade: {
    label: "Fade",
    credits: ["shadcn", "Untitled UI", "Supabase", "Linear", "Notion"],
  },
})

export const CURSOR_CONTROL_OPTIONS = options(CURSOR_CONTROL_VALUES, {
  pointer: {
    label: "Hand",
    credits: ["Primer", "Polaris", "Carbon", "Geist", "Material 3"],
  },
  default: {
    label: "Arrow",
    credits: ["shadcn", "Radix Themes", "Spectrum 2", "Linear"],
  },
})

export const CURSOR_DISABLED_OPTIONS = options(CURSOR_DISABLED_VALUES, {
  "not-allowed": {
    label: "Blocked",
    credits: ["Radix Themes", "Carbon", "Primer", "Untitled UI", "Geist"],
  },
  default: {
    label: "Arrow",
    credits: ["shadcn", "Polaris", "Material 3", "Linear", "Notion"],
  },
})

export const CONTROL_TEXT_OPTIONS = options(CONTROL_TEXT_VALUES, {
  none: {
    label: "Unselectable",
    credits: ["Primer", "Material 3", "Notion", "Spotify"],
  },
  selectable: { label: "Selectable", credits: ["shadcn"] },
})

export const OPTIONS = {
  focusColor: SOURCE_OPTIONS,
  focusStyle: FOCUS_STYLE_OPTIONS,
  focusStrength: STRENGTH_OPTIONS,
  focusInputStyle: FOCUS_INPUT_STYLE_OPTIONS,
  focusInputWeight: FOCUS_INPUT_WEIGHT_OPTIONS,
  focusInputColor: FIELD_INK_OPTIONS,
  invalidStyle: INVALID_OPTIONS,
  disabledTreatment: DISABLED_OPTIONS,
  cursorControls: CURSOR_CONTROL_OPTIONS,
  cursorDisabled: CURSOR_DISABLED_OPTIONS,
  selectionUiText: CONTROL_TEXT_OPTIONS,
}
