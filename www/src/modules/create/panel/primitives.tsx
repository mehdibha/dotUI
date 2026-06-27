'use client'

import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Slider, SliderControl } from '@/registry/ui/slider'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { usePanelConfig } from './config'
import type { Binding, Control } from './types'

/* ------------------------------ Binding dot ------------------------------ */

/**
 * Honest status: a filled dot = the control drives the live preview; a hollow
 * dot = it's a UI stub the preview has no consumer for yet. Surfacing this keeps
 * the prototype from pretending everything is wired.
 */
export function BindingDot({ binding }: { binding: Binding }) {
  const live = binding === 'live'
  return (
    <Tooltip delay={300}>
      <span
        className={cn(
          'inline-block size-1.5 shrink-0 rounded-full',
          live ? 'bg-success' : 'border border-fg-muted/60',
        )}
        aria-hidden
      />
      <TooltipContent>
        {live ? 'Live — drives the preview' : 'Stub — UI only for now'}
      </TooltipContent>
    </Tooltip>
  )
}

/* ------------------------------ Control row ------------------------------ */

/**
 * The chrome around one control's widget. Reads the lab config so the SAME
 * control renders correctly in every layout: stacked vs inline label, with or
 * without its description, at compact or comfortable density.
 */
export function ControlRow({ control }: { control: Control }) {
  const { config } = usePanelConfig()
  const { rowLayout, showDescriptions, density } = config
  const description = showDescriptions ? control.description : undefined

  if (control.block) {
    return (
      <div className="flex flex-col gap-2" data-control={control.id}>
        <LabelLine control={control} />
        {description && <Help>{description}</Help>}
        <control.Widget />
      </div>
    )
  }

  const inline = rowLayout === 'inline'
  return (
    <div
      data-control={control.id}
      className={cn(
        inline
          ? 'flex items-center justify-between gap-4'
          : 'flex flex-col gap-1.5',
        density === 'compact' ? 'text-[13px]' : 'text-sm',
      )}
    >
      <div className={cn('flex min-w-0 flex-col gap-0.5', inline && 'flex-1')}>
        <LabelLine control={control} />
        {description && <Help>{description}</Help>}
      </div>
      <div className={cn(inline ? 'w-40 shrink-0' : 'w-full')}>
        <control.Widget />
      </div>
    </div>
  )
}

function LabelLine({ control }: { control: Control }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="truncate font-medium text-fg">{control.label}</span>
      <BindingDot binding={control.binding} />
    </div>
  )
}

export function Help({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs leading-snug text-balance text-fg-muted">
      {children}
    </p>
  )
}

/* ---------------------------- Section heading ---------------------------- */

export function SectionHeading({
  icon: Icon,
  label,
  count,
  className,
}: {
  icon: LucideIcon
  label: string
  count?: number
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Icon className="size-3.5 text-fg-muted" />
      <span className="text-[11px] font-semibold tracking-wider text-fg-muted uppercase">
        {label}
      </span>
      {count != null && (
        <span className="font-mono text-[10px] text-fg-muted/70 tabular-nums">
          {count}
        </span>
      )}
    </div>
  )
}

/* ------------------------------- Widgets -------------------------------- */

/** Segmented control over a small option set — the workhorse for macro choices. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  size = 'sm',
  ariaLabel,
}: {
  value: T
  onChange: (value: T) => void
  options: ReadonlyArray<{ value: T; label: ReactNode; hint?: string }>
  size?: 'sm' | 'md'
  ariaLabel?: string
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
        <ToggleButton key={opt.value} id={opt.value} aria-label={opt.hint}>
          {opt.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

/** Slider with a live monospace value readout — the standard scalar control. */
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
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-end">
        <span className="font-mono text-xs text-fg-muted tabular-nums">
          {format(value)}
        </span>
      </div>
      <Slider
        aria-label={ariaLabel}
        value={value}
        minValue={min}
        maxValue={max}
        step={step}
        onChange={(v) => onChange(v as number)}
      >
        <SliderControl />
      </Slider>
    </div>
  )
}
