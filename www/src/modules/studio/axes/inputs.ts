/* Inputs — the field shell every text field, picker trigger and OTP cell
   wears, its pointer state and its height. */

import { STRONG_EDGE } from "./color"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

/* Each shell is one system's field, copied whole (input/styles.ts). */
export const STYLE_VALUES = [
  "outline",
  "raised",
  "inset",
  "well",
  "filled",
  "indicator",
  "underline",
] as const

export const HOVER_VALUES = ["none", "edge", "tint", "edge-tint"] as const

/** As style (the follow): each shell's own hover, from the system it is
 *  copied from. */
export const STYLE_HOVER: Record<string, string> = {
  outline: "none", // shadcn
  raised: "none", // Untitled UI
  inset: "none", // Primer
  well: "edge", // Supabase
  filled: "tint", // Ant filled
  indicator: "tint", // Material 3 state layer (Carbon draws none)
  underline: "edge", // Fluent
}

export const HEIGHT_VALUES = ["controls", "step", "tall"] as const

/* The indicator's rule is the field's only edge: on a Soft or Firm control
   edge it takes Color's Strong edge (Material 3 on-surface-variant, Carbon
   border-strong), which clears 3:1 on the well. */
function indicatorTokens(inputStyle: string, controlEdge: string) {
  return inputStyle === "indicator" && controlEdge !== "strong"
    ? {
        "--indicator-edge": STRONG_EDGE,
        "--studio-indicator-edge": "var(--indicator-edge)",
      }
    : undefined
}

export const chapter = defineChapter({
  id: "inputs",
  defaults: {
    inputStyle: "outline",
    inputHover: "auto",
    inputHeight: "controls",
  },
  schema: {
    inputStyle: oneOf(STYLE_VALUES),
    inputHover: oneOf(HOVER_VALUES),
    inputHeight: oneOf(HEIGHT_VALUES),
  },
  resolve(state: Effective): Resolved {
    return {
      tokens: indicatorTokens(state.inputStyle, state.controlEdge),
      params: {
        input: {
          style: state.inputStyle,
          hover: state.inputHover,
          height: state.inputHeight,
        },
      },
    }
  },
  follows: {
    inputHover: [
      { kind: "auto", id: "auto", from: "inputStyle", table: STYLE_HOVER },
    ],
  },
})
