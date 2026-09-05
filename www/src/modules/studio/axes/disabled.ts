/* Disabled — how the system says "not now", everywhere at once. One axis,
   treatment: solid grey (dotUI today, Spectrum 2, Geist — opaque grey fills
   with muted text; every variant collapses to the same grey) vs fade (shadcn,
   Radix — the control keeps its colors under flat 50% opacity) vs alpha grey
   (Material 3 — no opacity, fixed on-surface alphas: 38% text, 12% fills).

   Engine: the disabled color tokens (`--color-disabled`, `--color-fg-disabled`
   and the primary/selection pairs that keep a colored fill's own token under
   fade) plus `--disabled-opacity`, read by the base.css rule on the outermost
   disabled element. */

import type { Resolved, StudioState } from "./index"

export const DISABLED_DEFAULTS = {
  disabledTreatment: "solid",
}

export const TREATMENT_OPTIONS = [
  { value: "solid", label: "Solid" },
  { value: "fade", label: "Fade" },
  { value: "alpha", label: "Alpha" },
]

const INK_12 = "color-mix(in oklab, var(--color-fg) 12%, transparent)"
const INK_38 = "color-mix(in oklab, var(--color-fg) 38%, transparent)"

const TREATMENT_TOKENS: Record<string, Record<string, string>> = {
  fade: {
    "--disabled-opacity": "0.5",
    "--color-fg-disabled": "var(--color-fg)",
    "--color-primary-disabled": "var(--color-primary)",
    "--color-fg-primary-disabled": "var(--color-fg-on-primary)",
    "--color-selection-disabled": "var(--color-selection)",
    "--color-fg-on-selection-disabled": "var(--color-fg-on-selection)",
  },
  alpha: {
    "--color-disabled": INK_12,
    "--color-fg-disabled": INK_38,
    "--color-primary-disabled": INK_12,
    "--color-fg-primary-disabled": INK_38,
    "--color-selection-disabled": INK_38,
    "--color-fg-on-selection-disabled": "var(--color-bg)",
  },
}

export const WIRED = true

export function resolveDisabled(state: StudioState): Resolved {
  const tokens = TREATMENT_TOKENS[state.disabledTreatment]
  return tokens ? { tokens: { ...tokens } } : {}
}
