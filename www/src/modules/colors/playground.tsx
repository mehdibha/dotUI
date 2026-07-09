import { useEffect, useMemo, useState } from 'react'
import type { Selection } from 'react-aria-components'
import { type Color, parseColor } from 'react-aria-components/ColorField'
import { useTheme } from 'starter-themes'

import { type BaseThemeOptions, createTheme } from '@dotui/colors'

import { Button } from '@/registry/ui/button'
import { ColorEditor } from '@/registry/ui/color-editor'
import { ColorField } from '@/registry/ui/color-field'
import { ColorPicker } from '@/registry/ui/color-picker'
import { ColorSwatch } from '@/registry/ui/color-swatch'
import { DialogContent } from '@/registry/ui/dialog'
import { Input } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@/registry/ui/segmented-control'

import { ComponentCluster } from './cluster'
import { REFERENCE_SOURCES } from './data'
import { accentVars, accentVarsFromColors } from './inject'
import {
  contrast,
  deltaE,
  firstStepMeeting,
  lightnessOf,
  type Mode,
  nearestScale,
  orientToMode,
  rampDeltaE,
  reverseRamp,
  scaleColors,
  solidIndex,
  SOLID_STEP,
  STEPS,
  type Step,
  surfaceFor,
} from './lib'

const DEFAULT_SEED = '#635bff'
/** Neutral seed for the derived background; a flat gray keeps surfaces honest. */
const NEUTRAL_SEED = '#808080'

interface Algorithm {
  id: string
  label: string
}

/** The shipping engine's generative algorithms (fixed is identity-only, so excluded). */
const ALGORITHMS: Algorithm[] = [
  { id: 'oklch', label: 'oklch · default' },
  { id: 'tailwind', label: 'tailwind · hue-torsion' },
  { id: 'contrast', label: 'contrast · bg-aware' },
  { id: 'material', label: 'material · HCT' },
]

interface Ramp {
  colors: string[]
  steps: Record<Step, string>
  onSolid: string
}

/** Generate one algorithm's primary ramp + on-solid for a mode, via the shipping engine. */
function algorithmRamp(algorithm: string, seed: string, mode: Mode): Ramp {
  const flat = (): Ramp => {
    const steps = {} as Record<Step, string>
    for (const s of STEPS) steps[s] = '#808080'
    return { colors: STEPS.map(() => '#808080'), steps, onSolid: '#ffffff' }
  }
  try {
    const options: BaseThemeOptions = {
      algorithm,
      palettes: { primary: seed, neutral: NEUTRAL_SEED },
    }
    const out = createTheme(options)[mode]
    if (!out) return flat()
    const scale = out.scales.primary ?? {}
    const on = out.on.primary ?? {}
    const steps = {} as Record<Step, string>
    for (const s of STEPS) steps[s] = scale[s] ?? '#808080'
    return {
      colors: STEPS.map((s) => steps[s]),
      steps,
      onSolid: on[SOLID_STEP] ?? '#ffffff',
    }
  } catch {
    return flat()
  }
}

/** The shipped dark ramp: the algorithm's light output, reversed (see `resolveColorConfig`). */
function shippedDarkColors(algorithm: string, seed: string): string[] {
  return reverseRamp(algorithmRamp(algorithm, seed, 'light').colors)
}

export function ColorPlayground() {
  const [seed, setSeed] = useState(DEFAULT_SEED)
  const [mode, setMode] = useState<Mode>('light')
  const { setTheme } = useTheme()

  // Primitives cascade from the html theme class; a wrapper can't force light
  // under a dark root, so sync the site theme to the playground mode.
  useEffect(() => {
    setTheme(mode)
  }, [mode, setTheme])

  const dark = mode === 'dark'

  return (
    <div
      className={dark ? 'dark' : undefined}
      style={{
        minHeight: '100vh',
        background: dark ? '#111111' : '#ffffff',
        color: dark ? '#ededed' : '#111111',
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <Controls seed={seed} setSeed={setSeed} mode={mode} setMode={setMode} />
        <RampGrid seed={seed} mode={mode} />
        <DeltaTable seed={seed} mode={mode} />
        <InjectionPanels seed={seed} mode={mode} />
        <SurfaceLevels seed={seed} mode={mode} />
      </div>
    </div>
  )
}

// MARK: Controls

function Controls({
  seed,
  setSeed,
  mode,
  setMode,
}: {
  seed: string
  setSeed: (s: string) => void
  mode: Mode
  setMode: (m: Mode) => void
}) {
  const seedColor = useMemo(() => parseSeed(seed), [seed])

  const handleColorChange = (color: Color) => setSeed(color.toString('hex'))

  const handleModeChange = (keys: Selection) => {
    if (keys === 'all') return
    const next = [...keys][0] as Mode | undefined
    if (next) setMode(next)
  }

  return (
    <header className="flex flex-wrap items-center gap-4">
      <div>
        <h1 className="text-lg font-semibold">Color engine — playground</h1>
        <p className="text-xs opacity-60">
          Compares the shipping algorithms against each other and industry
          references.
        </p>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          Seed
          <ColorPicker value={seedColor} onChange={handleColorChange}>
            <Button aria-label="Pick a color" isIconOnly size="sm">
              <ColorSwatch />
            </Button>
            <Popover>
              <DialogContent>
                <ColorEditor showFormatSelector={false} />
              </DialogContent>
            </Popover>
          </ColorPicker>
          <ColorField
            aria-label="Seed hex"
            value={seedColor}
            onChange={(color) => color && handleColorChange(color)}
            className="w-[100px]"
          >
            <Input className="font-mono text-xs" />
          </ColorField>
        </label>
        <SegmentedControl
          aria-label="Mode"
          selectedKeys={[mode]}
          onSelectionChange={handleModeChange}
        >
          <SegmentedControlItem id="light">light</SegmentedControlItem>
          <SegmentedControlItem id="dark">dark</SegmentedControlItem>
        </SegmentedControl>
      </div>
    </header>
  )
}

function parseSeed(seed: string): Color {
  try {
    return parseColor(seed)
  } catch {
    return parseColor(DEFAULT_SEED)
  }
}

// MARK: Ramp grid

interface RampRow {
  label: string
  note?: string
  href?: string
  colors: string[]
  labels: string[]
  markStep?: string
}

function RampGrid({ seed, mode }: { seed: string; mode: Mode }) {
  const surface = surfaceFor(mode)

  const rows = useMemo<RampRow[]>(() => {
    const result: RampRow[] = []

    for (const algorithm of ALGORITHMS) {
      const { colors } = algorithmRamp(algorithm.id, seed, mode)
      result.push({
        label: algorithm.label,
        colors,
        labels: [...STEPS],
        markStep: SOLID_STEP,
      })
      // Production never ships the kernel's raw dark output (see `shippedDarkColors`) —
      // show what dark mode actually renders directly under the kernel row.
      if (mode === 'dark') {
        result.push({
          label: `${algorithm.id} · shipped (reversed light)`,
          colors: shippedDarkColors(algorithm.id, seed),
          labels: [...STEPS],
          markStep: SOLID_STEP,
        })
      }
    }

    for (const source of REFERENCE_SOURCES) {
      const scales = mode === 'light' ? source.light : source.dark
      if (scales.length === 0) {
        result.push({
          label: source.label,
          note: source.notes ?? `No ${mode} ramps.`,
          href: source.url,
          colors: [],
          labels: [],
        })
        continue
      }
      const scale = nearestScale(source, mode, seed)
      if (!scale) continue
      const oriented = orientToMode(
        scaleColors(scale, source),
        source.stepLabels,
        mode,
      )
      result.push({
        label: `${source.label} · ${scale.name}`,
        href: source.url,
        colors: oriented.colors,
        labels: oriented.labels,
        markStep: source.stepLabels[solidIndex(source)],
      })
    }

    return result
  }, [seed, mode])

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle>Ramp comparison ({mode})</SectionTitle>
      <div className="flex flex-col gap-4">
        {rows.map((row) => (
          <RampView key={row.label} row={row} surface={surface} />
        ))}
      </div>
    </section>
  )
}

function RampView({ row, surface }: { row: RampRow; surface: string }) {
  if (row.colors.length === 0) {
    return (
      <div className="text-xs">
        <RampLabel row={row} />
        <p className="opacity-60">{row.note}</p>
      </div>
    )
  }

  const first3 = firstStepMeeting(row.colors, surface, 3)
  const first45 = firstStepMeeting(row.colors, surface, 4.5)

  return (
    <div className="flex flex-col gap-1">
      <RampLabel row={row} />
      <div className="flex gap-0.5">
        {row.colors.map((color, i) => {
          const label = row.labels[i] ?? String(i)
          const ratio = contrast(color, surface)
          const isMark = label === row.markStep
          const passes3 = i === first3
          const passes45 = i === first45
          return (
            <div
              key={label}
              className="flex flex-1 flex-col items-center gap-0.5"
            >
              <div
                title={`${label} · ${color} · L ${lightnessOf(color).toFixed(3)} · ${ratio.toFixed(2)}:1`}
                style={{
                  background: color,
                  height: 40,
                  width: '100%',
                  borderRadius: 4,
                  outline: isMark ? '2px solid currentColor' : undefined,
                  outlineOffset: 1,
                }}
              />
              <span style={{ fontSize: 9, opacity: 0.6 }}>{label}</span>
              <span
                style={{
                  fontSize: 9,
                  fontVariantNumeric: 'tabular-nums',
                  color: ratio >= 3 ? 'inherit' : undefined,
                  opacity: ratio >= 3 ? 1 : 0.45,
                  fontWeight: ratio >= 4.5 ? 700 : 400,
                  borderBottom: passes45
                    ? '2px solid #16a34a'
                    : passes3
                      ? '2px solid #ca8a04'
                      : undefined,
                }}
              >
                {ratio.toFixed(1)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RampLabel({ row }: { row: RampRow }) {
  return (
    <div className="text-xs font-medium">
      {row.href ? (
        <a
          href={row.href}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2"
        >
          {row.label}
        </a>
      ) : (
        row.label
      )}
    </div>
  )
}

// MARK: ΔE table

/** Nearest reference ramp to the seed across all sources (by ΔE at the solid step). */
function nearestReference(
  seed: string,
  mode: Mode,
): { label: string; colors: string[] } | null {
  let best: { label: string; colors: string[]; d: number } | null = null
  for (const source of REFERENCE_SOURCES) {
    const scale = nearestScale(source, mode, seed)
    if (!scale) continue
    const anchorLabel = source.stepLabels[solidIndex(source)]
    const anchor = anchorLabel ? scale.steps[anchorLabel] : undefined
    if (!anchor) continue
    const d = deltaE(seed, anchor)
    if (!best || d < best.d) {
      const { colors } = orientToMode(
        scaleColors(scale, source),
        source.stepLabels,
        mode,
      )
      best = { label: `${source.label} · ${scale.name}`, colors, d }
    }
  }
  return best ? { label: best.label, colors: best.colors } : null
}

function DeltaTable({ seed, mode }: { seed: string; mode: Mode }) {
  const { reference, rows } = useMemo(() => {
    const ref = nearestReference(seed, mode)
    if (!ref) return { reference: null, rows: [] }
    const data = ALGORITHMS.map((algorithm) => {
      const { steps } = algorithmRamp(algorithm.id, seed, mode)
      const { mean, max } = rampDeltaE(steps, ref.colors)
      return { algorithm: algorithm.label, mean, max }
    })
    return { reference: ref, rows: data }
  }, [seed, mode])

  if (!reference) return null

  return (
    <section className="flex flex-col gap-3">
      <SectionTitle>
        Each algorithm vs nearest reference ({reference.label}) — OKLab ΔE
      </SectionTitle>
      <table className="w-fit text-xs" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ opacity: 0.6 }}>
            <Th>algorithm</Th>
            <Th align="right">mean ΔE</Th>
            <Th align="right">max ΔE</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.algorithm}>
              <Td>{r.algorithm}</Td>
              <Td align="right">{r.mean.toFixed(3)}</Td>
              <Td align="right">{r.max.toFixed(3)}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

// MARK: Injection panels

function InjectionPanels({ seed, mode }: { seed: string; mode: Mode }) {
  const panels = useMemo(() => {
    const algoPanels = ALGORITHMS.map((algorithm) => {
      const { steps, onSolid } = algorithmRamp(algorithm.id, seed, mode)
      return { title: algorithm.label, style: accentVars(steps, onSolid) }
    })

    const ref = nearestReference(seed, mode)
    if (ref) {
      algoPanels.push({
        title: `reference · ${ref.label}`,
        style: accentVarsFromColors(ref.colors),
      })
    }
    return algoPanels
  }, [seed, mode])

  return (
    <section className="flex flex-col gap-3">
      <SectionTitle>Real components under each palette</SectionTitle>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {panels.map((panel) => (
          <div key={panel.title} className="flex flex-col gap-2">
            <div className="text-xs font-medium opacity-70">{panel.title}</div>
            <div
              style={panel.style}
              className="rounded-lg border border-border p-3"
            >
              <ComponentCluster />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// MARK: Surface levels

function SurfaceLevels({ seed, mode }: { seed: string; mode: Mode }) {
  const style = useMemo(() => {
    const { steps, onSolid } = algorithmRamp('oklch', seed, mode)
    return accentVars(steps, onSolid)
  }, [seed, mode])

  const surfaces = [
    { label: 'page (bg-bg)', className: 'bg-bg' },
    { label: 'muted (bg-muted)', className: 'bg-muted' },
    { label: 'card (bg-card)', className: 'bg-card' },
  ]

  return (
    <section className="flex flex-col gap-3" style={style}>
      <SectionTitle>Surface levels (oklch palette)</SectionTitle>
      <div className="grid gap-4 md:grid-cols-3">
        {surfaces.map((s) => (
          <div key={s.label} className="flex flex-col gap-2">
            <div className="text-xs font-medium opacity-70">{s.label}</div>
            <div
              className={`rounded-lg border border-border p-3 ${s.className}`}
            >
              <ComponentCluster />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// MARK: helpers

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-semibold opacity-80">{children}</h2>
}

function Th({
  children,
  align = 'left',
}: {
  children: React.ReactNode
  align?: 'left' | 'right'
}) {
  return (
    <th style={{ textAlign: align, padding: '2px 12px', fontWeight: 500 }}>
      {children}
    </th>
  )
}

function Td({
  children,
  align = 'left',
}: {
  children: React.ReactNode
  align?: 'left' | 'right'
}) {
  return (
    <td
      style={{
        textAlign: align,
        padding: '2px 12px',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {children}
    </td>
  )
}
