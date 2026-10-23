/* States — how every control shows keyboard focus, field focus, disabled and
   invalid, the cursor over it, and whether its text selects. Focus writes the
   `--studio-focus-*` vars (roles.css) that base.css's focus-ring and
   focus-input read, which the publisher bakes into plain outlines; the rest
   are the `--invalid-*`, `--disabled-*`, `--cursor-*` and `--user-select-ui`
   tokens. The focus ink is a leaf of Color's Primary. */

import type { TokenOverrides } from "@/registry/theme"

import { DARK_EDGES, SOURCE_VALUES } from "./color"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf, range } from "./schema"

/** Ring: a gap, then the ring. Halo: flush and translucent. Inset: inside
 *  the edge, a filled control drawing an on-color line inside it (outside
 *  where the control's own part would cover it: checks, thumbs, tabs,
 *  links). */
export const FOCUS_STYLE_VALUES = ["ring", "halo", "inset"] as const

export const STRENGTH_VALUES = ["solid", "soft", "faint"] as const

const STRENGTH_PCT: Record<string, number> = { soft: 50, faint: 30 }

/** How a field shows focus: Ring wears the control ring; Halo recolors the
 *  edge and adds a muted halo; Border recolors the edge alone. Underline and
 *  Indicator draw in their own shape. */
export const FOCUS_INPUT_STYLE_VALUES = ["ring", "halo", "border"] as const

/** Thin: a 2px halo or the edge recolored. Thick: a 4px halo or a 2px edge. */
export const FOCUS_INPUT_WEIGHT_VALUES = ["thin", "thick"] as const

const HALO_PX: Record<string, number> = { thin: 2, thick: 4 }

/** Edge: the edge turns danger. Halo: a danger halo at rest too. Tint: a
 *  danger wash over the fill too. */
export const INVALID_VALUES = ["edge", "halo", "tint"] as const

/* Light 6% (Airbnb ~5, Polaris ~9), dark 10% (Supabase). */
export const INVALID_FILL =
  "light-dark(color-mix(in oklab, var(--color-danger) 6%, transparent), color-mix(in oklab, var(--color-danger) 10%, transparent))"

/** Solid: one grey for every variant. Fade: the control at 50%. */
export const DISABLED_VALUES = ["solid", "fade"] as const

/* Keyword values only: a cursor token is written straight into CSS. */
export const CURSOR_CONTROL_VALUES = ["pointer", "default"] as const

export const CURSOR_DISABLED_VALUES = ["not-allowed", "default"] as const

/** Whether text on controls and their labels selects. Content always does. */
export const CONTROL_TEXT_VALUES = ["none", "selectable"] as const

/** Auto pairs strength and width with the ring recipe (shadcn nova: a 3px
 *  halo at 50%). */
export const AUTO_STRENGTH: Record<string, string> = {
  ring: "solid",
  halo: "soft",
  inset: "solid",
}
export const AUTO_WIDTH: Record<string, number> = { ring: 2, halo: 3, inset: 2 }

const px = (n: number) => `${n}px`

const mix = (color: string, pct: number) =>
  `color-mix(in oklab, ${color} ${pct}%, transparent)`

/* The neutral ink re-points the focus pair to the neutral ramp at the steps
   the accent pair sits on (solid = 700, ui-active = 300). On a Strong edge,
   that same 700 step, the ring takes the text ink like the field does. */
const NEUTRAL_FOCUS: TokenOverrides = {
  "color-border-focus": { palette: "neutral", job: "solid" },
  "color-border-focus-muted": { palette: "neutral", job: "ui-active" },
}
const INK_FOCUS: TokenOverrides = {
  ...NEUTRAL_FOCUS,
  "color-border-focus": { palette: "neutral", job: "text" },
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

export const chapter = defineChapter({
  id: "states",
  defaults: {
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
  },
  schema: {
    focusColor: oneOf(SOURCE_VALUES),
    focusStyle: oneOf(FOCUS_STYLE_VALUES),
    focusStrength: oneOf(STRENGTH_VALUES),
    focusWidth: range({ min: 1, max: 4, step: 1 }),
    focusInputStyle: oneOf(FOCUS_INPUT_STYLE_VALUES),
    focusInputWeight: oneOf(FOCUS_INPUT_WEIGHT_VALUES),
    invalidStyle: oneOf(INVALID_VALUES),
    disabledTreatment: oneOf(DISABLED_VALUES),
    cursorControls: oneOf(CURSOR_CONTROL_VALUES),
    cursorDisabled: oneOf(CURSOR_DISABLED_VALUES),
    selectionUiText: oneOf(CONTROL_TEXT_VALUES),
  },
  /** Every token, emitted only where it differs from base.css (Origin). */
  resolve(state: Effective): Resolved {
    const tokens: Record<string, string> = {}
    const width = state.focusWidth

    // The control ring. Inset draws it inside the edge, where a filled
    // control adds an on-color line so it doesn't sink into the fill.
    if (width !== 2) tokens["--studio-focus-width"] = px(width)
    const pct = STRENGTH_PCT[state.focusStrength]
    if (pct)
      tokens["--studio-focus-color"] = mix("var(--color-border-focus)", pct)
    if (state.focusStyle === "halo") {
      tokens["--studio-focus-offset"] = "0px"
      tokens["--studio-focus-outside-offset"] = "0px"
    }
    if (state.focusStyle === "inset") {
      tokens["--studio-focus-offset"] = px(-width)
      tokens["--studio-focus-inner"] = px(width + 1)
    }
    // Rows and cells keep it inside, where an outside ring would clip.
    if (width !== 2) tokens["--studio-focus-inside-offset"] = px(-width)

    // The field layer around its recolored edge.
    const weight = state.focusInputWeight
    switch (state.focusInputStyle) {
      case "halo":
        if (weight !== "thin")
          tokens["--studio-field-focus-width"] = px(HALO_PX[weight]!)
        break
      case "ring":
        tokens["--studio-field-focus-width"] = "var(--studio-focus-width)"
        tokens["--studio-field-focus-offset"] = "var(--studio-focus-offset)"
        tokens["--studio-field-focus-color"] = "var(--studio-focus-color)"
        break
      case "border":
        // Thin recolors the edge alone; Thick draws 2px over it.
        if (weight === "thick") {
          tokens["--studio-field-focus-width"] = "2px"
          tokens["--studio-field-focus-offset"] = "-2px"
          tokens["--studio-field-focus-color"] = "var(--color-border-focus)"
          tokens["--studio-field-invalid-color"] = "var(--color-fg-danger)"
          // An indicator's rule already shows it.
          tokens["--studio-field-indicator-color"] = "transparent"
        } else tokens["--studio-field-focus-width"] = "0px"
        break
    }

    // Invalid: the halo is as wide as the field's own focus halo.
    if (state.invalidStyle === "halo")
      tokens["--invalid-ring-width"] =
        state.focusInputStyle === "halo" ? px(HALO_PX[weight]!) : px(width)
    if (state.invalidStyle === "tint") tokens["--invalid-fill"] = INVALID_FILL

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

    if (state.focusColor !== "neutral") return { tokens }
    const overrides = DARK_EDGES.includes(state.controlEdge)
      ? INK_FOCUS
      : NEUTRAL_FOCUS
    return { tokens, color: { overrides } }
  },
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
