"use client"

/* Density — one row: the tier, and under it in the same popover the spacing
   unit that scales everything the tier measures. */

import {
  ListBox,
  ListBoxItem,
  ListBoxItemDescription,
  ListBoxItemLabel,
} from "@/registry/ui/list-box"

import { DENSITY_TIERS, densityTier, UNIT_RANGE } from "../axes/space"
import { DialPopover, DialSeparator, DialSlider, DialTrigger } from "../dial"
import type { Studio, StudioState } from "../state"

/** The three tiers as bars, the current one lit. */
export function SpacePreview({ state }: { state: StudioState }) {
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
  const tier = densityTier(state.density)
  return (
    <DialTrigger label="Density" value={tier.label}>
      <DialPopover>
        <ListBox
          aria-label="Density"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[tier.id]}
          onSelectionChange={(keys) => {
            if (keys === "all") return
            const next = keys.values().next().value
            if (next) set("density")(next as string)
          }}
        >
          {DENSITY_TIERS.map((t) => (
            <ListBoxItem key={t.id} id={t.id} textValue={t.label}>
              <ListBoxItemLabel>{t.label}</ListBoxItemLabel>
              <ListBoxItemDescription>{t.description}</ListBoxItemDescription>
            </ListBoxItem>
          ))}
        </ListBox>
        <DialSeparator />
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
      </DialPopover>
    </DialTrigger>
  )
}
