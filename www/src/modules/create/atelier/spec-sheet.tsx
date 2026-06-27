'use client'

import { type ReactNode, useMemo } from 'react'

import { cn } from '@/registry/lib/utils'
import {
  DEFAULT_COLOR_CONFIG,
  PALETTE_ORDER,
  resolveColorConfig,
} from '@/registry/theme'

import { useDesignSystem } from '../preset'
import * as T from './tokens'

/* ----------------------------------------------------------------------------
 * The spec sheet — the system as an ownable artifact. Where the preview shows
 * components, this shows the *decisions*: ramps, type scale, radius, spacing and
 * elevation, all live off the same edited state. Nothing here is in the shipped
 * builder; it's the "see your whole system at once" view.
 * -------------------------------------------------------------------------- */

export function SpecSheet() {
  const { designSystem } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const resolved = useMemo(() => resolveColorConfig(config), [config])

  const radiusFactor =
    Number.parseFloat(designSystem.tokens[T.RADIUS_FACTOR_VAR] ?? '1') || 1
  const base =
    Number.parseFloat(designSystem.tokens[T.TYPE_BASE_VAR] ?? '16') || 16
  const ratio =
    Number.parseFloat(designSystem.tokens[T.TYPE_SCALE_VAR] ?? '1.25') || 1.25
  const spacingScale =
    Number.parseFloat(designSystem.tokens[T.SPACING_SCALE_VAR] ?? '1') || 1
  const shadow = Number.parseFloat(
    designSystem.tokens[T.SHADOW_INTENSITY_VAR] ?? '0.5',
  )

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex max-w-3xl flex-col gap-5 p-6 pt-16">
        <SpecCard title="Palette" hint="Generated tonal ramps">
          <div className="flex flex-col gap-2">
            {PALETTE_ORDER.map((palette) => {
              const ramp = resolved.light[palette]
              if (!ramp) return null
              return (
                <div key={palette} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 truncate text-xs text-fg-muted capitalize">
                    {palette}
                  </span>
                  <div className="flex flex-1 overflow-hidden rounded-md ring-1 ring-border/60">
                    {Object.entries(ramp).map(([step, val]) => (
                      <div
                        key={step}
                        className="h-7 flex-1"
                        style={{ backgroundColor: val }}
                        title={`--${palette}-${step}: ${val}`}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </SpecCard>

        <SpecCard
          title="Type scale"
          hint={`${base}px base · ${ratio.toFixed(2)} ratio`}
        >
          <div className="flex flex-col gap-3">
            {[
              { label: 'Display', step: 4, weight: 700, font: 'font-heading' },
              { label: 'Heading', step: 2, weight: 600, font: 'font-heading' },
              { label: 'Title', step: 1, weight: 600, font: 'font-heading' },
              { label: 'Body', step: 0, weight: 400, font: 'font-body' },
              { label: 'Caption', step: -1, weight: 400, font: 'font-body' },
            ].map(({ label, step, weight, font }) => {
              const size = Math.round(base * ratio ** step)
              return (
                <div
                  key={label}
                  className="flex items-baseline gap-4 border-b border-border/50 pb-2 last:border-0"
                >
                  <span className="w-16 shrink-0 text-[10px] tracking-wider text-fg-muted uppercase">
                    {label}
                  </span>
                  <span
                    className={cn('min-w-0 flex-1 truncate text-fg', font)}
                    style={{
                      fontSize: size,
                      fontWeight: weight,
                      lineHeight: 1.1,
                    }}
                  >
                    The quick brown fox
                  </span>
                  <span className="shrink-0 font-mono text-xs text-fg-muted tabular-nums">
                    {size}px
                  </span>
                </div>
              )
            })}
          </div>
        </SpecCard>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <SpecCard title="Radius" hint={`${radiusFactor.toFixed(2)}× factor`}>
            <div className="flex flex-wrap items-end gap-3">
              {[
                { label: 'sm', r: 4 },
                { label: 'md', r: 8 },
                { label: 'lg', r: 12 },
                { label: 'xl', r: 16 },
              ].map(({ label, r }) => (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <div
                    className="size-12 border-2 border-primary/40 bg-primary/10"
                    style={{ borderRadius: r * radiusFactor }}
                  />
                  <span className="font-mono text-[10px] text-fg-muted">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </SpecCard>

          <SpecCard title="Spacing" hint={`${spacingScale.toFixed(2)}× scale`}>
            <div className="flex flex-col gap-1.5">
              {[1, 2, 3, 4, 6, 8].map((u) => (
                <div key={u} className="flex items-center gap-2">
                  <div
                    className="h-2.5 rounded-sm bg-primary/70"
                    style={{ width: u * 4 * spacingScale * 2 }}
                  />
                  <span className="font-mono text-[10px] text-fg-muted tabular-nums">
                    {Math.round(u * 4 * spacingScale)}px
                  </span>
                </div>
              ))}
            </div>
          </SpecCard>
        </div>

        <SpecCard
          title="Elevation"
          hint={`${Math.round((Number.isFinite(shadow) ? shadow : 0.5) * 100)}% intensity`}
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((level) => {
              const blur = level * 6
              const y = level * 2
              const alpha =
                (Number.isFinite(shadow) ? shadow : 0.5) * (0.06 + level * 0.03)
              return (
                <div
                  key={level}
                  className="flex h-16 items-center justify-center rounded-lg border bg-card text-xs text-fg-muted"
                  style={{
                    boxShadow: `0 ${y}px ${blur}px rgba(0,0,0,${alpha.toFixed(3)})`,
                  }}
                >
                  level {level}
                </div>
              )
            })}
          </div>
        </SpecCard>
      </div>
    </div>
  )
}

function SpecCard({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-fg">{title}</h3>
        {hint && (
          <span className="font-mono text-[10px] text-fg-muted">{hint}</span>
        )}
      </div>
      {children}
    </section>
  )
}
