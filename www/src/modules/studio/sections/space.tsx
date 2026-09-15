"use client"

/* Space — the spatial system, on Shape's base-times-recipe model: the unit
   scales everything, density picks the gap/inset recipe, control size moves
   the height ladder. */

import { DENSITY_OPTIONS } from "../axes/space"
import { ControlGroup, SegmentedControlRow, SliderRow } from "../rows"
import type { Studio, StudioState } from "../state"

/** Collapsed-row summary: the density recipe, and the spacing unit. */
export function spaceSummary(state: StudioState): string {
  return (
    DENSITY_OPTIONS.find((o) => o.value === state.density)?.label ??
    state.density
  )
}

export function SpaceSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <>
      <ControlGroup>
        <SliderRow
          label="Unit"
          value={state.spacingUnit}
          onChange={set("spacingUnit")}
          minValue={3}
          maxValue={6}
          step={0.25}
          ticks={[3.5, 4, 5]}
          format={(v) => `${v}px`}
        />
        <SegmentedControlRow
          label="Density"
          value={state.density}
          onChange={set("density")}
          options={DENSITY_OPTIONS}
        />
      </ControlGroup>
    </>
  )
}
