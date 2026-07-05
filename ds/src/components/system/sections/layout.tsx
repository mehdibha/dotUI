'use client'

import { useMemo, useState } from 'react'

import type { CatalogEntry, SystemWithColors } from '@/data/schema'
import { Badge } from '@/ui/badge'

import {
  Block,
  Choice,
  Note,
  Playground,
  Range,
  ScaleTrack,
  Section,
  SpecList,
} from '../primitives'

const breakpoints = [
  { token: 'base', min: 0 },
  { token: 'S', min: 640 },
  { token: 'M', min: 768 },
  { token: 'L', min: 1024 },
  { token: 'XL', min: 1280 },
  { token: 'XXL', min: 1536 },
] as const

const columnsByBreakpoint: Record<
  (typeof breakpoints)[number]['token'],
  number
> = {
  base: 1,
  S: 2,
  M: 3,
  L: 4,
  XL: 6,
  XXL: 6,
}

function activeBreakpoint(width: number) {
  let active: (typeof breakpoints)[number] = breakpoints[0]!
  for (const bp of breakpoints) {
    if (width >= bp.min) active = bp
  }
  return active
}

const platformScale = [
  { label: 'component-height-100', medium: 32, large: 40, unit: 'px' },
  { label: 'icon (representative size)', medium: 18, large: 22, unit: 'px' },
  { label: 'meter width', medium: 192, large: 240, unit: 'px' },
]

const patterns = [
  {
    name: 'Split View',
    description:
      'Master-detail: a resizable list panel drives a detail panel beside it.',
  },
  {
    name: 'Tray',
    description:
      'A bottom-anchored overlay for compact, mobile-oriented actions and menus.',
  },
  {
    name: 'Side navigation',
    description:
      'A persistent app-shell panel for top-level navigation between sections.',
  },
  {
    name: 'Contextual help',
    description:
      'A popover anchored to a control, surfacing extra explanation without leaving the flow.',
  },
] as const

function PatternDiagram({ name }: { name: (typeof patterns)[number]['name'] }) {
  const base = 'rounded-[3px] border border-fg-muted/40 bg-muted/40'
  if (name === 'Split View') {
    return (
      <div className="flex h-16 w-full gap-1">
        <div className={`${base} w-2/5`} />
        <div className={`${base} flex-1 bg-accent/20`} />
      </div>
    )
  }
  if (name === 'Tray') {
    return (
      <div className="relative h-16 w-full overflow-hidden rounded-[3px] border border-fg-muted/40 bg-muted/20">
        <div className="absolute inset-x-0 bottom-0 h-1/2 rounded-t-[3px] border-t border-fg-muted/40 bg-accent/20" />
      </div>
    )
  }
  if (name === 'Side navigation') {
    return (
      <div className="flex h-16 w-full gap-1">
        <div className={`${base} w-1/4 bg-accent/20`} />
        <div className={`${base} flex-1`} />
      </div>
    )
  }
  return (
    <div className="relative h-16 w-full rounded-[3px] border border-fg-muted/40 bg-muted/20">
      <div className="absolute top-2 left-3 h-2 w-2 rounded-full border border-fg-muted/40 bg-accent/40" />
      <div className="absolute top-6 left-3 h-8 w-24 rounded-[3px] border border-fg-muted/40 bg-accent/20" />
    </div>
  )
}

export function LayoutSection(_props: {
  system: SystemWithColors
  catalogEntry?: CatalogEntry
}) {
  const [width, setWidth] = useState(1024)
  const [gridMode, setGridMode] = useState<'fluid' | 'fixed'>('fluid')

  const active = useMemo(() => activeBreakpoint(width), [width])
  const cols = columnsByBreakpoint[active.token]

  return (
    <Section
      title="Layout, Grid & Adaptive"
      kicker="Foundations"
      intro="Spectrum 2 lays out screens on a mobile-first, 12-column grid whose gutters, margins, and column count shift at named breakpoints. The same style macro that resolves color and spacing also resolves layout: any prop can take a conditional object keyed by breakpoint, and the platform scale swaps in larger hit targets for touch."
    >
      <Block
        title="Breakpoint playground"
        description="Drag the viewport width to see which breakpoint is active and how the column count in a responsive grid responds."
      >
        <Playground
          label="Viewport"
          hint={`${width}px`}
          controls={
            <Range
              label="Viewport width"
              value={width}
              onChange={setWidth}
              minValue={320}
              maxValue={1600}
              step={8}
              format={(v) => `${v}px`}
            />
          }
          center
          bodyClassName="overflow-x-auto"
        >
          <div
            className="flex flex-col gap-2 transition-[width] duration-150"
            style={{ width: `${width}px`, maxWidth: '100%' }}
          >
            <div className="flex items-center justify-between">
              <Badge variant="accent" appearance="subtle">
                {active.token} · min-width {active.min}px
              </Badge>
              <span className="font-mono text-xs text-fg-muted tabular-nums">
                {cols} col{cols > 1 ? 's' : ''}
              </span>
            </div>
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: cols }).map((_, i) => (
                <div key={i} className="h-16 rounded-md border bg-accent/15" />
              ))}
            </div>
          </div>
        </Playground>
      </Block>

      <Block
        title="Breakpoints"
        description="Mobile-first min-widths. Base has no lower bound; each named breakpoint applies at its min-width and up. Customizable per app via Provider."
      >
        <ScaleTrack
          items={breakpoints.map((bp) => ({
            token: bp.token,
            value: bp.min,
            display: `${bp.min}px`,
            note: bp.token === active.token ? 'active' : undefined,
          }))}
          max={1600}
          renderBar={(item, maxValue) => (
            <span
              className={`h-4 rounded-[3px] ${
                item.token === active.token ? 'bg-accent' : 'bg-accent/25'
              }`}
              style={{
                width: `${Math.max((item.value / maxValue) * 100, 1.5)}%`,
              }}
            />
          )}
        />
        <Note className="mt-3">
          Exact per-breakpoint gutter/margin values (roughly 16–24px, growing
          with breakpoint) are only published inside the internal Spectrum
          design tool — not in the public token data.
        </Note>
      </Block>

      <Block
        title="12-column grid"
        description="spectrum-css-grid spans elements with grid-column 1 / 13. Fluid grids stretch to 100% width; fixed grids cap out at a max-width and center."
        aside={
          <Choice
            label="Grid width"
            value={gridMode}
            onChange={setGridMode}
            options={[
              { value: 'fluid', label: 'Fluid' },
              { value: 'fixed', label: 'Fixed' },
            ]}
          />
        }
      >
        <Playground
          surface="muted"
          center={false}
          bodyClassName="overflow-x-auto"
        >
          <div
            className="mx-auto"
            style={{ maxWidth: gridMode === 'fixed' ? '640px' : '100%' }}
          >
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-12 rounded-md border border-dashed bg-accent/10 px-3 py-2 font-mono text-[11px] text-fg-muted">
                header · 1 / 13
              </div>
              <div className="col-span-3 rounded-md border border-dashed bg-accent/20 px-3 py-6 font-mono text-[11px] text-fg-muted">
                sidebar · 3
              </div>
              <div className="col-span-9 rounded-md border border-dashed bg-accent/10 px-3 py-6 font-mono text-[11px] text-fg-muted">
                content · 9
              </div>
            </div>
          </div>
        </Playground>
        <Note className="mt-3">
          Gutters render as the gap between the 12 tracks above; real gutter
          widths scale by breakpoint (see note above).
        </Note>
      </Block>

      <Block
        title="Adaptive: platform scale"
        description="Two scales — medium for desktop/cursor input, large for mobile/touch — grow hit targets and icon sizes for touch without a separate visual style."
      >
        <SpecList
          rows={platformScale.map((row) => ({
            label: row.label,
            value: `${row.medium}${row.unit} → ${row.large}${row.unit}`,
            note: 'medium (cursor) → large (touch)',
          }))}
        />
      </Block>

      <Block
        title="Canonical layout patterns"
        description="Recurring app-shell shapes built from the grid and platform scale above."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {patterns.map((pattern) => (
            <div key={pattern.name} className="rounded-xl border p-5">
              <p className="text-sm font-medium text-fg">{pattern.name}</p>
              <p className="mt-1 text-sm text-fg-muted">
                {pattern.description}
              </p>
              <div className="mt-3">
                <PatternDiagram name={pattern.name} />
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Note>
        Source: spectrum.adobe.com/page/responsive-grid, spectrum.adobe.com
        platform-scale documentation, react-spectrum S2 layout docs
        (spectrum-css-grid, style macro conditional breakpoint objects).
      </Note>
    </Section>
  )
}
