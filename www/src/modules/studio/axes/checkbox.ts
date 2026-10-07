/* Checkbox — leader of Selection (checkbox, radio, switch, slider, choice
   cards). Fill is a leaf of Color's Primary: off the selection leaf it
   re-declares the selection tokens under `[data-checkbox]` (a recipe scope),
   so the classes never change. Corner rides on `--studio-checkbox-radius`,
   the unchecked edge of checkbox and radio on `--studio-check-edge`, which
   Strong points at a `--check-edge` token so the export flattens it. */

import { fillScope, SOURCE_VALUES, STRONG_EDGE } from "./color"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const CHECKBOX_DEFAULTS = {
  checkboxColor: "accent",
  checkCorner: "auto",
  checkEdge: "fields",
}

/* Auto is Shape's detail rung (shadcn, Primer, Polaris, Untitled UI). Sharp
   is a fixed 2px whatever the radius (Material 3, Carbon, Fluent 2). */
export const CORNER_VALUES = ["auto", "sharp"] as const

/* Same as fields: Color's control edge (shadcn, Polaris). Strong: Color's
   Strong edge on checks and radios only, fields unchanged (Linear, Primer). */
export const EDGE_VALUES = ["fields", "strong"] as const

export const CHECKBOX_SCHEMA: ChapterSchema<typeof CHECKBOX_DEFAULTS> = {
  checkboxColor: oneOf(SOURCE_VALUES),
  checkCorner: oneOf(CORNER_VALUES),
  checkEdge: oneOf(EDGE_VALUES),
}

export function cornerTokens(corner: string) {
  return corner === "sharp" ? { "--studio-checkbox-radius": "2px" } : undefined
}

export function edgeTokens(edge: string) {
  return edge === "strong"
    ? {
        "--check-edge": STRONG_EDGE,
        "--studio-check-edge": "var(--check-edge)",
      }
    : undefined
}

export function resolveCheckbox(state: Effective): Resolved {
  return {
    tokens: {
      ...cornerTokens(state.checkCorner),
      ...edgeTokens(state.checkEdge),
    },
    color: fillScope(state, "checkbox", state.checkboxColor),
  }
}

export const chapter = defineChapter({
  id: "checkbox",
  defaults: CHECKBOX_DEFAULTS,
  schema: CHECKBOX_SCHEMA,
  resolve: resolveCheckbox,
})
