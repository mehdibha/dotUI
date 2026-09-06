/* Checkbox — lead of the selection-control family (Checkbox ⇄ Radio ⇄ Switch
   ⇄ Choice cards): Fill is the family's synced axis and resolves once, here;
   Corner is checkbox-only geometry.

   Engine: checked controls paint with the semantic selection tokens. The
   color engine points those at the primary fill — near-black in dotUI's
   default (the shadcn school), so Neutral is the no-op default and Accent
   re-points them at the accent tokens (the Vercel split: black primary,
   brand-colored checks). Corner rides on the `--checkbox-radius` surface
   var, resolved to a plain `rounded-*` utility on export. */

import type { Resolved, StudioState } from "./index"

export const CHECKBOX_DEFAULTS = {
  checkFill: "neutral",
  checkCorner: "rounded",
}

/* Accent is the brand-colored school (Material, Ant, Radix Themes); Neutral
   the shadcn school — a near-black fill that inverts per mode. */
export const FILL_OPTIONS = [
  { value: "accent", label: "Accent" },
  { value: "neutral", label: "Neutral" },
]

/* Rounded ≈ shadcn's 4px, Square ≈ Material/Carbon's 2px, Circle ≈ iOS-style
   list checks and Ant's circle checkbox. */
export const CORNER_OPTIONS = [
  { value: "rounded", label: "Rounded" },
  { value: "square", label: "Square" },
  { value: "circle", label: "Circle" },
]

const CORNER_TOKENS: Record<string, string> = {
  square: "var(--radius-xs)",
  circle: "var(--radius-full)",
}

export const WIRED = true

export function resolveCheckbox(state: StudioState): Resolved {
  const tokens: Record<string, string> = {}
  if (state.checkFill === "accent") {
    tokens["--color-selection"] = "var(--color-accent)"
    tokens["--color-selection-hover"] = "var(--color-accent-hover)"
    tokens["--color-selection-muted"] = "var(--color-accent-muted)"
    tokens["--color-fg-on-selection"] = "var(--color-fg-on-accent)"
  }
  const corner = CORNER_TOKENS[state.checkCorner]
  if (corner) tokens["--checkbox-radius"] = corner
  return { tokens }
}
