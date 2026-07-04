'use client'

import { useMemo, useState } from 'react'

import type { RosterEntry, SystemWithColors } from '@/data/schema'

import {
  Block,
  Choice,
  Mono,
  Note,
  Playground,
  Range,
  ScaleTrack,
  Section,
  SpecList,
  Toggle,
} from '../primitives'

type Scale = 'desktop' | 'mobile'

const fontSizeScale = [
  { token: '25', desktop: 10, mobile: 12 },
  { token: '50', desktop: 11, mobile: 13 },
  { token: '75', desktop: 12, mobile: 15 },
  { token: '100', desktop: 14, mobile: 17 },
  { token: '200', desktop: 16, mobile: 19 },
  { token: '300', desktop: 18, mobile: 22 },
  { token: '400', desktop: 20, mobile: 24 },
  { token: '500', desktop: 22, mobile: 27 },
  { token: '600', desktop: 25, mobile: 31 },
  { token: '700', desktop: 28, mobile: 34 },
  { token: '800', desktop: 32, mobile: 39 },
  { token: '900', desktop: 36, mobile: 44 },
  { token: '1000', desktop: 40, mobile: 49 },
  { token: '1100', desktop: 45, mobile: 55 },
  { token: '1200', desktop: 51, mobile: 62 },
  { token: '1300', desktop: 58, mobile: 70 },
  { token: '1400', desktop: 65, mobile: 79 },
  { token: '1500', desktop: 73, mobile: 88 },
] as const

const headingRamp = [
  { label: 'XS', token: '300', desktop: 18, mobile: 22 },
  { label: 'S', token: '400', desktop: 20, mobile: 24 },
  { label: 'M', token: '500', desktop: 22, mobile: 27 },
  { label: 'L', token: '700', desktop: 28, mobile: 34 },
  { label: 'XL', token: '900', desktop: 36, mobile: 44 },
  { label: 'XXL', token: '1100', desktop: 45, mobile: 55 },
  { label: 'XXXL', token: '1300', desktop: 58, mobile: 70 },
] as const

const roleTables = {
  Heading: {
    weight: 'extra-bold',
    color: 'gray-900',
    rows: [
      { label: 'XS', token: '300', desktop: 18, mobile: 22 },
      { label: 'S', token: '400', desktop: 20, mobile: 24 },
      { label: 'M', token: '500', desktop: 22, mobile: 27 },
      { label: 'L', token: '700', desktop: 28, mobile: 34 },
      { label: 'XL', token: '900', desktop: 36, mobile: 44 },
      { label: 'XXL', token: '1100', desktop: 45, mobile: 55 },
      { label: 'XXXL', token: '1300', desktop: 58, mobile: 70 },
    ],
  },
  Body: {
    weight: 'regular',
    color: 'gray-800',
    rows: [
      { label: 'XS', token: '75', desktop: 12, mobile: 15 },
      { label: 'S', token: '100', desktop: 14, mobile: 17 },
      { label: 'M', token: '200', desktop: 16, mobile: 19 },
      { label: 'L', token: '300', desktop: 18, mobile: 22 },
      { label: 'XL', token: '400', desktop: 20, mobile: 24 },
      { label: 'XXL', token: '500', desktop: 22, mobile: 27 },
    ],
  },
  Detail: {
    weight: 'medium',
    color: 'gray-600',
    rows: [
      { label: 'XS', token: '50', desktop: 11, mobile: 13 },
      { label: 'S', token: '75', desktop: 12, mobile: 15 },
      { label: 'M', token: '100', desktop: 14, mobile: 17 },
      { label: 'L', token: '200', desktop: 16, mobile: 19 },
      { label: 'XL', token: '300', desktop: 18, mobile: 22 },
    ],
  },
  Code: {
    weight: 'regular (Source Code Pro)',
    color: 'gray-800',
    rows: [
      { label: 'XS', token: '75', desktop: 12, mobile: 15 },
      { label: 'S', token: '100', desktop: 14, mobile: 17 },
      { label: 'M', token: '200', desktop: 16, mobile: 19 },
      { label: 'L', token: '300', desktop: 18, mobile: 22 },
    ],
  },
} as const

const weights = [
  { name: 'regular', value: 400 },
  { name: 'medium', value: 500 },
  { name: 'bold', value: 700 },
  { name: 'extra-bold', value: 800 },
  { name: 'black', value: 900 },
] as const

const families = [
  {
    label: 'Sans (UI)',
    name: 'Adobe Clean',
    stack: 'adobe-clean, ui-sans-serif, system-ui, sans-serif',
    note: 'Adobe Clean Spectrum VF — the default UI typeface across Spectrum 2.',
  },
  {
    label: 'Serif',
    name: 'Adobe Clean Serif',
    stack: 'Adobe Clean Serif, serif',
    note: 'Editorial and marketing contexts.',
  },
  {
    label: 'CJK',
    name: 'Adobe Clean Han',
    stack: 'Adobe Clean Han, sans-serif',
    note: 'Weight mapping differs from the Latin family — see below.',
  },
  {
    label: 'Code',
    name: 'Source Code Pro',
    stack: 'Source Code Pro, ui-monospace, monospace',
    note: 'Used for the Code role at every size step.',
  },
] as const

function fluidLineHeight(px: number) {
  if (px >= 32) return 1.15
  const t = (px - 10) / (32 - 10)
  return 1.3 + (1.15 - 1.3) * Math.min(Math.max(t, 0), 1)
}

function clampVisual(px: number, capPx: number) {
  return Math.min(px, capPx)
}

export function TypographySection(_props: {
  system: SystemWithColors
  rosterEntry?: RosterEntry
}) {
  const [rampScale, setRampScale] = useState<Scale>('desktop')
  const [scaleTrackScale, setScaleTrackScale] = useState<Scale>('desktop')

  const [specSize, setSpecSize] = useState(20)
  const [specWeight, setSpecWeight] =
    useState<(typeof weights)[number]['value']>(400)
  const [fluid, setFluid] = useState(false)

  const specLineHeight = fluid ? fluidLineHeight(specSize) : 1.5

  const scaleItems = useMemo(
    () =>
      fontSizeScale.map((row) => ({
        token: row.token,
        value: scaleTrackScale === 'desktop' ? row.desktop : row.mobile,
        display: `${scaleTrackScale === 'desktop' ? row.desktop : row.mobile}px`,
      })),
    [scaleTrackScale],
  )

  return (
    <Section
      title="Typography"
      kicker="Foundations"
      intro="An 18-step modular scale (ratio 1.125, base 14px desktop / 17px mobile) feeds four type roles — Heading, Body, Detail, Code — each pinned to a fixed subset of steps, a fixed weight, and a fixed gray. Line-height fluidly tightens as headings get larger; body text never does."
    >
      <Block
        title="Heading ramp"
        description="Every Heading step, set extra-bold in gray-900. Sizes are real Spectrum 2 values; the specimen font is illustrative (Adobe Clean is not bundled here)."
        aside={
          <Choice
            label="Scale"
            value={rampScale}
            onChange={setRampScale}
            options={[
              { value: 'desktop', label: 'Desktop' },
              { value: 'mobile', label: 'Mobile' },
            ]}
          />
        }
      >
        <Playground center={false} surface="default">
          <div className="flex w-full flex-col gap-5">
            {headingRamp.map((step) => {
              const px = rampScale === 'desktop' ? step.desktop : step.mobile
              return (
                <div
                  key={step.token}
                  className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <span className="w-24 shrink-0 font-mono text-xs text-fg-muted">
                    Heading {step.label}
                    <span className="block text-[10px] text-fg-muted/70">
                      {step.token} · {px}px
                    </span>
                  </span>
                  <span
                    className="text-fg"
                    style={{
                      fontSize: clampVisual(px, 64),
                      fontWeight: 800,
                      lineHeight: fluidLineHeight(px),
                    }}
                  >
                    Adobe Spectrum 2
                  </span>
                </div>
              )
            })}
          </div>
        </Playground>
      </Block>

      <Block
        title="Font-size scale"
        description="Tokens 25–1500, the shared scale every role draws its steps from."
        aside={
          <Choice
            label="Scale"
            value={scaleTrackScale}
            onChange={setScaleTrackScale}
            options={[
              { value: 'desktop', label: 'Desktop' },
              { value: 'mobile', label: 'Mobile' },
            ]}
          />
        }
      >
        <ScaleTrack
          items={scaleItems}
          labelWidth="4rem"
          renderBar={(item) => (
            <span
              className="flex h-14 min-w-0 items-baseline overflow-hidden text-fg"
              style={{ fontSize: clampVisual(item.value, 56), lineHeight: 1 }}
            >
              Ag
            </span>
          )}
        />
      </Block>

      <Block
        title="Interactive specimen"
        description="Drag the size and pick a weight to see a live paragraph. Toggle fluid line-height to compare against the flat 1.5 body text uses."
      >
        <Playground
          center={false}
          controls={
            <div className="flex flex-wrap items-center gap-4">
              <Range
                label="Size"
                value={specSize}
                onChange={setSpecSize}
                minValue={10}
                maxValue={96}
                format={(v) => `${v}px`}
              />
              <Choice
                label="Weight"
                value={String(specWeight)}
                onChange={(v) => setSpecWeight(Number(v) as typeof specWeight)}
                options={weights.map((w) => ({
                  value: String(w.value),
                  label: String(w.value),
                }))}
              />
              <Toggle isSelected={fluid} onChange={setFluid}>
                Fluid line-height
              </Toggle>
            </div>
          }
        >
          <div className="flex w-full flex-col gap-4">
            <p
              className="text-fg"
              style={{
                fontSize: specSize,
                fontWeight: specWeight,
                lineHeight: specLineHeight,
              }}
            >
              Adobe Spectrum 2 is a flexible design language built to scale
              across Adobe's products, from focused single-surface tools to
              expansive, collaborative canvases.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-1 border-t pt-3">
              <span className="text-xs text-fg-muted">
                size <Mono>{specSize}px</Mono>
              </span>
              <span className="text-xs text-fg-muted">
                weight <Mono>{specWeight}</Mono>
              </span>
              <span className="text-xs text-fg-muted">
                line-height <Mono>{specLineHeight.toFixed(2)}</Mono>
              </span>
            </div>
          </div>
        </Playground>
        <Note className="mt-2">
          Formula: line-height interpolates 1.3 → 1.15 for font sizes 10–32px,
          then holds at 1.15 above 32px. Body text always uses the flat
          line-height-200 (1.5) regardless of size.
        </Note>
      </Block>

      <Block
        title="Type roles"
        description="Each role is a fixed weight/color paired with a fixed subset of font-size steps."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(
            Object.entries(roleTables) as [
              keyof typeof roleTables,
              (typeof roleTables)[keyof typeof roleTables],
            ][]
          ).map(([role, spec]) => (
            <div key={role} className="rounded-xl border p-4">
              <div className="mb-3 flex items-baseline justify-between">
                <h4 className="text-sm font-medium text-fg">{role}</h4>
                <span className="text-xs text-fg-muted">
                  {spec.weight} · {spec.color}
                </span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {spec.rows.map((row) => (
                  <li
                    key={row.label}
                    className="flex items-center justify-between gap-3 font-mono text-xs"
                  >
                    <span className="text-fg-muted">
                      {role} {row.label}
                      <span className="ml-1 text-fg-muted/60">
                        ({row.token})
                      </span>
                    </span>
                    <span className="text-fg tabular-nums">
                      {row.desktop}/{row.mobile}px
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Block>

      <Block
        title="Families"
        description="Four typefaces cover UI, editorial, CJK, and code. Each name below is set in its own fallback stack."
      >
        <SpecList
          rows={families.map((family) => ({
            label: family.label,
            value: (
              <span style={{ fontFamily: family.stack }}>{family.name}</span>
            ),
            note: (
              <>
                <Mono>{family.stack}</Mono>
                <span className="ml-2">{family.note}</span>
              </>
            ),
          }))}
        />
      </Block>

      <Block
        title="Weights"
        description="Five weights ship across the family, from regular to black."
      >
        <div className="flex flex-col gap-3 rounded-xl border p-5">
          {weights.map((w) => (
            <div key={w.value} className="flex items-baseline gap-4">
              <span className="w-32 shrink-0 font-mono text-xs text-fg-muted">
                {w.name} <span className="text-fg-muted/60">({w.value})</span>
              </span>
              <span className="text-xl text-fg" style={{ fontWeight: w.value }}>
                Adobe Spectrum 2
              </span>
            </div>
          ))}
        </div>
        <Note className="mt-3">
          Adobe Clean Han (CJK) remaps two steps — its bold is 500 and its
          extra-bold is 700, one step lighter than the Latin family at the same
          names. Spectrum 1's Detail style (uppercase, 0.06em tracking) is
          deprecated in Spectrum 2: Detail is now sentence-case at medium
          weight, 0em tracking.
        </Note>
      </Block>

      <Note>
        Specimens render in the site's UI font — Adobe Clean is not bundled in
        this explorer — but every size, weight, and line-height value shown is
        the real Spectrum 2 figure. Source:
        spectrum-design-data/packages/tokens/src/typography.json, react-spectrum
        s2 spectrum-theme.ts.
      </Note>
    </Section>
  )
}
