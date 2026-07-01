'use client'

import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Slider, SliderControl } from '@/registry/ui/slider'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'

/* ----------------------------------------------------------------------------
 * Shared atoms for every workspace — the visual language of the builder.
 * -------------------------------------------------------------------------- */

/** The title block at the top of every workspace pane. */
export function WorkspaceHeader({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-fg-muted" />
          <h2 className="text-sm font-semibold">{title}</h2>
        </div>
        {description && (
          <p className="text-xs leading-snug text-balance text-fg-muted">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}

/** A labelled control group — the stacked field used throughout. */
export function Field({
  label,
  hint,
  htmlFor,
  anchor,
  children,
  className,
}: {
  label?: ReactNode
  hint?: ReactNode
  htmlFor?: string
  anchor?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn('flex flex-col gap-1.5', className)}
      data-anchor={anchor}
    >
      {label && (
        <label
          htmlFor={htmlFor}
          className="flex items-center justify-between gap-2 text-xs font-medium text-fg"
        >
          {label}
        </label>
      )}
      {children}
      {hint && <p className="text-xs leading-snug text-fg-muted/80">{hint}</p>}
    </div>
  )
}

/** A subtle eyebrow label that divides a workspace into named blocks. */
export function GroupLabel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'text-[10px] font-semibold tracking-widest text-fg-muted/70 uppercase',
        className,
      )}
    >
      {children}
    </span>
  )
}

/** A bordered card that frames a related cluster of controls. */
export function Panel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-3 rounded-lg border p-3', className)}>
      {children}
    </div>
  )
}

/** Segmented single-select — the workhorse for small option sets. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  size = 'sm',
  className,
}: {
  value: T
  onChange: (value: T) => void
  options: ReadonlyArray<{ value: T; label: ReactNode; hint?: string }>
  ariaLabel?: string
  size?: 'sm' | 'md'
  className?: string
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
      className={cn('w-full *:flex-1', className)}
    >
      {options.map((opt) => (
        <ToggleButton key={opt.value} id={opt.value} aria-label={opt.hint}>
          {opt.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

/** Slider with a live monospace readout aligned to its label row. */
export function ValueSlider({
  value,
  onChange,
  min,
  max,
  step,
  label,
  format = (v) => v.toString(),
  ariaLabel,
}: {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  label?: ReactNode
  format?: (value: number) => string
  ariaLabel?: string
}) {
  return (
    <Slider
      aria-label={ariaLabel ?? (typeof label === 'string' ? label : undefined)}
      value={value}
      minValue={min}
      maxValue={max}
      step={step}
      onChange={(v) => onChange(v as number)}
    >
      {label != null && (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-fg">{label}</span>
          <span className="font-mono text-xs text-fg-muted tabular-nums">
            {format(value)}
          </span>
        </div>
      )}
      <SliderControl />
    </Slider>
  )
}

/**
 * Live / preview honesty badge. A filled dot means the control drives the live
 * preview today; a hollow dot means it's wired into the system but the preview
 * has no consumer for it yet. Surfacing this keeps the builder truthful.
 */
export function LiveDot({ live }: { live: boolean }) {
  return (
    <span
      title={live ? 'Live in preview' : 'Wired — preview consumer coming'}
      className={cn(
        'inline-block size-1.5 shrink-0 rounded-full',
        live ? 'bg-success' : 'border border-fg-muted/50',
      )}
      aria-hidden
    />
  )
}
