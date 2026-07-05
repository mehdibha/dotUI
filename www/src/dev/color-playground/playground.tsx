import { useEffect, useMemo, useState } from 'react'
import { useTheme } from 'starter-themes'

import { SOLID_STEP, solveScale, V2_STEPS, type V2Step } from '@dotui/colors/v2'

import { resolveColorConfig } from '@/registry/theme/primitives'

import { ComponentCluster } from './cluster'
import { REFERENCE_SOURCES } from './data'
import { accentVars, accentVarsFromColors } from './inject'
import {
  contrast,
  firstStepMeeting,
  lightnessOf,
  type Mode,
  nearestScale,
  orientToMode,
  rampDeltaE,
  scaleColors,
  solidIndex,
  surfaceFor,
  targetsFor,
} from './lib'

const DEFAULT_SEED = '#635bff'

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
  return (
    <header className="flex flex-wrap items-center gap-4">
      <div>
        <h1 className="text-lg font-semibold">Color system v2 — playground</h1>
        <p className="text-xs opacity-60">
          Dev-only. Judges the v2 solver against the current engine and industry
          references.
        </p>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          Seed
          <input
            type="color"
            value={normalizeHex(seed)}
            onChange={(e) => setSeed(e.target.value)}
            style={{
              width: 36,
              height: 28,
              padding: 0,
              border: 'none',
              background: 'none',
            }}
          />
          <input
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            spellCheck={false}
            style={{
              width: 100,
              padding: '4px 8px',
              fontFamily: 'monospace',
              fontSize: 12,
              border: '1px solid currentColor',
              borderRadius: 6,
              background: 'transparent',
              color: 'inherit',
            }}
          />
        </label>
        <div
          style={{
            display: 'flex',
            border: '1px solid currentColor',
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          {(['light', 'dark'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              style={{
                padding: '4px 12px',
                fontSize: 12,
                background: mode === m ? 'currentColor' : 'transparent',
                color:
                  mode === m ? (m === 'dark' ? '#111' : '#fff') : 'inherit',
                mixBlendMode: mode === m ? 'difference' : undefined,
                cursor: 'pointer',
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}

function normalizeHex(value: string): string {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#635bff'
}

// MARK: Ramp grid

interface RampRow {
  label: string
  note?: string
  href?: string
  colors: string[]
  labels: string[]
  markStep?: string
  targets?: Record<string, number>
  achieved?: Record<string, number>
}

function RampGrid({ seed, mode }: { seed: string; mode: Mode }) {
  const surface = surfaceFor(mode)

  const rows = useMemo<RampRow[]>(() => {
    const result: RampRow[] = []

    const solved = solveScale({ seed, mode, surface })
    result.push({
      label: 'v2 solver',
      colors: V2_STEPS.map((s) => solved.steps[s]),
      labels: [...V2_STEPS],
      markStep: SOLID_STEP,
      targets: targetsFor(mode),
      achieved: solved.achieved,
    })

    const currentColors = currentEngineRamp(seed, mode)
    result.push({
      label:
        mode === 'dark'
          ? 'current engine (dark = reversed light)'
          : 'current engine',
      colors: currentColors,
      labels: [...V2_STEPS],
      markStep: SOLID_STEP,
    })

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
  }, [seed, mode, surface])

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle>Ramp comparison ({mode})</SectionTitle>
      <div className="flex flex-col gap-4">
        {rows.map((row) => (
          <Ramp key={row.label} row={row} surface={surface} />
        ))}
      </div>
    </section>
  )
}

function Ramp({ row, surface }: { row: RampRow; surface: string }) {
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
          const target = row.targets?.[label]
          const achieved = row.achieved?.[label]
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
              {target !== undefined && (
                <span
                  style={{ fontSize: 8, opacity: 0.5 }}
                  title="target vs achieved"
                >
                  →{target.toFixed(1)}
                  {achieved !== undefined && achieved !== 1
                    ? ` (${achieved.toFixed(1)})`
                    : ''}
                </span>
              )}
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

function DeltaTable({ seed, mode }: { seed: string; mode: Mode }) {
  const rows = useMemo(() => {
    const surface = surfaceFor(mode)
    const solved = solveScale({ seed, mode, surface })
    const v2 = solved.steps

    return REFERENCE_SOURCES.flatMap((source) => {
      const scale = nearestScale(source, mode, seed)
      if (!scale) return []
      const { colors } = orientToMode(
        scaleColors(scale, source),
        source.stepLabels,
        mode,
      )
      const { mean, max } = rampDeltaE(v2 as Record<V2Step, string>, colors)
      return [{ source: source.label, scale: scale.name, mean, max }]
    })
  }, [seed, mode])

  if (rows.length === 0) return null

  return (
    <section className="flex flex-col gap-3">
      <SectionTitle>v2 vs nearest reference — OKLab ΔE</SectionTitle>
      <table className="w-fit text-xs" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ opacity: 0.6 }}>
            <Th>source</Th>
            <Th>scale</Th>
            <Th align="right">mean ΔE</Th>
            <Th align="right">max ΔE</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.source}>
              <Td>{r.source}</Td>
              <Td>{r.scale}</Td>
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
  const surface = surfaceFor(mode)

  const panels = useMemo(() => {
    const solved = solveScale({ seed, mode, surface })
    const v2Style = accentVars(solved.steps, solved.contrast)

    const current = currentEngineRamp(seed, mode)
    const currentStyle = accentVarsFromColors(current)

    const refSource = REFERENCE_SOURCES.find(
      (s) => nearestScale(s, mode, seed) !== null,
    )
    const refScale = refSource ? nearestScale(refSource, mode, seed) : null
    const refStyle =
      refSource && refScale
        ? accentVarsFromColors(
            orientToMode(scaleColors(refScale, refSource), [], mode).colors,
          )
        : null

    return [
      { title: 'v2', style: v2Style },
      { title: 'current engine', style: currentStyle },
      {
        title: refScale
          ? `reference · ${refSource?.label} ${refScale.name}`
          : 'reference (none)',
        style: refStyle,
      },
    ]
  }, [seed, mode, surface])

  return (
    <section className="flex flex-col gap-3">
      <SectionTitle>Real components under each palette</SectionTitle>
      <div className="grid gap-4 md:grid-cols-3">
        {panels.map((panel) => (
          <div key={panel.title} className="flex flex-col gap-2">
            <div className="text-xs font-medium opacity-70">{panel.title}</div>
            {panel.style ? (
              <div
                style={panel.style}
                className="rounded-lg border border-border p-3"
              >
                <ComponentCluster />
              </div>
            ) : (
              <p className="text-xs opacity-60">No reference for this mode.</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

// MARK: Surface levels

function SurfaceLevels({ seed, mode }: { seed: string; mode: Mode }) {
  const surface = surfaceFor(mode)
  const style = useMemo(() => {
    const solved = solveScale({ seed, mode, surface })
    return accentVars(solved.steps, solved.contrast)
  }, [seed, mode, surface])

  const surfaces = [
    { label: 'page (bg-bg)', className: 'bg-bg' },
    { label: 'muted (bg-muted)', className: 'bg-muted' },
    { label: 'card (bg-card)', className: 'bg-card' },
  ]

  return (
    <section className="flex flex-col gap-3" style={style}>
      <SectionTitle>Surface levels (v2 palette)</SectionTitle>
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

/** Current shipping engine's accent ramp for the mode (dark = reversed light). */
function currentEngineRamp(seed: string, mode: Mode): string[] {
  try {
    const resolved = resolveColorConfig({
      algorithm: 'oklch',
      seeds: { neutral: '#808080', accent: seed },
    })
    const ramp = (mode === 'light' ? resolved.light : resolved.dark).accent
    return resolved.steps
      .map((step) => ramp?.[step])
      .filter(Boolean) as string[]
  } catch {
    // Fallback: flat gray ramp so the row still renders on bad seed input.
    return V2_STEPS.map(() => '#808080')
  }
}

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
