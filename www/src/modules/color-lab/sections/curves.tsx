import { useMemo, useState, type ReactNode } from 'react'

import {
  referenceSystems,
  scaleByRole,
  type ScaleRole,
  type Step,
} from '../data'
import type { Mode } from '../page'
import { CurvePlot, type CurveSeries } from '../primitives'

/** OKLCH anatomy: lightness ramp, chroma arc, and hue drift of every system's
    scale for the selected family, overlaid on shared axes. Hovering a system
    in the legend solos its curve. */
export function CurvesSection({
  mode,
  family,
}: {
  mode: Mode
  family: ScaleRole
}) {
  const [pinned, setPinned] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const solo = hovered ?? pinned

  const rows = useMemo(
    () =>
      referenceSystems
        .map((system) => {
          const scale = scaleByRole(system, family)
          if (!scale) return null
          const steps = mode === 'dark' && scale.dark ? scale.dark : scale.light
          return { system, steps }
        })
        .filter(
          (
            r,
          ): r is {
            system: (typeof referenceSystems)[number]
            steps: Step[]
          } => Boolean(r && r.steps.length > 1),
        ),
    [mode, family],
  )

  const toSeries = (
    value: (step: Step, steps: Step[]) => number,
  ): CurveSeries[] =>
    rows.map(({ system, steps }) => ({
      id: system.id,
      label: system.name,
      muted: solo !== null && solo !== system.id,
      points: steps.map((step, index) => ({
        x: index / (steps.length - 1),
        y: value(step, steps),
        color: step.hex,
      })),
    }))

  const lightness = toSeries((s) => s.oklch.l)
  const chroma = toSeries((s) => s.oklch.c)
  const maxChroma = Math.max(
    0.2,
    ...chroma.flatMap((s) => s.points.map((p) => p.y)),
  )
  // Hue plotted as deviation from each scale's chroma-weighted mean — absolute
  // hue differs across systems by design; drift within a scale is the signal.
  const hueDeviation = toSeries((s, steps) => {
    const usable = steps.filter((st) => st.oklch.c > 0.02)
    if (usable.length < 2 || s.oklch.c <= 0.02) return 0
    let x = 0
    let y = 0
    for (const st of usable) {
      x += Math.cos((st.oklch.h * Math.PI) / 180)
      y += Math.sin((st.oklch.h * Math.PI) / 180)
    }
    const mean = (Math.atan2(y, x) * 180) / Math.PI
    let d = s.oklch.h - mean
    while (d > 180) d -= 360
    while (d < -180) d += 360
    return Math.max(-25, Math.min(25, d))
  })

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-1.5 text-xs">
        <button
          type="button"
          onClick={() => setPinned(null)}
          className={`rounded-md px-2 py-1 ${solo === null ? 'bg-neutral-100 font-medium dark:bg-neutral-900' : 'text-neutral-400 dark:text-neutral-500'}`}
        >
          All systems
        </button>
        {rows.map(({ system }) => (
          <button
            key={system.id}
            type="button"
            onMouseEnter={() => setHovered(system.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setPinned(pinned === system.id ? null : system.id)}
            className={`rounded-md px-2 py-1 ${
              solo === system.id
                ? 'bg-neutral-100 font-medium dark:bg-neutral-900'
                : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
            }`}
          >
            {system.name}
          </button>
        ))}
        <span className="ml-2 rounded-md border border-dashed border-neutral-300 px-2 py-1 text-neutral-400 dark:border-neutral-700 dark:text-neutral-500">
          dotUI Engine — pending
        </span>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <Plot title="Lightness" note="smooth, monotonic, full range">
          <CurvePlot
            series={lightness}
            yDomain={[0, 1]}
            formatY={(v) => v.toFixed(1)}
          />
        </Plot>
        <Plot title="Chroma" note="a deliberate arc — where does it peak?">
          <CurvePlot
            series={chroma}
            yDomain={[0, Math.ceil(maxChroma * 20) / 20]}
            formatY={(v) => v.toFixed(2)}
          />
        </Plot>
        <Plot
          title="Hue drift"
          note="deviation from the scale's mean hue, in degrees"
        >
          <CurvePlot
            series={hueDeviation}
            yDomain={[-25, 25]}
            formatY={(v) => `${v > 0 ? '+' : ''}${v.toFixed(0)}°`}
          />
        </Plot>
      </div>

      <div className="mt-12">
        <p className="text-[13px] font-medium">Cross-hue alignment</p>
        <p className="mb-4 text-[11px] text-neutral-400 dark:text-neutral-500">
          all five scales of each system, lightness overlaid — a tight bundle
          means step N reads as the same weight in every hue; a fan means
          swapping hues shifts the whole UI
        </p>
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {referenceSystems.map((system) => (
            <div key={system.id}>
              <p className="mb-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {system.name}
              </p>
              <CurvePlot
                height={130}
                series={system.scales.map((scale) => {
                  const steps =
                    mode === 'dark' && scale.dark ? scale.dark : scale.light
                  return {
                    id: scale.id,
                    label: scale.name,
                    points: steps.map((step, index) => ({
                      x: index / Math.max(1, steps.length - 1),
                      y: step.oklch.l,
                      color: step.hex,
                    })),
                  }
                })}
                yDomain={[0, 1]}
                formatY={(v) => v.toFixed(1)}
                yTicks={2}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Plot({
  title,
  note,
  children,
}: {
  title: string
  note: string
  children: ReactNode
}) {
  return (
    <div>
      <p className="text-[13px] font-medium">{title}</p>
      <p className="mb-2 text-[11px] text-neutral-400 dark:text-neutral-500">
        {note}
      </p>
      {children}
    </div>
  )
}
