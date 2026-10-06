"use client"

/* Density — one row: the tier, and under it in the same popover the spacing
   unit that scales everything the tier measures. */

import { DENSITY_TIERS, densityTier, UNIT_RANGE } from "../axes/space"
import { DialSelect, DialSlider } from "../dial"
import type { Effective, Studio } from "../state"

/** The three tiers as bars, the current one lit. */
export function SpacePreview({ state }: { state: Effective }) {
  const tier = densityTier(state.density)
  return (
    <span className="flex h-4 items-end gap-0.5" aria-hidden>
      {DENSITY_TIERS.map((t) => (
        <span
          key={t.id}
          className="w-1 rounded-full bg-fg/25 data-active:bg-fg/80"
          data-active={t.id === tier.id || undefined}
          style={{ height: `${(t.control / 9) * 100}%` }}
        />
      ))}
    </span>
  )
}

export function SpaceSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <DialSelect
      label="Density"
      value={densityTier(state.density).id}
      onChange={set("density")}
      options={DENSITY_TIERS.map((t) => ({
        value: t.id,
        label: t.label,
        description: t.description,
      }))}
    >
      <DialSlider
        label="Spacing"
        value={state.spacingUnit}
        onChange={set("spacingUnit")}
        minValue={UNIT_RANGE.min}
        maxValue={UNIT_RANGE.max}
        step={UNIT_RANGE.step}
        format={(v) => `${v}px`}
      />
      <p className="px-3 text-xs text-fg/50">
        Scales every padding, gap and height.
      </p>
    </DialSelect>
  )
}
