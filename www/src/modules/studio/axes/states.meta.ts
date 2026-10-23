import { SOURCE_OPTIONS } from "./color.meta"
import { options } from "./core/meta"
import {
  CONTROL_TEXT_VALUES,
  CURSOR_CONTROL_VALUES,
  CURSOR_DISABLED_VALUES,
  DISABLED_VALUES,
  FOCUS_INPUT_STYLE_VALUES,
  FOCUS_STYLE_VALUES,
  INVALID_VALUES,
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
      "Notion",
      "Airbnb",
      "Spotify",
    ],
  },
  inset: {
    label: "Inset",
    description: "Ring drawn inside the control's edge",
    credits: ["Primer", "Carbon", "Fluent 2", "Claude"],
  },
  halo: {
    label: "Halo",
    description: "Half-strength ring hugging the edge",
    credits: ["shadcn", "Bootstrap", "Stripe", "Linear"],
  },
})

/** Accent first. */
export const FOCUS_COLOR_OPTIONS = [...SOURCE_OPTIONS].reverse()

export const FOCUS_INPUT_STYLE_OPTIONS = options(FOCUS_INPUT_STYLE_VALUES, {
  edge: {
    label: "Edge",
    description: "Only the edge recolors",
    credits: ["Linear", "Claude", "Duolingo", "ChatGPT"],
  },
  "thick-edge": {
    label: "Thick",
    description: "The edge recolors and thickens to 2px",
    credits: ["Material 3", "Untitled UI", "Primer", "Radix Themes", "Notion"],
  },
  halo: {
    label: "Halo",
    description: "The edge recolors with a soft halo around it",
    credits: ["Geist", "Ant", "Clerk"],
  },
  ring: {
    label: "Ring",
    description: "Fields wear the controls' ring",
    credits: ["shadcn", "Polaris", "Supabase", "Carbon", "Stripe"],
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
  focusInputStyle: FOCUS_INPUT_STYLE_OPTIONS,
  invalidStyle: INVALID_OPTIONS,
  disabledTreatment: DISABLED_OPTIONS,
  cursorControls: CURSOR_CONTROL_OPTIONS,
  cursorDisabled: CURSOR_DISABLED_OPTIONS,
  selectionUiText: CONTROL_TEXT_OPTIONS,
}
