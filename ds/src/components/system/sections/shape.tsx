'use client'

import { useMemo, useState } from 'react'

import type { CatalogEntry, SystemWithColors } from '@/data/schema'
import { Button } from '@/ui/button'

import { Range, Toggle } from '../primitives/controls'
import { Playground } from '../primitives/playground'
import { ScaleTrack, type ScaleItem } from '../primitives/scale-track'
import { Note, Section, Block } from '../primitives/section'
import { SpecList } from '../primitives/spec'

const radiusPrimitives: ScaleItem[] = [
  { token: 'corner-radius-0', value: 0 },
  { token: 'corner-radius-75', value: 3 },
  { token: 'corner-radius-100', value: 4, note: 'small (default)' },
  { token: 'corner-radius-200', value: 5 },
  { token: 'corner-radius-300', value: 6 },
  { token: 'corner-radius-400', value: 7 },
  { token: 'corner-radius-500', value: 8, note: 'medium (default)' },
  { token: 'corner-radius-600', value: 9 },
  { token: 'corner-radius-700', value: 10, note: 'large (default)' },
  { token: 'corner-radius-800', value: 16, note: 'extra-large (default)' },
]

const nearestPrimitives = radiusPrimitives.filter((item) => item.value > 0)

function nearestToken(px: number) {
  let closest = nearestPrimitives[0]!
  let bestDiff = Math.abs(px - closest.value)
  for (const item of nearestPrimitives) {
    const diff = Math.abs(px - item.value)
    if (diff < bestDiff) {
      closest = item
      bestDiff = diff
    }
  }
  return closest
}

const sizeFamilies = [
  {
    label: 'small family',
    example: 'ActionButton, Tag, Checkbox',
    rows: [
      { size: 'S', token: 'size-small-75', px: 3 },
      { size: 'M', token: 'size-medium-100', px: 4 },
      { size: 'L', token: 'size-large-200', px: 5 },
      { size: 'XL', token: 'size-xl-300', px: 6 },
    ],
  },
  {
    label: 'medium family',
    example: 'Button, TextField, Slider',
    rows: [
      { size: 'S', token: 'size-xs-300', px: 6 },
      { size: 'M', token: 'size-small-400', px: 7 },
      { size: 'L', token: 'size-medium-500', px: 8 },
      { size: 'XL', token: 'size-large-600', px: 9 },
    ],
  },
]

const mediumFamilyButtons = [
  { size: 'S', px: 7 },
  { size: 'M', px: 8 },
  { size: 'L', px: 9 },
  { size: 'XL', px: 10 },
]

export function ShapeSection(_props: {
  system: SystemWithColors
  catalogEntry?: CatalogEntry
}) {
  const [radius, setRadius] = useState(8)
  const [pill, setPill] = useState(false)
  const nearest = useMemo(() => nearestToken(radius), [radius])
  const maxRadius = Math.max(...radiusPrimitives.map((item) => item.value))

  return (
    <Section
      title="Shape & Radius"
      kicker="Foundations"
      intro="Spectrum 2 replaces Spectrum 1's fixed per-component radii with a shared 10-step corner-radius scale, plus a dedicated pill mechanism for fully-rounded controls at any height. The system reads rounder overall, and radius now grows with control size instead of staying fixed."
    >
      <Block
        title="Corner-radius primitives"
        description="Ten raw values, corner-radius-0 through corner-radius-800. Semantic aliases (small, medium, large, extra-large) point at specific steps; components reference the aliases, not the raw scale."
      >
        <Playground label="corner-radius-0…800" surface="grid" center={false}>
          <ScaleTrack
            items={radiusPrimitives}
            max={maxRadius}
            labelWidth="11rem"
            renderBar={(item) => (
              <div className="flex items-center gap-3">
                <span
                  className="h-10 w-10 shrink-0 bg-accent/70"
                  style={{ borderRadius: `${item.value}px` }}
                />
                {item.note && (
                  <span className="text-xs text-fg-muted">{item.note}</span>
                )}
              </div>
            )}
          />
        </Playground>
        <Note className="mt-3">
          corner-radius-1000 (full) is not on this list — it isn't a px value at
          all, see below.
        </Note>
      </Block>

      <Block
        title="Live radius"
        description="Drag to any value in between; the readout snaps to the nearest named token. Toggle Pill to switch the button to the full/1000 mechanism instead of a fixed px value."
        aside={
          <Toggle isSelected={pill} onChange={setPill}>
            Pill
          </Toggle>
        }
      >
        <Playground
          label="radius"
          controls={
            !pill && (
              <Range
                label="Radius"
                value={radius}
                onChange={setRadius}
                minValue={0}
                maxValue={24}
                format={(v) => `${v}px`}
              />
            )
          }
          footer={
            pill
              ? 'full = 0.5 × control height — always a true pill, at any size.'
              : `${radius}px → nearest token: ${nearest.token} (${nearest.value}px)`
          }
        >
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div
              className="flex h-24 w-40 items-center justify-center border bg-card text-xs text-fg-muted"
              style={{ borderRadius: pill ? '9999px' : `${radius}px` }}
            >
              card
            </div>
            <Button
              variant="primary"
              style={{ borderRadius: pill ? '9999px' : `${radius}px` }}
            >
              Continue
            </Button>
          </div>
        </Playground>
        <Note className="mt-3">
          full is a multiplier (0.5), not a fixed step: applied to the
          component's own height, so border-radius is always 50% of height — a
          true pill at 24px or 48px alike. Spectrum 2 leans rounder than
          Spectrum 1 overall: a dedicated pill primitive plus a 16px ceiling
          (corner-radius-800) on the largest fixed radius.
        </Note>
      </Block>

      <Block
        title="Radius scales with size"
        description="Component radius isn't one fixed value — each size step in a family maps to a slightly larger radius token, so bigger controls read as proportionally (not just literally) bigger. Shown here for the medium family (Button, TextField, Slider)."
      >
        <Playground
          label="medium family, S → XL"
          surface="muted"
          center={false}
          bodyClassName="flex flex-wrap items-end justify-center gap-6"
        >
          {mediumFamilyButtons.map((step) => (
            <div key={step.size} className="flex flex-col items-center gap-2">
              <Button
                variant="primary"
                size={
                  step.size === 'S'
                    ? 'xs'
                    : step.size === 'M'
                      ? 'sm'
                      : step.size === 'L'
                        ? 'md'
                        : 'lg'
                }
                style={{ borderRadius: `${step.px}px` }}
              >
                {step.size}
              </Button>
              <span className="font-mono text-xs text-fg-muted tabular-nums">
                {step.px}px
              </span>
            </div>
          ))}
        </Playground>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {sizeFamilies.map((family) => (
            <div key={family.label} className="flex flex-col gap-2">
              <p className="text-xs font-medium tracking-wide text-fg-muted uppercase">
                {family.label}
              </p>
              <SpecList
                rows={family.rows.map((row) => ({
                  label: row.size,
                  value: `${row.px}px`,
                  note: row.token,
                }))}
              />
              <Note>e.g. {family.example}</Note>
            </div>
          ))}
        </div>
      </Block>

      <Note>Source: spectrum-design-data/packages/tokens/src/layout.json</Note>
    </Section>
  )
}
