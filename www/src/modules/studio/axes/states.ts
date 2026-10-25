/* States — how every control shows keyboard focus, field focus, disabled and
   invalid, the cursor over it, and whether its text selects. Focus writes the
   `--studio-focus-*` vars (roles.css) that base.css's focus-ring and
   focus-input read, which the publisher bakes into plain outlines; the rest
   are the `--invalid-*`, `--disabled-*`, `--cursor-*` and `--user-select-ui`
   tokens. The focus ink is a leaf of Color's Primary, or a color of its own. */

import type { TokenOverrides } from "@/registry/theme"

import { SOURCE_VALUES } from "./color"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { auto, COLOR, oneOf, range } from "./schema"

/** Ring: a gap, then the ring. Inset: inside the edge, a filled control
 *  drawing an on-color line inside it (outside where the control's own part
 *  would cover it: checks, thumbs, tabs, links). Halo: flush, at half
 *  strength. */
export const FOCUS_STYLE_VALUES = ["ring", "inset", "halo"] as const

/** How a field shows focus: Edge recolors it, Thick edge thickens it, Halo
 *  adds a muted halo around it, Ring wears the control ring. Underline
 *  and Indicator draw in their own shape. */
export const FOCUS_INPUT_STYLE_VALUES = [
  "edge",
  "thick-edge",
  "halo",
  "ring",
] as const

/** Edge: the edge turns danger. Halo: a danger halo at rest too. Tint: a
 *  danger wash over the fill too. */
export const INVALID_VALUES = ["edge", "halo", "tint"] as const

/* Light 6% (Airbnb ~5, Polaris ~9), dark 10% (Supabase). */
export const INVALID_FILL =
  "light-dark(color-mix(in oklab, var(--color-danger) 6%, transparent), color-mix(in oklab, var(--color-danger) 10%, transparent))"

/** Solid (shown as Gray): one gray for every control. Fade: the control
 *  at 50%. */
export const DISABLED_VALUES = ["solid", "fade"] as const

/* Keyword values only: a cursor token is written straight into CSS. */
export const CURSOR_CONTROL_VALUES = ["pointer", "default"] as const

export const CURSOR_DISABLED_VALUES = ["not-allowed", "default"] as const

/** Whether text on controls and their labels selects. Content always does. */
export const CONTROL_TEXT_VALUES = ["none", "selectable"] as const

/** Primary's two sources, or the custom color. */
export const FOCUS_COLOR_VALUES = [...SOURCE_VALUES, "custom"] as const

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
    focusCustomColor: "",
    focusStyle: "ring",
    focusWidth: 2,
    focusRingGap: 2,
    focusInputStyle: "halo",
    focusFieldWidth: 2,
    invalidStyle: "edge",
    disabledTreatment: "solid",
    cursorControls: "pointer",
    cursorDisabled: "not-allowed",
    selectionUiText: "none",
  },
  schema: {
    focusColor: oneOf(FOCUS_COLOR_VALUES),
    focusCustomColor: auto(COLOR),
    focusStyle: oneOf(FOCUS_STYLE_VALUES),
    focusWidth: range({ min: 1, max: 4, step: 1 }),
    focusRingGap: range({ min: 0, max: 4, step: 1 }),
    focusInputStyle: oneOf(FOCUS_INPUT_STYLE_VALUES),
    focusFieldWidth: range({ min: 1, max: 4, step: 1 }),
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
    const fieldWidth = state.focusFieldWidth

    // The control ring. Inset draws it inside the edge, where a filled
    // control adds an on-color line so it doesn't sink into the fill.
    if (width !== 2) tokens["--studio-focus-width"] = px(width)
    if (state.focusStyle === "ring" && state.focusRingGap !== 2) {
      tokens["--studio-focus-offset"] = px(state.focusRingGap)
      tokens["--studio-focus-outside-offset"] = px(state.focusRingGap)
    }
    if (state.focusStyle === "halo") {
      tokens["--studio-focus-color"] = mix("var(--color-border-focus)", 50)
      tokens["--studio-focus-offset"] = "0px"
      tokens["--studio-focus-outside-offset"] = "0px"
    }
    if (state.focusStyle === "inset") {
      tokens["--studio-focus-offset"] = px(-width)
      tokens["--studio-focus-inner"] = px(width + 1)
    }
    // Rows and cells keep it inside, where an outside ring would clip.
    if (width !== 2) tokens["--studio-focus-inside-offset"] = px(-width)

    // The field layer around its recolored edge (a 2px halo by default).
    switch (state.focusInputStyle) {
      case "edge":
        tokens["--studio-field-focus-width"] = "0px"
        break
      case "halo":
        if (fieldWidth !== 2)
          tokens["--studio-field-focus-width"] = px(fieldWidth)
        break
      case "thick-edge":
        if (fieldWidth !== 2)
          tokens["--studio-field-focus-width"] = px(fieldWidth)
        tokens["--studio-field-focus-offset"] = px(-fieldWidth)
        tokens["--studio-field-focus-color"] = "var(--color-border-focus)"
        tokens["--studio-field-invalid-color"] = "var(--color-fg-danger)"
        break
      case "ring":
        tokens["--studio-field-focus-width"] = "var(--studio-focus-width)"
        tokens["--studio-field-focus-offset"] = "var(--studio-focus-offset)"
        tokens["--studio-field-focus-color"] = "var(--studio-focus-color)"
        break
    }

    // Invalid: the halo is as wide as the field's own focus halo.
    if (state.invalidStyle === "halo")
      tokens["--invalid-ring-width"] =
        state.focusInputStyle === "halo" ? px(fieldWidth) : px(width)
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

    // A custom ring is that color in both modes; its muted pair, the field
    // halo, is the same color see-through. Unset, it starts on the brand.
    if (state.focusColor === "custom") {
      const color = state.focusCustomColor || state.brand
      tokens["--color-border-focus"] = color
      tokens["--color-border-focus-muted"] = mix(color, 40)
    }

    if (state.focusColor !== "neutral") return { tokens }
    const overrides = state.controlEdge === "strong" ? INK_FOCUS : NEUTRAL_FOCUS
    return { tokens, color: { overrides } }
  },
  rules: [
    // Only a ring stands off its control.
    {
      id: "states/gap-only-ring",
      target: "focusRingGap",
      when: { key: "focusStyle", in: ["inset", "halo"] },
      effect: { kind: "hide" },
      cause: "focusStyle",
    },
    // Edge draws no layer, Ring wears the controls' width, an underline
    // draws its own rule.
    {
      id: "states/field-width-needs-layer",
      target: "focusFieldWidth",
      when: {
        any: [
          { key: "focusInputStyle", in: ["edge", "ring"] },
          { key: "inputStyle", in: ["underline"] },
        ],
      },
      effect: { kind: "hide" },
      cause: "focusInputStyle",
    },
    // An underline shows focus one way: its rule recolors and doubles.
    {
      id: "states/underline-owns-field-focus",
      target: "focusInputStyle",
      when: { key: "inputStyle", in: ["underline"] },
      effect: { kind: "pin", value: "thick-edge" },
      cause: "inputStyle",
    },
    // An indicator's rule doubles under any edge focus.
    {
      id: "states/indicator-rule-is-thick",
      target: "focusInputStyle",
      when: { key: "inputStyle", in: ["indicator"] },
      effect: { kind: "exclude", options: ["thick-edge"], fallback: "edge" },
      cause: "inputStyle",
    },
  ],
})
