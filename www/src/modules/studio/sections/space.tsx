"use client"

/* Space — the spatial system, on Shape's base-times-recipe model: the unit
   scales everything, density picks the gap/inset recipe, control size moves
   the height ladder. All three resolve in the hero's specimen. */

import { DENSITY_OPTIONS, spaceRecipe } from "../axes/space"
import { Hero } from "../hero"
import { ControlGroup, SegmentedControlRow, SliderRow } from "../rows"
import type { Lab, LabState } from "../state"
import { controlRadiusPx, roleRadiusPx } from "./shape"

/** A working mini form wearing the resolved recipe — control heights, the
 *  stack gap and the card inset all derive from unit × density × size, with
 *  radii read from Shape's roles. */
export function SpaceHero({ state }: { state: LabState }) {
  const r = spaceRecipe(state)
  const controlRadius = controlRadiusPx(state)
  return (
    <Hero>
      <div
        className="flex flex-col border border-border/45 bg-card"
        style={{
          gap: r.gap,
          padding: r.inset,
          borderRadius: roleRadiusPx(state, "roleSurface"),
        }}
      >
        <span
          className="flex w-full items-center border border-border-control bg-field text-[0.8125rem] text-fg-muted"
          style={{
            height: r.controlH,
            paddingInline: r.padX,
            borderRadius: controlRadius,
          }}
        >
          you@example.com
        </span>
        <span className="flex items-center" style={{ gap: r.itemGap }}>
          <span
            className="flex items-center bg-primary text-[0.8125rem] font-medium text-fg-on-primary"
            style={{
              height: r.controlH,
              paddingInline: r.padX,
              borderRadius: controlRadius,
            }}
          >
            Save
          </span>
          <span
            className="flex items-center text-[0.8125rem] font-medium text-fg-muted"
            style={{
              height: r.controlH,
              paddingInline: r.padX,
              borderRadius: controlRadius,
            }}
          >
            Cancel
          </span>
        </span>
      </div>
    </Hero>
  )
}

/** Collapsed-row summary: the density recipe, and the spacing unit. */
export function spaceSummary(state: LabState): string {
  const density =
    DENSITY_OPTIONS.find((o) => o.value === state.density)?.label ??
    state.density
  return `${density} density · ${state.spacingUnit}px unit`
}

export function SpaceSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <ControlGroup>
        <SpaceHero state={state} />
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
