/* Focus — the ring recipe: one color, then the ring controls wear and the
   layer fields wear. Engine: the `--focus-ring-*` / `--focus-input-*` tokens
   in base.css that every `focus-ring` / `focus-input` consumer draws from,
   plus a semantic re-point of `--color-border-focus` for the neutral ink. */

import type { TokenOverrides } from "@/registry/theme"

import type { Resolved, StudioState } from "./index"

/* Defaults mirror base.css: a 2px accent ring over a 2px bg gap; fields wear
   a 2px muted halo. */
export const FOCUS_DEFAULTS = {
  focusColor: "accent",
  focusStyle: "ring",
  focusWidth: 2,
  focusOffset: "gap",
  focusGap: 2,
  focusHaloStrength: 45,
  focusInputStyle: "halo",
  focusInputWidth: 2,
  focusInputStrength: 30,
  focusInputBorderWidth: 1,
}

export const FOCUS_COLOR_OPTIONS = [
  { value: "accent", label: "Accent" },
  { value: "neutral", label: "Neutral" },
]

/** Duo is the two-stroke family (Fluent, GOV.UK): a bg hairline just inside
 *  the edge under a flush ring, so a stroke reads on any fill. */
export const FOCUS_STYLE_OPTIONS = [
  { value: "ring", label: "Ring" },
  { value: "halo", label: "Halo" },
  { value: "duo", label: "Duo" },
]

/** How a field wears the recipe: halo = border swap + muted halo (dotUI,
 *  Geist, Stripe); ring = the control ring exactly (Supabase); border = the
 *  border swap alone, optionally thicker (Material). */
export const FOCUS_INPUT_STYLE_OPTIONS = [
  { value: "halo", label: "Halo" },
  { value: "ring", label: "Ring" },
  { value: "border", label: "Border" },
]

export const FOCUS_OFFSET_OPTIONS = [
  { value: "inset", label: "Inset" },
  { value: "flush", label: "Flush" },
  { value: "gap", label: "Gap" },
]

export const mixFocus = (color: string, pct: number) =>
  `color-mix(in oklab, ${color} ${pct}%, transparent)`

const px = (n: number) => `${n}px`

/* The neutral ink re-points the focus pair to the neutral ramp at the steps
   the accent pair sits on (solid = 700, ui-active = 300). */
const NEUTRAL_FOCUS: TokenOverrides = {
  "color-border-focus": { palette: "neutral", job: "solid" },
  "color-border-focus-muted": { palette: "neutral", job: "ui-active" },
}

export const WIRED = true

export function resolveFocus(state: StudioState): Resolved {
  const tokens: Record<string, string> = {}
  const d = FOCUS_DEFAULTS

  if (state.focusWidth !== d.focusWidth)
    tokens["--focus-ring-width"] = px(state.focusWidth)
  if (state.focusStyle === "halo")
    tokens["--focus-ring-color"] = mixFocus(
      "var(--color-border-focus)",
      state.focusHaloStrength,
    )
  if (state.focusStyle === "duo") {
    tokens["--focus-ring-inner"] = "1px"
    tokens["--focus-ring-offset"] = "0px"
  } else if (state.focusOffset === "inset") {
    tokens["--focus-ring-inset"] = "inset"
    tokens["--focus-ring-offset"] = "0px"
  } else if (state.focusOffset === "flush") {
    tokens["--focus-ring-offset"] = "0px"
  } else if (state.focusGap !== d.focusGap) {
    tokens["--focus-ring-offset"] = px(state.focusGap)
  }

  switch (state.focusInputStyle) {
    case "halo":
      if (state.focusInputWidth !== d.focusInputWidth)
        tokens["--focus-input-width"] = px(state.focusInputWidth)
      if (state.focusInputStrength !== d.focusInputStrength)
        tokens["--focus-input-color"] = mixFocus(
          "var(--color-border-focus)",
          state.focusInputStrength,
        )
      break
    case "ring":
      tokens["--focus-input-width"] = "var(--focus-ring-width)"
      tokens["--focus-input-offset"] = "var(--focus-ring-offset)"
      tokens["--focus-input-inner"] = "var(--focus-ring-inner)"
      tokens["--focus-input-color"] = "var(--focus-ring-color)"
      if (tokens["--focus-ring-inset"]) tokens["--focus-input-inset"] = "inset"
      break
    case "border":
      // The field's own 1px border swaps color; the rest of the width is an
      // inset stroke, so the box never shifts.
      tokens["--focus-input-inset"] = "inset"
      tokens["--focus-input-offset"] = "0px"
      tokens["--focus-input-width"] = px(state.focusInputBorderWidth - 1)
      tokens["--focus-input-color"] = "var(--color-border-focus)"
      break
  }

  return state.focusColor === "neutral"
    ? { tokens, color: { overrides: NEUTRAL_FOCUS } }
    : { tokens }
}
