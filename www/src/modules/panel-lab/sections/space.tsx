"use client"

/* Space — the spatial system, on Shape's base-times-recipe model: the unit
   scales everything, density picks the gap/inset recipe, control size moves
   the height ladder. All three resolve in the hero's specimen. */

import { cn } from "@/registry/lib/utils"
import {
  ControlGroup,
  GroupCaption,
  SegmentedControlRow,
  SliderRow,
} from "@/modules/control-lab/rows"

import { Hero, HeroInspector, useInspect } from "../hero"
import type { Lab, LabState } from "../state"
import { controlRadiusPx, roleRadiusPx } from "./shape"

export const SPACE_DEFAULTS = {
  density: "default",
  /** Tailwind's --spacing, in px. */
  spacingUnit: 4,
  controlSize: "md",
}

const DENSITY_OPTIONS = [
  { value: "compact", label: "Compact" },
  { value: "default", label: "Default" },
  { value: "comfortable", label: "Comfortable" },
]

export const DENSITY_FACTORS: Record<string, number> = {
  compact: 0.75,
  default: 1,
  comfortable: 1.25,
}

const CONTROL_SIZE_OPTIONS = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
]

/** Control heights as ladders of units — size moves the ladder, not the recipe. */
const CONTROL_SIZE_UNITS: Record<string, number> = {
  sm: 7,
  md: 8,
  lg: 9,
}

type SpaceProbeId = "field" | "actions"

const spacePx = (n: number) => Math.round(n * 2) / 2

function spaceRecipe(state: LabState) {
  const unit = state.spacingUnit
  const factor = DENSITY_FACTORS[state.density] ?? 1
  return {
    unit,
    controlH: spacePx((CONTROL_SIZE_UNITS[state.controlSize] ?? 8) * unit),
    padX: spacePx(2.5 * unit * factor),
    itemGap: spacePx(unit * factor),
    gap: spacePx(2 * unit * factor),
    inset: spacePx(3 * unit * factor),
  }
}

/** A working mini form wearing the resolved recipe — control heights, the
 *  stack gap and the card inset all derive from unit × density × size, with
 *  radii read from Shape's roles. Hover peeks a row's box recipe, click pins;
 *  at rest the readout is the recipe itself. */
function SpaceHero({ state }: { state: LabState }) {
  const { inspected, pinned, probeProps } = useInspect<SpaceProbeId>()
  const r = spaceRecipe(state)
  const controlRadius = controlRadiusPx(state)
  const probeClass = (id: SpaceProbeId) =>
    cn(
      "-m-1 cursor-interactive rounded-lg p-1 text-left focus-reset transition-colors focus-visible:focus-ring",
      pinned === id && "bg-muted",
    )
  const readout = inspected
    ? inspected === "field"
      ? { label: "Field", detail: `h ${r.controlH}px · pad ${r.padX}px` }
      : { label: "Actions", detail: `h ${r.controlH}px · gap ${r.itemGap}px` }
    : {
        label: DENSITY_OPTIONS.find((o) => o.value === state.density)?.label,
        detail: `${r.unit}px unit · gap ${r.gap}px · inset ${r.inset}px`,
      }

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
        <button
          type="button"
          aria-label="Inspect field"
          {...probeProps("field")}
          className={probeClass("field")}
        >
          <span
            className="flex w-full items-center border border-border-field bg-field text-[0.8125rem] text-fg-muted"
            style={{
              height: r.controlH,
              paddingInline: r.padX,
              borderRadius: controlRadius,
            }}
          >
            you@example.com
          </span>
        </button>
        <button
          type="button"
          aria-label="Inspect actions"
          {...probeProps("actions")}
          className={probeClass("actions")}
        >
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
        </button>
      </div>
      <HeroInspector label={readout.label} detail={readout.detail} />
    </Hero>
  )
}

export function SpaceSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
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
      <ControlGroup>
        <SegmentedControlRow
          label="Density"
          value={state.density}
          onChange={set("density")}
          options={DENSITY_OPTIONS}
        />
        <SegmentedControlRow
          label="Controls"
          value={state.controlSize}
          onChange={set("controlSize")}
          options={CONTROL_SIZE_OPTIONS}
        />
      </ControlGroup>
      <GroupCaption>
        Density tightens gaps and insets at the same control size; Controls
        moves the height ladder. The unit scales both.
      </GroupCaption>
    </>
  )
}
