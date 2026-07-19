import { useMemo } from 'react'

import { STEPS, type Theme } from '@dotui/colors'

import { resolveColorConfigCached } from '@/lib/resolve-color'
import { DEFAULT_COLOR_CONFIG, PALETTE_ORDER } from '@/registry/theme'

/**
 * Thin ramp viewer for the default theme. The real acceptance playground
 * (SPEC.md T8 — references, meters, CVD, compositions) replaces this in a
 * later phase.
 */
export function ColorPlayground() {
  const theme = useMemo(
    () => resolveColorConfigCached(DEFAULT_COLOR_CONFIG),
    [],
  )

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-10">
      <header>
        <h1 className="text-lg font-semibold">Color engine — default theme</h1>
        <p className="text-xs text-fg-muted">
          Both modes are independent engine passes; 12 steps per scale.
        </p>
      </header>
      <ModeRamps label="Light" mode={theme.light} />
      <ModeRamps label="Dark" mode={theme.dark} />
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold">Charts — categorical</h2>
        <div className="flex overflow-hidden rounded-md">
          {theme.charts.light.categorical.map((color) => (
            <div
              key={color}
              className="h-10 flex-1"
              style={{ background: color }}
              title={color}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

function ModeRamps({ label, mode }: { label: string; mode: Theme['light'] }) {
  return (
    <section
      className="flex flex-col gap-3 rounded-xl border p-4"
      style={{ background: mode.background }}
    >
      <h2
        className="text-sm font-semibold"
        style={{ color: mode.scales.neutral?.['950'] }}
      >
        {label}
      </h2>
      {PALETTE_ORDER.map((palette) => {
        const scale = mode.scales[palette]
        if (!scale) return null
        return (
          <div key={palette} className="flex flex-col gap-1">
            <span
              className="text-xs capitalize"
              style={{ color: mode.scales.neutral?.['900'] }}
            >
              {palette}
            </span>
            <div className="flex overflow-hidden rounded-md">
              {STEPS.map((step) => (
                <div
                  key={step}
                  className="h-9 flex-1"
                  style={{ background: scale[step] }}
                  title={`${palette}-${step}: ${scale[step]}`}
                />
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}
