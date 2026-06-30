'use client'

import type { ReactNode } from 'react'

import { cn } from '@/registry/lib/utils'
import { Slider, SliderControl } from '@/registry/ui/slider'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'

/* ------------------------------ Binding dot ------------------------------ */

export type Binding = 'live' | 'stub'

/**
 * Honest status: a filled green dot = the control drives the live preview and
 * the exported code; a hollow dot = a polished UI surface for an axis we'd
 * propose, with no token consumer yet.
 *
 * Deliberately a native `title` tooltip, not the React Aria Tooltip: this dot
 * renders INSIDE a row's trigger button, and nesting a React Aria press context
 * inside another swallows the outer button's `onPress` (rows wouldn't expand).
 */
export function BindingDot({ binding }: { binding: Binding }) {
  const live = binding === 'live'
  return (
    <span
      title={
        live
          ? 'Live — drives the preview & export'
          : 'Preview-only · proposed axis'
      }
      className={cn(
        'inline-block size-1.5 shrink-0 rounded-full',
        live ? 'bg-success' : 'border border-fg-muted/50',
      )}
      aria-hidden
    />
  )
}

/* ------------------------------- Field row ------------------------------- */

/** A labelled control row inside an expanded axis. Stacks label over widget. */
export function Field({
  label,
  hint,
  binding,
  children,
  className,
}: {
  label: ReactNode
  hint?: ReactNode
  binding?: Binding
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-fg-muted">{label}</span>
        {binding && <BindingDot binding={binding} />}
      </div>
      {children}
      {hint && <p className="text-xs leading-snug text-fg-muted/60">{hint}</p>}
    </div>
  )
}

/* ------------------------------- Segmented ------------------------------- */

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  size = 'sm',
}: {
  value: T
  onChange: (value: T) => void
  options: ReadonlyArray<{ value: T; label: ReactNode }>
  ariaLabel?: string
  size?: 'sm' | 'md'
}) {
  return (
    <ToggleButtonGroup
      aria-label={ariaLabel}
      selectionMode="single"
      disallowEmptySelection
      size={size}
      selectedKeys={[value]}
      onSelectionChange={(keys) => {
        const next = keys.values().next().value
        if (next) onChange(next as T)
      }}
      className="w-full *:flex-1"
    >
      {options.map((opt) => (
        <ToggleButton key={opt.value} id={opt.value}>
          {opt.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

/* ------------------------------ Value slider ----------------------------- */

export function ValueSlider({
  value,
  onChange,
  min,
  max,
  step,
  format = (v) => v.toString(),
  ariaLabel,
}: {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  format?: (value: number) => string
  ariaLabel?: string
}) {
  return (
    <Slider
      aria-label={ariaLabel}
      value={value}
      minValue={min}
      maxValue={max}
      step={step}
      onChange={(v) => onChange(typeof v === 'number' ? v : (v[0] ?? min))}
    >
      <div className="-mt-1 mb-1 flex justify-end">
        <span className="font-mono text-[11px] text-fg-muted tabular-nums">
          {format(value)}
        </span>
      </div>
      <SliderControl />
    </Slider>
  )
}

/* --------------------------- Summary primitives -------------------------- */

/** A small colour dot used in collapsed-row spec-sheet summaries. */
export function SwatchDot({
  color,
  className,
  auto,
}: {
  color: string
  className?: string
  auto?: boolean
}) {
  return (
    <span
      className={cn(
        'inline-block size-3.5 shrink-0 rounded-[5px] ring-1 ring-black/10 ring-inset',
        auto && 'opacity-50',
        className,
      )}
      style={{ backgroundColor: color }}
      aria-hidden
    />
  )
}

/** Monospace value chip for collapsed-row summaries. */
export function SummaryValue({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'truncate font-mono text-[11px] text-fg-muted tabular-nums',
        className,
      )}
    >
      {children}
    </span>
  )
}
