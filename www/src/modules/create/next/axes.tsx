'use client'

import type { ReactNode } from 'react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { Slider, SliderControl } from '@/registry/ui/slider'
import { Switch } from '@/registry/ui/switch'

import { useDesignSystem } from '../preset'
import { NEXT_DEFAULTS, NEXT_TOKENS } from './ai'

/* ----------------------------------------------------------------------------
 * Shared inspector primitives + the new foundation axes. Each new axis writes a
 * namespaced `--next-*` token through the same `useDesignSystem()` the rest of
 * the builder uses, so the value round-trips through the shared preset URL.
 * -------------------------------------------------------------------------- */

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-fg-muted">{label}</span>
      {children}
      {hint && <p className="text-xs text-fg-muted/60">{hint}</p>}
    </div>
  )
}

interface Option<T extends string> {
  value: T
  label: string
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T
  onChange: (value: T) => void
  options: Option<T>[]
  ariaLabel: string
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex gap-0.5 rounded-md bg-neutral p-0.5"
    >
      {options.map((opt) => (
        <ButtonPrimitives.Button
          key={opt.value}
          onPress={() => onChange(opt.value)}
          className={cn(
            'flex-1 rounded px-2 py-1 text-xs focus-reset transition-colors focus-visible:focus-ring',
            opt.value === value
              ? 'bg-card font-medium text-fg shadow-sm'
              : 'text-fg-muted hover:text-fg',
          )}
        >
          {opt.label}
        </ButtonPrimitives.Button>
      ))}
    </div>
  )
}

export function Pills<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T
  onChange: (value: T) => void
  options: Option<T>[]
  ariaLabel: string
}) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <ButtonPrimitives.Button
          key={opt.value}
          onPress={() => onChange(opt.value)}
          className={cn(
            'rounded-md border px-2.5 py-1 text-xs focus-reset transition-colors focus-visible:focus-ring',
            opt.value === value
              ? 'border-primary/40 bg-primary/10 text-primary'
              : 'text-fg-muted hover:bg-neutral hover:text-fg',
          )}
        >
          {opt.label}
        </ButtonPrimitives.Button>
      ))}
    </div>
  )
}

/* ------------------------------ Token-bound controls ----------------------- */

function useToken(token: string, fallback: string) {
  const { designSystem, setToken } = useDesignSystem()
  const value = designSystem.tokens[token] ?? fallback
  return [value, (v: string) => setToken(token, v)] as const
}

function TokenSegmented<T extends string>({
  token,
  fallback,
  label,
  hint,
  options,
}: {
  token: string
  fallback: string
  label: string
  hint?: string
  options: Option<T>[]
}) {
  const [value, set] = useToken(token, fallback)
  return (
    <Field label={label} hint={hint}>
      <Segmented<T>
        ariaLabel={label}
        value={value as T}
        onChange={set}
        options={options}
      />
    </Field>
  )
}

function TokenPills<T extends string>({
  token,
  fallback,
  label,
  hint,
  options,
}: {
  token: string
  fallback: string
  label: string
  hint?: string
  options: Option<T>[]
}) {
  const [value, set] = useToken(token, fallback)
  return (
    <Field label={label} hint={hint}>
      <Pills<T>
        ariaLabel={label}
        value={value as T}
        onChange={set}
        options={options}
      />
    </Field>
  )
}

function TokenSlider({
  token,
  fallback,
  label,
  min,
  max,
  step,
  format,
}: {
  token: string
  fallback: string
  label: string
  min: number
  max: number
  step: number
  format: (v: number) => string
}) {
  const [value, set] = useToken(token, fallback)
  const numeric = Number.parseFloat(value)
  const current = Number.isFinite(numeric)
    ? numeric
    : Number.parseFloat(fallback)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-fg-muted">{label}</span>
        <span className="text-xs font-medium text-fg tabular-nums">
          {format(current)}
        </span>
      </div>
      <Slider
        aria-label={label}
        value={current}
        minValue={min}
        maxValue={max}
        step={step}
        onChange={(v) => set(String(Array.isArray(v) ? v[0] : v))}
      >
        <SliderControl />
      </Slider>
    </div>
  )
}

/* ---------------------------------- New axes -------------------------------- */

export function TypographyDepth() {
  const [scale] = useToken(NEXT_TOKENS.typeScale, NEXT_DEFAULTS.typeScale)
  const [weight] = useToken(
    NEXT_TOKENS.headingWeight,
    NEXT_DEFAULTS.headingWeight,
  )
  const [tracking] = useToken(NEXT_TOKENS.tracking, NEXT_DEFAULTS.tracking)
  const scaleNum = Number.parseFloat(scale) || 1.25
  const size = Math.round(15 * scaleNum * scaleNum)
  return (
    <div className="flex flex-col gap-5">
      <TokenPills
        token={NEXT_TOKENS.typeScale}
        fallback={NEXT_DEFAULTS.typeScale}
        label="Scale ratio"
        hint="The ratio between adjacent type sizes."
        options={[
          { value: '1.125', label: '1.125' },
          { value: '1.2', label: '1.200' },
          { value: '1.25', label: '1.250' },
          { value: '1.333', label: '1.333' },
          { value: '1.618', label: 'Golden' },
        ]}
      />
      <TokenSlider
        token={NEXT_TOKENS.headingWeight}
        fallback={NEXT_DEFAULTS.headingWeight}
        label="Heading weight"
        min={300}
        max={800}
        step={100}
        format={(v) => String(Math.round(v))}
      />
      <TokenSlider
        token={NEXT_TOKENS.tracking}
        fallback={NEXT_DEFAULTS.tracking}
        label="Tracking"
        min={-0.03}
        max={0.05}
        step={0.005}
        format={(v) => `${(v * 1000).toFixed(0)}`}
      />
      <div className="rounded-lg border bg-neutral/40 p-3">
        <div
          className="font-heading leading-none"
          style={{
            fontSize: size,
            fontWeight: Number.parseInt(weight, 10) || 600,
            letterSpacing: `${Number.parseFloat(tracking) || 0}em`,
          }}
        >
          Ag
        </div>
        <p className="mt-1.5 text-xs text-fg-muted">The quick brown fox</p>
      </div>
    </div>
  )
}

export function SpacingAxis() {
  return (
    <div className="flex flex-col gap-5">
      <TokenSegmented
        token={NEXT_TOKENS.spacingUnit}
        fallback={NEXT_DEFAULTS.spacingUnit}
        label="Base unit"
        hint="The atom every gap and pad is a multiple of."
        options={[
          { value: '2', label: '2px' },
          { value: '4', label: '4px' },
          { value: '8', label: '8px' },
        ]}
      />
      <TokenSegmented
        token={NEXT_TOKENS.spacingScale}
        fallback={NEXT_DEFAULTS.spacingScale}
        label="Scale"
        options={[
          { value: 'linear', label: 'Linear' },
          { value: 'geometric', label: 'Geometric' },
        ]}
      />
    </div>
  )
}

const ELEVATION_SHADOW: Record<string, string> = {
  flat: 'none',
  subtle: '0 1px 2px rgb(0 0 0 / 0.07)',
  lifted: '0 5px 16px rgb(0 0 0 / 0.11)',
  dramatic: '0 14px 34px rgb(0 0 0 / 0.18)',
}

export function ElevationAxis() {
  const [elevation] = useToken(NEXT_TOKENS.elevation, NEXT_DEFAULTS.elevation)
  return (
    <div className="flex flex-col gap-5">
      <TokenPills
        token={NEXT_TOKENS.elevation}
        fallback={NEXT_DEFAULTS.elevation}
        label="Shadow scale"
        options={[
          { value: 'flat', label: 'Flat' },
          { value: 'subtle', label: 'Subtle' },
          { value: 'lifted', label: 'Lifted' },
          { value: 'dramatic', label: 'Dramatic' },
        ]}
      />
      <div className="flex items-center justify-center rounded-lg border bg-neutral/40 py-6">
        <div
          className="size-16 rounded-lg border bg-card"
          style={{ boxShadow: ELEVATION_SHADOW[elevation] ?? 'none' }}
        />
      </div>
      <TokenSegmented
        token={NEXT_TOKENS.elevationTint}
        fallback={NEXT_DEFAULTS.elevationTint}
        label="Shadow tint"
        hint="Borderless, flat, or floating — the gap between Material and Linear."
        options={[
          { value: 'neutral', label: 'Neutral' },
          { value: 'brand', label: 'Brand' },
        ]}
      />
    </div>
  )
}

const MOTION_MS: Record<string, number> = {
  instant: 0,
  snappy: 140,
  smooth: 260,
  expressive: 460,
}

export function MotionAxis() {
  const [motion] = useToken(NEXT_TOKENS.motion, NEXT_DEFAULTS.motion)
  const ms = MOTION_MS[motion] ?? 260
  return (
    <div className="flex flex-col gap-5">
      <TokenPills
        token={NEXT_TOKENS.motion}
        fallback={NEXT_DEFAULTS.motion}
        label="Speed"
        options={[
          { value: 'instant', label: 'Instant' },
          { value: 'snappy', label: 'Snappy' },
          { value: 'smooth', label: 'Smooth' },
          { value: 'expressive', label: 'Expressive' },
        ]}
      />
      <TokenSegmented
        token={NEXT_TOKENS.easing}
        fallback={NEXT_DEFAULTS.easing}
        label="Easing"
        options={[
          { value: 'standard', label: 'Standard' },
          { value: 'spring', label: 'Spring' },
        ]}
      />
      <div className="flex items-center justify-between rounded-lg border bg-neutral/40 p-3">
        <span className="text-xs text-fg-muted">Hover to preview</span>
        <button
          type="button"
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-fg-on-primary hover:-translate-y-0.5"
          style={{
            transition: `transform ${ms}ms cubic-bezier(0.34,1.56,0.64,1)`,
          }}
        >
          Demo
        </button>
      </div>
    </div>
  )
}

export function BordersAxis() {
  return (
    <div className="flex flex-col gap-5">
      <TokenSegmented
        token={NEXT_TOKENS.borders}
        fallback={NEXT_DEFAULTS.borders}
        label="Border style"
        hint="Some systems are borderless and lean on elevation instead."
        options={[
          { value: 'default', label: 'Default' },
          { value: 'hairline', label: 'Hairline' },
          { value: 'none', label: 'None' },
        ]}
      />
    </div>
  )
}

export function FocusAxis() {
  return (
    <div className="flex flex-col gap-5">
      <TokenSegmented
        token={NEXT_TOKENS.focus}
        fallback={NEXT_DEFAULTS.focus}
        label="Focus ring"
        hint="Width and offset of the keyboard-focus indicator."
        options={[
          { value: 'default', label: 'Default' },
          { value: 'bold', label: 'Bold' },
        ]}
      />
    </div>
  )
}

export function SurfacesAxis() {
  const [surfaces, set] = useToken(NEXT_TOKENS.surfaces, NEXT_DEFAULTS.surfaces)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-fg-muted">
            Translucent surfaces
          </span>
          <span className="text-xs text-fg-muted/60">
            Frost menus, popovers, and modals.
          </span>
        </div>
        <Switch
          isSelected={surfaces === 'translucent'}
          onChange={(on) => set(on ? 'translucent' : 'opaque')}
          aria-label="Translucent surfaces"
        />
      </div>
    </div>
  )
}
