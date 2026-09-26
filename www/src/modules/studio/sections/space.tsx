"use client"

/* Density — one row opening three cards, each a small app drawn at that
   tier's real measurements on the current unit, so the pick is made by feel;
   the unit slider under them scales everything. */

import { roleRadiusPx } from "../axes/shape"
import { DENSITY_TIERS, densityTier, UNIT_RANGE } from "../axes/space"
import type { DensityTier } from "../axes/space"
import { DialGap, DialPopover, DialSlider, DialTrigger } from "../dial"
import { CardGrid } from "../patterns"
import type { Studio, StudioState } from "../state"

/** A small app at a tier's real measurements and the system's own corners: a
 *  field and a button (the md control), over a menu of two items, inside a
 *  card's inset. */
function AppGlyph({ tier, state }: { tier: DensityTier; state: StudioState }) {
  const px = (n: number) => n * state.spacingUnit
  const text = { height: tier.textPx * 0.5, borderRadius: 999 }
  const radius = (key: Parameters<typeof roleRadiusPx>[1]) => ({
    borderRadius: roleRadiusPx(state, key),
  })
  return (
    <span
      className="flex w-full flex-col border border-fg/15 bg-bg"
      style={{
        padding: px(tier.inset) / 2,
        gap: px(tier.gap),
        ...radius("rolePanel"),
      }}
    >
      <span className="w-2/5 bg-fg/20" style={text} />
      <span className="flex" style={{ gap: px(tier.gap) }}>
        <span
          className="flex flex-1 items-center border border-fg/20"
          style={{
            height: px(tier.control),
            paddingInline: px(2),
            ...radius("roleControl"),
          }}
        >
          <span className="w-1/2 bg-fg/15" style={text} />
        </span>
        <span
          className="bg-primary"
          style={{
            height: px(tier.control),
            width: px(tier.control) * 1.5,
            ...radius("roleControl"),
          }}
        />
      </span>
      <span
        className="flex flex-col border border-fg/10 bg-card"
        style={{ padding: px(1), gap: px(0.5), ...radius("roleSurface") }}
      >
        {[true, false].map((selected, i) => (
          <span
            key={i}
            className="flex items-center"
            style={{
              height: px(tier.item),
              paddingInline: px(2),
              ...radius("roleItem"),
              background: selected
                ? "color-mix(in oklab, var(--color-fg) 10%, transparent)"
                : undefined,
            }}
          >
            <span className="w-3/5 bg-fg/20" style={text} />
          </span>
        ))}
      </span>
    </span>
  )
}

/** The three tiers as bars, the current one lit. */
function SpacePreview({ state }: { state: StudioState }) {
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

function spaceSummary(state: StudioState): string {
  return densityTier(state.density).label
}

export function SpaceSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  const tier = densityTier(state.density)
  return (
    <DialTrigger
      label="Density"
      value={
        <>
          <span className="truncate">
            {spaceSummary(state)} · {state.spacingUnit}px
          </span>
          <SpacePreview state={state} />
        </>
      }
    >
      <DialPopover className="w-80">
        <CardGrid
          label="Density"
          value={tier.id}
          onChange={set("density")}
          options={DENSITY_TIERS.map((t) => ({
            id: t.id,
            label: t.label,
            children: <AppGlyph tier={t} state={state} />,
          }))}
        />
        <DialGap />
        <DialSlider
          label="Unit"
          value={state.spacingUnit}
          onChange={set("spacingUnit")}
          minValue={UNIT_RANGE.min}
          maxValue={UNIT_RANGE.max}
          step={UNIT_RANGE.step}
          format={(v) => `${v}px`}
        />
      </DialPopover>
    </DialTrigger>
  )
}
