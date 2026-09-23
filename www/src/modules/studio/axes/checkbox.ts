/* Checkbox — lead of the selection-control family (Checkbox ⇄ Radio ⇄ Switch
   ⇄ Choice cards). Fill is per control, a leaf of Color's Primary: on the
   selection tokens' source it paints with them, off it it forks — Geist runs
   near-black checkboxes beside a blue toggle. Corner is checkbox-only
   geometry.

   Engine: a fork re-declares the selection tokens under `[data-checkbox]`
   (the recipe's `scopes`), so the component's classes never change. Corner
   rides on the `--studio-checkbox-radius` surface var, resolved to a plain
   `rounded-*` utility on export. */

import { fillScope, SOURCE } from "./color"
import type { Resolved, StudioState } from "./index"
import { oneOf } from "./schema"
import type { Schema } from "./schema"

export const CHECKBOX_DEFAULTS = {
  checkboxColor: "neutral",
  checkCorner: "rounded",
}

/* Rounded ≈ shadcn's 4px, Square ≈ Material/Carbon's 2px, Circle ≈ iOS-style
   list checks and Ant's circle checkbox. */
export const CORNER_OPTIONS = [
  { value: "rounded", label: "Rounded" },
  { value: "square", label: "Square" },
  { value: "circle", label: "Circle" },
]

export const CHECKBOX_SCHEMA: Schema<typeof CHECKBOX_DEFAULTS> = {
  checkboxColor: SOURCE,
  checkCorner: oneOf(CORNER_OPTIONS),
}

const CORNER_TOKENS: Record<string, string> = {
  square: "var(--radius-xs)",
  circle: "var(--radius-full)",
}

export function resolveCheckbox(state: StudioState): Resolved {
  const tokens: Record<string, string> = {}
  const corner = CORNER_TOKENS[state.checkCorner]
  if (corner) tokens["--studio-checkbox-radius"] = corner
  return { tokens, color: fillScope(state, "checkbox", state.checkboxColor) }
}
