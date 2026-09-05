/* Disabled — how the system says "not now", everywhere at once. One axis,
   treatment: solid grey (dotUI today, Spectrum 2, Geist — opaque grey fills
   with muted text; every variant collapses to the same grey) vs fade (shadcn,
   Radix — the control keeps its colors under flat 50% opacity) vs alpha grey
   (Material 3 — no opacity, fixed on-surface alphas: 38% text, 12% fills).

   Engine: the `--disabled-*` tokens declared in base.css. Every disabled
   recolor in the registry reads one of them with the control's own color as
   the fallback (`disabled:bg-(--disabled-bg,var(--color-danger))`), so fade
   unsets them (`initial`) and dims through `--disabled-opacity`, while the
   recolor treatments re-point them. */

import type { Resolved, StudioState } from "./index"

export const DISABLED_DEFAULTS = {
  disabledTreatment: "solid",
}

export const TREATMENT_OPTIONS = [
  { value: "solid", label: "Solid" },
  { value: "fade", label: "Fade" },
  { value: "alpha", label: "Alpha" },
]

const DISABLED_TOKENS = [
  "--disabled-bg",
  "--disabled-fg",
  "--disabled-border",
  "--disabled-selected-bg",
  "--disabled-selected-fg",
  "--disabled-unselected-bg",
  "--color-primary-disabled",
]

const ink = (pct: number) =>
  `color-mix(in oklab, var(--color-fg) ${pct}%, transparent)`

const TREATMENT_TOKENS: Record<string, Record<string, string>> = {
  fade: {
    ...Object.fromEntries(DISABLED_TOKENS.map((name) => [name, "initial"])),
    "--disabled-opacity": "0.5",
  },
  alpha: {
    "--disabled-bg": ink(12),
    "--disabled-fg": ink(38),
    "--disabled-border": ink(12),
    "--disabled-selected-bg": ink(38),
    "--disabled-selected-fg": "var(--color-bg)",
    "--disabled-unselected-bg": ink(12),
    "--color-primary-disabled": ink(12),
  },
}

export const WIRED = true

export function resolveDisabled(state: StudioState): Resolved {
  const tokens = TREATMENT_TOKENS[state.disabledTreatment]
  return tokens ? { tokens: { ...tokens } } : {}
}
