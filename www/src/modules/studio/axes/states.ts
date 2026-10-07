/* States — how every control shows keyboard focus, field focus, disabled and
   invalid, the cursor over it, and whether its text selects. Engine: the
   `--focus-*`, `--invalid-*`, `--disabled-*`, `--cursor-*` and
   `--user-select-ui` tokens in base.css that the focus-ring, focus-input,
   invalid-ring, invalid-fill, cursor-* and select-ui utilities read. The focus ink is a
   leaf of Color's Primary. */

import type { TokenOverrides } from "@/registry/theme"

import { SOURCE_VALUES } from "./color"
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
  focusInputColor: "same" as "same" | "neutral" | "accent",
  invalidStyle: "edge",
  disabledTreatment: "solid",
  cursorControls: "pointer",
  cursorDisabled: "not-allowed",
  selectionUiText: "none",
}

/** Ring: a gap, then the ring. Halo: flush and translucent. Inset: inside
 *  the edge over a 1px bg line (outside where the control's own part would
 *  cover it: checks, thumbs, tabs, links). */
export const FOCUS_STYLE_VALUES = ["ring", "halo", "inset"] as const

export const STRENGTH_VALUES = ["solid", "soft", "faint"] as const

const STRENGTH_PCT: Record<string, number> = { soft: 50, faint: 30 }

/** How a field shows focus: Ring reuses every ring token; Halo swaps the
 *  edge and adds a muted halo; Border swaps the edge alone. Underline and
 *  Indicator draw each in their own shape. */
export const FOCUS_INPUT_STYLE_VALUES = ["ring", "halo", "border"] as const

/** Thin: a 2px halo or the edge recolored. Thick: a 4px halo or a 2px edge. */
export const FOCUS_INPUT_WEIGHT_VALUES = ["thin", "thick"] as const

const HALO_PX: Record<string, number> = { thin: 2, thick: 4 }
const BORDER_PX: Record<string, number> = { thin: 1, thick: 2 }

/** Edge: the edge turns danger. Halo: a danger halo at rest too. Tint: a
 *  danger wash over the fill too. */
export const INVALID_VALUES = ["edge", "halo", "tint"] as const

/* Light 6% (Airbnb ~5, Polaris ~9), dark 10% (Supabase). */
export const INVALID_FILL =
  "light-dark(color-mix(in oklab, var(--color-danger) 6%, transparent), color-mix(in oklab, var(--color-danger) 10%, transparent))"

/* Neutral field ink (Geist): the neutral ring pair's steps. On a Strong edge,
   which is that same 700 step, focus takes the text ink (Airbnb #222,
   Spotify black / white). */
export const NEUTRAL_FIELD_INK = {
  edge: "var(--neutral-700)",
  halo: "var(--neutral-300)",
  strong: "var(--neutral-950)",
}

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

export const STATES_SCHEMA: ChapterSchema<typeof STATES_DEFAULTS> = {
  focusColor: oneOf(SOURCE_VALUES),
  focusStyle: oneOf(FOCUS_STYLE_VALUES),
  focusStrength: oneOf(STRENGTH_VALUES),
  focusWidth: range({ min: 1, max: 4, step: 1 }),
  focusInputStyle: oneOf(FOCUS_INPUT_STYLE_VALUES),
  focusInputWeight: oneOf(FOCUS_INPUT_WEIGHT_VALUES),
  focusInputColor: oneOf(SOURCE_VALUES),
  invalidStyle: oneOf(INVALID_VALUES),
  disabledTreatment: oneOf(DISABLED_VALUES),
  cursorControls: oneOf(CURSOR_CONTROL_VALUES),
  cursorDisabled: oneOf(CURSOR_DISABLED_VALUES),
  selectionUiText: oneOf(CONTROL_TEXT_VALUES),
}

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
      tokens["--focus-input-color"] = "var(--focus-input-border)"
      tokens["--focus-invalid-color"] = "var(--color-fg-danger)"
      tokens["--focus-input-edge"] = px(
        Math.max(0, BORDER_PX[weight]! - strokePx(state.controlStroke)),
      )
      break
  }

  // A neutral field ink under an accent ring (Geist), on the steps the
  // neutral ring pair uses.
  if (state.focusInputColor === "neutral" && state.focusColor !== "neutral") {
    tokens["--focus-input-border"] = NEUTRAL_FIELD_INK.edge
    if (state.focusInputStyle === "halo")
      tokens["--focus-input-color"] = NEUTRAL_FIELD_INK.halo
  }
  if (state.focusInputColor === "neutral" && state.controlEdge === "strong")
    tokens["--focus-input-border"] = NEUTRAL_FIELD_INK.strong

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
  const overrides = state.controlEdge === "strong" ? INK_FOCUS : NEUTRAL_FOCUS
  return { tokens, color: { overrides } }
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
    focusInputColor: [{ kind: "same", id: "same", from: "focusColor" }],
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
    // ...and its ink.
    {
      id: "states/ring-hides-field-ink",
      target: "focusInputColor",
      when: {
        all: [
          { key: "focusInputStyle", in: ["ring"] },
          { key: "focusColor", notIn: ["neutral"] },
        ],
      },
      effect: { kind: "hide" },
      cause: "focusInputStyle",
    },
    // A neutral ring already paints fields neutral.
    {
      id: "states/neutral-ring-hides-field-ink",
      target: "focusInputColor",
      when: { key: "focusColor", in: ["neutral"] },
      effect: { kind: "hide" },
      cause: "focusColor",
    },
  ],
})
