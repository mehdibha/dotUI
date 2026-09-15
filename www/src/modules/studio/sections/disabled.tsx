"use client"

/* Disabled — how the system says "not now", everywhere at once. One axis,
   treatment: solid grey (dotUI today, Spectrum 2, Geist — opaque grey fills
   with muted text; every variant collapses to the same grey) vs fade
   (shadcn, Radix — the control keeps its colors under flat 50% opacity) vs
   alpha grey (Material 3 — no opacity, fixed on-surface alphas: 38% text,
   12% container fills). Rejected: disabled cursor (not-allowed vs default)
   — the Cursor chapter owns it; per-component disabled looks — disabled is
   system-wide by definition, no surveyed system forks it; fade amount (50%
   vs 38%) — a knob inside one treatment, not a fork. */

import { TREATMENT_OPTIONS } from "../axes/disabled"
import { ControlGroup, SegmentedControlRow } from "../rows"
import type { Studio, StudioState } from "../state"

/** Collapsed-row summary: the disabled treatment. */
export function disabledSummary(state: StudioState): string {
  return (
    TREATMENT_OPTIONS.find((o) => o.value === state.disabledTreatment)?.label ??
    state.disabledTreatment
  )
}

export function DisabledSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SegmentedControlRow
        label="Treatment"
        value={state.disabledTreatment}
        onChange={set("disabledTreatment")}
        options={TREATMENT_OPTIONS}
      />
    </ControlGroup>
  )
}
