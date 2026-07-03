'use client'

import { useMemo, useState } from 'react'

import { measure, parseColor, relativeLuminance } from '@/lib/color-math'
import { cn } from '@/lib/utils'
import type { Ramp, StepRoles } from '@/data/schema'
import { ListBoxItem } from '@/ui/list-box'
import { Select, SelectContent, SelectTrigger } from '@/ui/select'

import { ModeSwitcher } from './mode-switcher'
import { SourceLinks } from './source-links'

interface StepRoleExplorerProps {
  stepRoles: StepRoles
  ramps: Ramp[]
  modes: string[]
}

function stepValue(ramp: Ramp | undefined, step: string, mode: string) {
  return ramp?.steps.find((s) => s.step === step)?.values[mode]
}

/** Live measurements that make sense for a step's role, from the shipped values. */
function measurementsFor(
  role: string,
  step: string,
  ramp: Ramp | undefined,
  mode: string,
): { label: string; fg: string; bg: string }[] {
  const value = stepValue(ramp, step, mode)
  if (!value || !ramp) return []
  const lower = role.toLowerCase()
  const on = (target: string) => stepValue(ramp, target, mode)
  if (lower.includes('text')) {
    return ['1', '2']
      .map((bg) => ({ label: `as text on step ${bg}`, fg: value, bg: on(bg)! }))
      .filter((pair) => pair.bg)
  }
  if (lower.includes('solid')) {
    return [
      { label: 'white text on it', fg: '#ffffff', bg: value },
      { label: 'black text on it', fg: '#000000', bg: value },
    ]
  }
  if (lower.includes('border') || lower.includes('separator')) {
    const bg = on('1')
    return bg ? [{ label: 'against step 1 (non-text)', fg: value, bg }] : []
  }
  return ['11', '12']
    .map((fg) => ({
      label: `step ${fg} text on it`,
      fg: on(fg)!,
      bg: value,
    }))
    .filter((pair) => pair.fg)
}

/** A tiny UI built entirely from the active scale; elements using the selected step light up. */
function ScaleVignette({
  ramp,
  mode,
  activeStep,
}: {
  ramp: Ramp
  mode: string
  activeStep: string
}) {
  const v = (step: string) => stepValue(ramp, step, mode)
  const uses = (...steps: string[]) =>
    steps.includes(activeStep)
      ? { boxShadow: `0 0 0 2px var(--color-border-focus)` }
      : undefined
  // Bright solids (yellow, amber, sky…) take dark text — same rule Radix documents.
  const onSolid = (step: string) => {
    const parsed = v(step) ? parseColor(v(step)!) : null
    return parsed && relativeLuminance(parsed) > 0.42 ? '#000000e0' : '#ffffff'
  }

  return (
    <div
      className="rounded-lg border p-5 transition-colors"
      style={{ backgroundColor: v('1'), ...uses('1') }}
    >
      <div
        className="rounded-md p-4 transition-shadow"
        style={{
          backgroundColor: v('2'),
          border: `1px solid ${v('6') ?? 'transparent'}`,
          ...uses('2', '6'),
        }}
      >
        <p
          className="text-sm font-medium transition-shadow"
          style={{ color: v('12'), ...uses('12') }}
        >
          Every color, one scale model
        </p>
        <p
          className="mt-1 text-xs transition-shadow"
          style={{ color: v('11'), ...uses('11') }}
        >
          This vignette is painted only with {ramp.name} steps in {mode} mode.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className="rounded-md px-3 py-1.5 text-xs font-medium transition-shadow"
            style={{
              backgroundColor: v('9'),
              color: onSolid('9'),
              ...uses('9'),
            }}
          >
            Solid · 9
          </span>
          <span
            className="rounded-md px-3 py-1.5 text-xs font-medium transition-shadow"
            style={{
              backgroundColor: v('10'),
              color: onSolid('10'),
              ...uses('10'),
            }}
          >
            Hovered · 10
          </span>
          <span
            className="rounded-md px-3 py-1.5 text-xs transition-shadow"
            style={{
              backgroundColor: v('3'),
              color: v('11'),
              border: `1px solid ${v('7') ?? 'transparent'}`,
              ...uses('3', '7'),
            }}
          >
            Component · 3/7
          </span>
          <span
            className="rounded-md px-3 py-1.5 text-xs transition-shadow"
            style={{
              backgroundColor: v('5'),
              color: v('11'),
              border: `1px solid ${v('8') ?? 'transparent'}`,
              ...uses('5', '8'),
            }}
          >
            Active · 5/8
          </span>
        </div>
      </div>
    </div>
  )
}

/** The scale model as a playground: pick a scale, click a step, see its role and live numbers. */
export function StepRoleExplorer({
  stepRoles,
  ramps,
  modes,
}: StepRoleExplorerProps) {
  const scales = useMemo(
    () =>
      ramps.filter(
        (ramp) => ramp.kind === 'chromatic' || ramp.kind === 'neutral',
      ),
    [ramps],
  )
  const [scaleName, setScaleName] = useState(
    () => scales.find((r) => r.name === 'blue')?.name ?? scales[0]?.name ?? '',
  )
  const [mode, setMode] = useState(modes[0] ?? 'light')
  const [activeStep, setActiveStep] = useState(
    stepRoles.steps[8]?.step ?? stepRoles.steps[0]!.step,
  )

  const ramp = scales.find((r) => r.name === scaleName)
  const active =
    stepRoles.steps.find((s) => s.step === activeStep) ?? stepRoles.steps[0]!
  const measurements = measurementsFor(active.role, active.step, ramp, mode)
    .map((pair) => ({ ...pair, result: measure(pair.fg, pair.bg) }))
    .filter((pair) => pair.result !== null)

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <Select
          aria-label="Scale"
          selectedKey={scaleName}
          onSelectionChange={(key) => setScaleName(String(key))}
          className="w-44"
        >
          <SelectTrigger size="sm" variant="default" />
          <SelectContent items={scales}>
            {(item) => (
              <ListBoxItem key={item.name} id={item.name} textValue={item.name}>
                <span className="flex items-center gap-2">
                  <span
                    className="size-3 rounded-full"
                    style={{
                      backgroundColor: stepValue(item, '9', mode),
                    }}
                  />
                  {item.name}
                </span>
              </ListBoxItem>
            )}
          </SelectContent>
        </Select>
        <ModeSwitcher modes={modes} mode={mode} onChange={setMode} />
      </div>

      <div
        role="radiogroup"
        aria-label="Scale step"
        className="mt-5 flex overflow-hidden rounded-lg border"
      >
        {stepRoles.steps.map((stepRole) => {
          const value = stepValue(ramp, stepRole.step, mode)
          const parsed = value ? parseColor(value) : null
          const lightLabel = parsed ? relativeLuminance(parsed) < 0.3 : false
          const selected = stepRole.step === activeStep
          return (
            <button
              key={stepRole.step}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`Step ${stepRole.step}: ${stepRole.role}`}
              onClick={() => setActiveStep(stepRole.step)}
              className={cn(
                'relative h-16 flex-1 cursor-pointer transition-[flex] outline-none sm:h-20',
                selected && 'z-10 ring-2 ring-border-focus ring-inset',
                'focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-inset',
              )}
              style={{ backgroundColor: value }}
            >
              <span
                className={cn(
                  'absolute inset-x-0 bottom-1 text-center font-mono text-[10px]',
                  lightLabel ? 'text-white/90' : 'text-black/60',
                )}
              >
                {stepRole.step}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border p-5">
          <p className="font-mono text-[11px] tracking-widest text-fg-muted uppercase">
            Step {active.step}
          </p>
          <h3 className="mt-1.5 text-lg font-medium">{active.role}</h3>
          {active.description && (
            <p className="mt-1.5 text-sm text-fg-muted">{active.description}</p>
          )}
          {measurements.length > 0 && (
            <dl className="mt-4 flex flex-col gap-1.5 border-t pt-4">
              {measurements.map((pair) => (
                <div
                  key={pair.label}
                  className="flex items-baseline justify-between gap-3"
                >
                  <dt className="flex items-center gap-2 text-xs text-fg-muted">
                    <span
                      className="inline-flex h-5 w-8 items-center justify-center rounded-sm border text-[10px] font-medium"
                      style={{ backgroundColor: pair.bg, color: pair.fg }}
                    >
                      Aa
                    </span>
                    {pair.label}
                  </dt>
                  <dd className="font-mono text-xs">
                    Lc {pair.result!.apca.toFixed(1)} ·{' '}
                    {pair.result!.wcag.toFixed(2)}:1
                  </dd>
                </div>
              ))}
              <p className="mt-1 text-[10px] text-fg-muted">
                measured from shipped values, not documentation
              </p>
            </dl>
          )}
        </div>
        {ramp && (
          <ScaleVignette ramp={ramp} mode={mode} activeStep={activeStep} />
        )}
      </div>

      {stepRoles.note && (
        <p className="mt-5 max-w-3xl text-sm text-fg-muted">{stepRoles.note}</p>
      )}
      <SourceLinks sources={stepRoles.sources} className="mt-2" />
    </div>
  )
}
