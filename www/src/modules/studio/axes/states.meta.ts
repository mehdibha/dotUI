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
    description: "Solid ring set off by a small gap",
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
      "Spotify",
    ],
  },
  halo: {
    label: "Halo",
    description: "Soft ring hugging the edge, no gap",
    credits: ["shadcn", "Bootstrap", "Stripe"],
  },
  inset: {
    label: "Inset",
    description: "Ring drawn inside the control's edge",
    credits: ["Primer", "Carbon", "Fluent 2", "Claude"],
  },
})

export const STRENGTH_OPTIONS = options(STRENGTH_VALUES, {
  solid: {
    label: "Solid",
    description: "Ring in the full focus color",
    credits: ["Spectrum 2", "Primer", "Carbon", "Geist", "Polaris"],
  },
  soft: {
    label: "Soft",
    description: "Ring at half strength",
    credits: ["shadcn nova", "Supabase", "Radix Themes"],
  },
  faint: {
    label: "Faint",
    description: "Barely-there ring at 30% strength",
    credits: ["Bootstrap", "Ant", "Stripe"],
  },
})

export const WIDTH_OPTIONS = [
  {
    value: 1,
    label: "1px",
    description: "Hairline focus ring",
    credits: ["Linear", "Claude"],
  },
  {
    value: 2,
    label: "2px",
    description: "Thin, crisp focus ring",
    credits: ["Geist", "Primer", "Polaris", "Radix"],
  },
  {
    value: 3,
    label: "3px",
    description: "Medium focus ring",
    credits: ["shadcn nova", "Material 3"],
  },
  {
    value: 4,
    label: "4px",
    description: "Thick, bold focus ring",
    credits: ["Bootstrap", "Stripe"],
  },
]

export const FOCUS_INPUT_STYLE_OPTIONS = options(FOCUS_INPUT_STYLE_VALUES, {
  ring: {
    label: "Ring",
    description: "Fields get the same ring as controls",
    credits: [
      "shadcn",
      "Polaris",
      "Supabase",
      "Carbon",
      "Spectrum 2",
      "Stripe",
    ],
  },
  halo: {
    label: "Halo",
    description: "Edge recolors with a soft halo around it",
    credits: ["Geist", "Ant", "Clerk"],
  },
  border: {
    label: "Border",
    description: "Only the edge recolors, no ring",
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
  thin: {
    label: "Thin",
    description: "2px halo, or the edge recolored",
    credits: ["Ant", "Mantine", "Linear", "Claude"],
  },
  thick: {
    label: "Thick",
    description: "4px halo, or a 2px edge",
    credits: ["Geist", "Untitled UI", "Material 3", "Radix Themes", "Primer"],
  },
})

export const INVALID_OPTIONS = options(INVALID_VALUES, {
  edge: {
    label: "Edge",
    description: "The edge turns the danger color",
    credits: ["Primer", "Material 3", "Carbon", "Atlassian", "Stripe"],
  },
  halo: {
    label: "Halo",
    description: "Danger edge plus a danger halo at rest",
    credits: ["shadcn", "Geist"],
  },
  tint: {
    label: "Tint",
    description: "Danger edge over a faint danger fill",
    credits: ["Polaris", "Supabase (approx.)"],
  },
})

const FIELD_INK_OPTIONS = options(SOURCE_VALUES, {
  neutral: {
    label: "Neutral",
    description: "Focused fields use gray, not the ring color",
    credits: ["Geist"],
  },
  accent: {
    label: "Accent",
    description: "Focused fields use the brand color",
  },
})

/* The row: the follow, then the credited option. */
export const FIELD_INK_ROW = [
  {
    value: "same",
    label: "Same as ring",
    description: "Follows the focus ring's color",
  },
  ...FIELD_INK_OPTIONS.filter((option) => option.value === "neutral"),
]

export const DISABLED_OPTIONS = options(DISABLED_VALUES, {
  solid: {
    label: "Solid",
    description: "One flat gray for every variant",
    credits: ["Spectrum 2", "Geist", "Carbon", "Material 3", "Polaris"],
  },
  fade: {
    label: "Fade",
    description: "The control as is, at half opacity",
    credits: ["shadcn", "Untitled UI", "Supabase", "Linear", "Notion"],
  },
})

export const CURSOR_CONTROL_OPTIONS = options(CURSOR_CONTROL_VALUES, {
  pointer: {
    label: "Hand",
    description: "Pointing hand over clickable controls",
    credits: ["Primer", "Polaris", "Carbon", "Geist", "Material 3"],
  },
  default: {
    label: "Arrow",
    description: "Plain arrow, like a desktop app",
    credits: ["shadcn", "Radix Themes", "Spectrum 2", "Linear"],
  },
})

export const CURSOR_DISABLED_OPTIONS = options(CURSOR_DISABLED_VALUES, {
  "not-allowed": {
    label: "Blocked",
    description: "No-entry sign over disabled controls",
    credits: ["Radix Themes", "Carbon", "Primer", "Untitled UI", "Geist"],
  },
  default: {
    label: "Arrow",
    description: "Plain arrow over disabled controls",
    credits: ["shadcn", "Polaris", "Material 3", "Linear", "Notion"],
  },
})

export const CONTROL_TEXT_OPTIONS = options(CONTROL_TEXT_VALUES, {
  none: {
    label: "Unselectable",
    description: "Control labels can't be highlighted",
    credits: ["Primer", "Material 3", "Notion", "Spotify"],
  },
  selectable: {
    label: "Selectable",
    description: "Control labels highlight like body text",
    credits: ["shadcn"],
  },
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
