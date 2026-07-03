'use client'

import { useState } from 'react'

import { parseColor, relativeLuminance } from '@/lib/color-math'
import type { FocusRing, Ramp } from '@/data/schema'
import { Switch } from '@/ui/switch'

import { ModeSwitcher } from './mode-switcher'
import { SourceLinks } from './source-links'

interface FocusAnatomyProps {
  focusRing: FocusRing
  ramps: Ramp[]
  modes: string[]
}

function stepValue(ramp: Ramp | undefined, step: string, mode: string) {
  return ramp?.steps.find((s) => s.step === step)?.values[mode]
}

/** The focus ring rebuilt live from shipped values, with its construction annotated. */
export function FocusAnatomy({ focusRing, ramps, modes }: FocusAnatomyProps) {
  const [mode, setMode] = useState(modes[0] ?? 'light')
  const [focused, setFocused] = useState(true)

  // The ring color scale: Radix remaps accent → focus, so the default accent
  // (blue) is what the shipped ring resolves to.
  const ramp =
    ramps.find((r) => r.name === 'blue' && r.kind === 'chromatic') ??
    ramps.find((r) => r.kind === 'chromatic')
  const ringColor = focusRing.step
    ? stepValue(ramp, focusRing.step, mode)
    : undefined
  const solid = stepValue(ramp, '9', mode)
  const page = stepValue(ramp, '1', mode)
  const solidParsed = solid ? parseColor(solid) : null
  const onSolid =
    solidParsed && relativeLuminance(solidParsed) > 0.42
      ? '#000000e0'
      : '#ffffff'

  const ringStyle =
    focused && ringColor
      ? focusRing.technique === 'outline'
        ? {
            outline: `${focusRing.width} solid ${ringColor}`,
            outlineOffset: focusRing.offset ?? undefined,
          }
        : { boxShadow: `0 0 0 ${focusRing.width} ${ringColor}` }
      : undefined

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <Switch isSelected={focused} onChange={setFocused}>
          Focused
        </Switch>
        <ModeSwitcher modes={modes} mode={mode} onChange={setMode} />
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div
          className="flex min-h-44 items-center justify-center rounded-lg border"
          style={{ backgroundColor: page }}
        >
          <button
            type="button"
            tabIndex={-1}
            className="cursor-default rounded-md px-5 py-2.5 text-sm font-medium"
            style={{ backgroundColor: solid, color: onSolid, ...ringStyle }}
          >
            Button
          </button>
        </div>

        <dl className="flex flex-col justify-center gap-2.5 rounded-lg border p-5">
          <div className="grid grid-cols-[6.5rem_1fr] items-baseline gap-3">
            <dt className="font-mono text-[11px] text-fg-muted">technique</dt>
            <dd className="font-mono text-xs">
              {focusRing.technique} {focusRing.width}
              {focusRing.offset ? ` · offset ${focusRing.offset}` : ''}
            </dd>
          </div>
          {focusRing.step && (
            <div className="grid grid-cols-[6.5rem_1fr] items-baseline gap-3">
              <dt className="font-mono text-[11px] text-fg-muted">color</dt>
              <dd className="flex items-center gap-2 font-mono text-xs">
                <span
                  className="size-4 rounded-sm border"
                  style={{ backgroundColor: ringColor }}
                />
                step {focusRing.step} of the focus scale — {ringColor}
              </dd>
            </div>
          )}
          <SourceLinks sources={focusRing.sources} className="mt-1.5" />
        </dl>
      </div>

      {ramp && focusRing.step && (
        <div className="mt-5">
          <p className="text-xs text-fg-muted">
            The focus scale mirrors the active accent scale step for step —
            shown here for the default accent ({ramp.name}). The ring re-points
            automatically when the accent changes.
          </p>
          <div className="mt-2 flex overflow-hidden rounded-md border">
            {ramp.steps.map((step) => {
              const isRing = step.step === focusRing.step
              return (
                <span
                  key={step.step}
                  className="relative h-10 flex-1"
                  style={{ backgroundColor: step.values[mode] }}
                >
                  {isRing && (
                    <span className="absolute inset-0 z-10 ring-2 ring-fg ring-inset" />
                  )}
                  <span className="absolute inset-x-0 bottom-0.5 text-center font-mono text-[9px] text-black/50">
                    {step.step}
                  </span>
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
