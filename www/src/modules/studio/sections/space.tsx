"use client"

/* Density: the tier, drawn to scale, and the rows that read it. */

import { DENSITY_VALUES } from "../axes/space"
import { DENSITY_OPTIONS, densityTier } from "../axes/space.meta"
import { DialGap, DialGlyph, DialList } from "../dial"
import { FamilyHero, HeroMember, UsesRow } from "../family-page"
import type { Effective, Studio } from "../state"

const TOUCH = densityTier("touch").ladder

/** A tier's button ladder, xs to lg, on one baseline. */
function LadderGlyph({ density }: { density: string }) {
  const { ladder } = densityTier(density)
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      {ladder.map((px, i) => {
        const h = (px / TOUCH[3]) * 14
        return (
          <rect
            key={i}
            x={1 + i * 3.75}
            y={15 - h}
            width={2.5}
            height={h}
            rx={1}
            fill="currentColor"
          />
        )
      })}
    </svg>
  )
}

/** Every tier's md control as a bar, the current one lit. */
export function SpacePreview({ state }: { state: Effective }) {
  return (
    <span className="flex h-4 items-end gap-0.5" aria-hidden>
      {DENSITY_VALUES.map((id) => (
        <span
          key={id}
          className="w-1 rounded-full bg-fg/25 data-active:bg-fg/80"
          data-active={id === state.density || undefined}
          style={{ height: `${(densityTier(id).ladder[2] / TOUCH[2]) * 100}%` }}
        />
      ))}
    </span>
  )
}

/* Fields and menu rows above the control md, per their own rows. */
const FIELD_STEP: Record<string, number> = { controls: 0, step: 4, tall: 16 }
const ROW_STEP: Record<string, number> = { match: 0, step: 4 }

const SCALE = 0.75

export function SpaceSection({ studio }: { studio: Studio }) {
  const { effective } = studio
  const tier = densityTier(effective.density)
  const md = tier.ladder[2]
  const field = md + (FIELD_STEP[effective.inputHeight] ?? 0)
  const step = ROW_STEP[effective.menuRows]
  const row = step === undefined ? tier.row : md + step
  const px = (n: number) => `${n * SCALE}px`
  return (
    <>
      <FamilyHero>
        <HeroMember name="Button">
          <span
            className="flex items-center rounded-md bg-fg/75"
            style={{ height: px(md), paddingInline: px(md / 2.5) }}
          >
            <span className="h-1 w-5 rounded-full bg-bg/80" />
          </span>
        </HeroMember>
        <HeroMember name="Field">
          <span
            className="flex w-16 items-center rounded-md border border-fg/25 px-2"
            style={{ height: px(field) }}
          >
            <span className="h-1 w-6 rounded-full bg-fg/30" />
          </span>
        </HeroMember>
        <HeroMember name="Menu row">
          <span
            className="flex w-16 items-center rounded-sm bg-fg/10 px-2"
            style={{ height: px(row) }}
          >
            <span className="h-1 w-8 rounded-full bg-fg/40" />
          </span>
        </HeroMember>
        <HeroMember name="Text">
          <span className="leading-none" style={{ fontSize: tier.text }}>
            Aa
          </span>
        </HeroMember>
      </FamilyHero>
      <DialList
        axis="density"
        label="Density"
        options={DENSITY_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <DialGlyph>
              <LadderGlyph density={option.value} />
            </DialGlyph>
          ),
        }))}
      />
      <DialGap />
      <UsesRow axis="inputHeight" label="Field height" />
      <UsesRow axis="menuRows" label="Menu rows" />
      <UsesRow axis="uiTextSize" label="UI text size" />
    </>
  )
}
