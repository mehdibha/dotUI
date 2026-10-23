/* Checkbox — leader of Selection (checkbox, radio, switch, slider, choice
   cards). Fill is a leaf of Color's Primary: off the selection leaf it
   re-declares the selection tokens under `[data-checkbox]` (a recipe scope),
   so the classes never change. Corner rides on `--studio-checkbox-radius`,
   the unchecked edge of checkbox and radio on `--studio-check-edge`, which
   Strong or the floor points at a `--check-edge` token so the export
   flattens it. */

import { fillScope, SOURCE_VALUES, STRONG_EDGE } from "./color"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

/* Auto is Shape's detail rung; Sharp a fixed 2px whatever the radius. */
export const CORNER_VALUES = ["auto", "sharp"] as const

/* Same as fields: Color's control edge. Strong: Color's Strong edge on checks
   and radios only, fields unchanged; an Ink edge is already darker. */
export const EDGE_VALUES = ["fields", "strong"] as const

export function cornerTokens(corner: string) {
  return corner === "sharp" ? { "--studio-checkbox-radius": "2px" } : undefined
}

/** Color's Firm edge: the weakest edge an unchecked mark or a switch track
 *  draws, so Soft fields never leave them invisible. */
export const EDGE_FLOOR = "var(--neutral-400)"

export function edgeTokens(edge: string, controlEdge: string) {
  const value =
    edge === "strong" && controlEdge !== "ink"
      ? STRONG_EDGE
      : controlEdge === "soft"
        ? EDGE_FLOOR
        : undefined
  return value
    ? { "--check-edge": value, "--studio-check-edge": "var(--check-edge)" }
    : undefined
}

export const chapter = defineChapter({
  id: "checkbox",
  defaults: {
    checkboxColor: "accent",
    checkCorner: "auto",
    checkEdge: "fields",
  },
  schema: {
    checkboxColor: oneOf(SOURCE_VALUES),
    checkCorner: oneOf(CORNER_VALUES),
    checkEdge: oneOf(EDGE_VALUES),
  },
  resolve(state: Effective): Resolved {
    return {
      tokens: {
        ...cornerTokens(state.checkCorner),
        ...edgeTokens(state.checkEdge, state.controlEdge),
      },
      color: fillScope(state, "checkbox", state.checkboxColor),
    }
  },
})
