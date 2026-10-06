/* States — how every control shows keyboard focus, field focus, disabled and
   invalid, the cursor over it, and whether its text selects. Engine: the
   `--focus-*`, `--invalid-ring-width`, `--disabled-*`, `--cursor-*` and
   `--user-select-ui` tokens in base.css that the focus-ring, focus-input,
   invalid-ring, cursor-* and select-ui utilities read. The focus ink is a
   leaf of Color's Primary. */

import type { TokenOverrides } from "@/registry/theme"

import { SOURCE_OPTIONS } from "./color"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf, range } from "./schema"
import type { ChapterSchema } from "./schema"
import { strokePx } from "./shape"

export const STATES_DEFAULTS = {
  focusColor: "accent",
  focusStyle: "ring",
  focusStrength: "auto",
  focusWidth: "auto" as number | "auto",
  focusInputStyle: "halo",
  focusInputWeight: "thin",
  invalidStyle: "edge",
  disabledTreatment: "solid",
  cursorControls: "pointer",
  cursorDisabled: "not-allowed",
  selectionUiText: "none",
}

/** Ring: a gap, then the ring. Halo: flush and translucent. Inset: inside
 *  the edge over a 1px bg line (outside on checks, radios, switches and
 *  links, whose own parts would cover it). */
export const FOCUS_STYLE_OPTIONS = [
  {
    value: "ring",
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
  { value: "halo", label: "Halo", credits: ["shadcn", "Bootstrap", "Stripe"] },
  {
    value: "inset",
    label: "Inset",
    credits: ["Primer", "Carbon", "Fluent 2", "Spotify", "Claude"],
  },
]

export const STRENGTH_OPTIONS = [
  {
    value: "solid",
    label: "Solid",
    credits: ["Spectrum 2", "Primer", "Carbon", "Geist", "Polaris"],
  },
  {
    value: "soft",
    label: "Soft",
    credits: ["shadcn nova", "Supabase", "Radix Themes"],
  },
  { value: "faint", label: "Faint", credits: ["Bootstrap", "Ant", "Stripe"] },
]

const STRENGTH_PCT: Record<string, number> = { soft: 50, faint: 30 }

export const WIDTH_OPTIONS = [
  { value: 1, label: "1px", credits: ["Linear", "Claude"] },
  { value: 2, label: "2px", credits: ["Geist", "Primer", "Polaris", "Radix"] },
  { value: 3, label: "3px", credits: ["shadcn nova", "Material 3"] },
  { value: 4, label: "4px", credits: ["Bootstrap", "Stripe"] },
]

/** How a field shows focus: Ring reuses every ring token; Halo swaps the
 *  edge and adds a muted halo; Border swaps the edge alone. Underline and
 *  Indicator draw each in their own shape. */
export const FOCUS_INPUT_STYLE_OPTIONS = [
  {
    value: "ring",
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
  { value: "halo", label: "Halo", credits: ["Geist", "Ant", "Clerk"] },
  {
    value: "border",
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
]

/** Thin: a 2px halo or the edge recolored. Thick: a 4px halo or a 2px edge. */
export const FOCUS_INPUT_WEIGHT_OPTIONS = [
  {
    value: "thin",
    label: "Thin",
    credits: ["Ant", "Mantine", "Linear", "Claude"],
  },
  {
    value: "thick",
    label: "Thick",
    credits: ["Geist", "Untitled UI", "Material 3", "Radix Themes", "Primer"],
  },
]

const HALO_PX: Record<string, number> = { thin: 2, thick: 4 }
const BORDER_PX: Record<string, number> = { thin: 1, thick: 2 }

/** Edge: the edge turns danger. Halo: a danger halo at rest too. */
export const INVALID_OPTIONS = [
  {
    value: "edge",
    label: "Edge",
    credits: ["Primer", "Material 3", "Carbon", "Atlassian", "Stripe"],
  },
  { value: "halo", label: "Halo", credits: ["shadcn", "Geist"] },
]

/** Solid: one grey for every variant. Fade: the control at 50%. */
export const DISABLED_OPTIONS = [
  {
    value: "solid",
    label: "Solid",
    credits: ["Spectrum 2", "Geist", "Carbon", "Material 3", "Polaris"],
  },
  {
    value: "fade",
    label: "Fade",
    credits: ["shadcn", "Untitled UI", "Supabase", "Linear", "Notion"],
  },
]

/* Keyword values only: a cursor token is written straight into CSS. */
export const CURSOR_CONTROL_OPTIONS = [
  {
    value: "pointer",
    label: "Hand",
    credits: ["Primer", "Polaris", "Carbon", "Geist", "Material 3"],
  },
  {
    value: "default",
    label: "Arrow",
    credits: ["shadcn", "Radix Themes", "Spectrum 2", "Linear"],
  },
]

export const CURSOR_DISABLED_OPTIONS = [
  {
    value: "not-allowed",
    label: "Blocked",
    credits: ["Radix Themes", "Carbon", "Primer", "Untitled UI", "Geist"],
  },
  {
    value: "default",
    label: "Arrow",
    credits: ["shadcn", "Polaris", "Material 3", "Linear", "Notion"],
  },
]

/** Whether text on controls and their labels selects. Content always does. */
export const CONTROL_TEXT_OPTIONS = [
  {
    value: "none",
    label: "Unselectable",
    credits: ["Primer", "Material 3", "Notion", "Spotify"],
  },
  { value: "selectable", label: "Selectable", credits: ["shadcn"] },
]

/** Auto pairs strength and width with the ring recipe (shadcn nova: a 3px
 *  halo at 50%). */
export const AUTO_STRENGTH: Record<string, string> = {
  ring: "solid",
  halo: "soft",
  inset: "solid",
}
export const AUTO_WIDTH: Record<string, number> = { ring: 2, halo: 3, inset: 2 }

export const STATES_SCHEMA: ChapterSchema<typeof STATES_DEFAULTS> = {
  focusColor: oneOf(SOURCE_OPTIONS),
  focusStyle: oneOf(FOCUS_STYLE_OPTIONS),
  focusStrength: oneOf(STRENGTH_OPTIONS),
  focusWidth: range({ min: 1, max: 4, step: 1 }),
  focusInputStyle: oneOf(FOCUS_INPUT_STYLE_OPTIONS),
  focusInputWeight: oneOf(FOCUS_INPUT_WEIGHT_OPTIONS),
  invalidStyle: oneOf(INVALID_OPTIONS),
  disabledTreatment: oneOf(DISABLED_OPTIONS),
  cursorControls: oneOf(CURSOR_CONTROL_OPTIONS),
  cursorDisabled: oneOf(CURSOR_DISABLED_OPTIONS),
  selectionUiText: oneOf(CONTROL_TEXT_OPTIONS),
}

const px = (n: number) => `${n}px`

const mix = (color: string, pct: number) =>
  `color-mix(in oklab, ${color} ${pct}%, transparent)`

/* The neutral ink re-points the focus pair to the neutral ramp at the steps
   the accent pair sits on (solid = 700, ui-active = 300). */
const NEUTRAL_FOCUS: TokenOverrides = {
  "color-border-focus": { palette: "neutral", job: "solid" },
  "color-border-focus-muted": { palette: "neutral", job: "ui-active" },
}

const DISABLED_TOKENS = [
  "--disabled-bg",
  "--disabled-fg",
  "--disabled-border",
  "--disabled-selected-bg",
  "--disabled-selected-fg",
  "--disabled-unselected-bg",
  "--color-primary-disabled",
]

/** Every token, emitted only where it differs from base.css (Origin). */
export function resolveStates(state: Effective): Resolved {
  const tokens: Record<string, string> = {}
  const width = state.focusWidth

  // The control ring.
  if (width !== 2) tokens["--focus-ring-width"] = px(width)
  const pct = STRENGTH_PCT[state.focusStrength]
  if (pct) tokens["--focus-ring-color"] = mix("var(--color-border-focus)", pct)
  if (state.focusStyle === "halo") {
    tokens["--focus-ring-offset"] = "0px"
    tokens["--focus-ring-outside-offset"] = "0px"
  }
  if (state.focusStyle === "inset") {
    tokens["--focus-ring-inset"] = "inset"
    tokens["--focus-ring-offset"] = "0px"
    tokens["--focus-ring-inner"] = "calc(var(--focus-ring-width) + 1px)"
  }

  // The field layer.
  const weight = state.focusInputWeight
  switch (state.focusInputStyle) {
    case "halo":
      if (weight !== "thin")
        tokens["--focus-input-width"] = px(HALO_PX[weight]!)
      break
    case "ring":
      tokens["--focus-input-width"] = "var(--focus-ring-width)"
      tokens["--focus-input-offset"] = "var(--focus-ring-offset)"
      tokens["--focus-input-color"] = "var(--focus-ring-color)"
      if (state.focusStyle === "inset") tokens["--focus-input-inset"] = "inset"
      break
    case "border":
      // The edge recolors; Thick adds what the stroke doesn't draw, inside.
      tokens["--focus-input-width"] = "0px"
      tokens["--focus-input-color"] = "var(--color-border-focus)"
      tokens["--focus-invalid-color"] = "var(--color-border-danger)"
      tokens["--focus-input-edge"] = px(
        Math.max(0, BORDER_PX[weight]! - strokePx(state.controlStroke)),
      )
      break
  }

  // Invalid: the halo is as wide as the field's own focus halo.
  if (state.invalidStyle === "halo")
    tokens["--invalid-ring-width"] =
      state.focusInputStyle === "halo" ? px(HALO_PX[weight]!) : px(width)

  if (state.disabledTreatment === "fade") {
    for (const name of DISABLED_TOKENS) tokens[name] = "initial"
    tokens["--disabled-opacity"] = "0.5"
  }

  if (state.cursorControls !== "pointer")
    tokens["--cursor-interactive"] = state.cursorControls
  if (state.cursorDisabled !== "not-allowed")
    tokens["--cursor-disabled"] = state.cursorDisabled
  if (state.selectionUiText === "selectable")
    tokens["--user-select-ui"] = "auto"

  return state.focusColor === "neutral"
    ? { tokens, color: { overrides: NEUTRAL_FOCUS } }
    : { tokens }
}

export const chapter = defineChapter({
  id: "states",
  defaults: STATES_DEFAULTS,
  schema: STATES_SCHEMA,
  resolve: resolveStates,
  follows: {
    focusStrength: [
      { kind: "auto", id: "auto", from: "focusStyle", table: AUTO_STRENGTH },
    ],
    focusWidth: [
      { kind: "auto", id: "auto", from: "focusStyle", table: AUTO_WIDTH },
    ],
  },
  rules: [
    // A field on the ring reuses the ring's width.
    {
      id: "states/ring-hides-field-weight",
      target: "focusInputWeight",
      when: { key: "focusInputStyle", in: ["ring"] },
      effect: { kind: "hide", value: "thin" },
      cause: "focusInputStyle",
    },
  ],
})
