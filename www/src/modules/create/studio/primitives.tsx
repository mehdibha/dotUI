'use client'

import type { ReactNode } from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  type LucideIcon,
} from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { Slider, SliderControl } from '@/registry/ui/slider'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

/* ------------------------------- Live dot ------------------------------- */

/**
 * Honesty marker reused from the lab: a filled dot means the control drives the
 * live preview; a hollow one means it's captured design intent the preview has
 * no consumer for yet. Shown sparingly so it reassures without nagging.
 */
export function LiveDot({
  live,
  className,
}: {
  live: boolean
  className?: string
}) {
  return (
    <Tooltip delay={250}>
      <span
        className={cn(
          'inline-block size-1.5 shrink-0 rounded-full',
          live ? 'bg-success' : 'border border-fg-muted/50',
          className,
        )}
        aria-hidden
      />
      <TooltipContent>
        {live ? 'Live — drives the preview' : 'Captured — applies on export'}
      </TooltipContent>
    </Tooltip>
  )
}

/* ----------------------------- Section card ----------------------------- */

/**
 * A foundation tile on the home view: an icon, a label, a one-line live summary
 * and an optional trailing preview. The whole card is the affordance into its
 * deep editor.
 */
export function SectionCard({
  icon: Icon,
  label,
  summary,
  trailing,
  live,
  onPress,
}: {
  icon: LucideIcon
  label: string
  summary?: ReactNode
  trailing?: ReactNode
  live?: boolean
  onPress: () => void
}) {
  return (
    <ButtonPrimitives.Button
      onPress={onPress}
      className="group flex items-center gap-3 rounded-xl border bg-card p-3 text-left focus-reset transition-colors hover:border-border-field hover:bg-neutral/50 focus-visible:focus-ring"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-neutral/60 text-fg-muted transition-colors group-hover:text-fg">
        <Icon className="size-4" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium">{label}</span>
          {live != null && <LiveDot live={live} />}
        </div>
        {summary != null && (
          <span className="truncate text-xs text-fg-muted">{summary}</span>
        )}
      </div>
      {trailing}
      <ChevronRightIcon className="size-4 shrink-0 text-fg-muted/60 transition-transform group-hover:translate-x-0.5 group-hover:text-fg-muted" />
    </ButtonPrimitives.Button>
  )
}

/* ----------------------------- Detail header ---------------------------- */

export function DetailHeader({
  title,
  subtitle,
  onBack,
  action,
}: {
  title: string
  subtitle?: ReactNode
  onBack: () => void
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-start gap-2">
      <Button
        variant="quiet"
        size="sm"
        isIconOnly
        onPress={onBack}
        aria-label="Back"
        className="-ml-1 size-7 shrink-0"
      >
        <ChevronLeftIcon />
      </Button>
      <div className="flex min-w-0 flex-1 flex-col">
        <h2 className="text-sm font-semibold">{title}</h2>
        {subtitle != null && (
          <p className="text-xs text-balance text-fg-muted">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  )
}

/* ------------------------------- Field row ------------------------------ */

/** A labelled control row: label (+ optional hint/live dot) above its widget. */
export function Field({
  label,
  hint,
  live,
  children,
  className,
}: {
  label: ReactNode
  hint?: ReactNode
  live?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-fg-muted">{label}</span>
        {live != null && <LiveDot live={live} />}
      </div>
      {children}
      {hint != null && (
        <p className="text-xs leading-snug text-balance text-fg-muted/70">
          {hint}
        </p>
      )}
    </div>
  )
}

/* ------------------------------- Subhead -------------------------------- */

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
        'text-[10px] font-semibold tracking-widest text-fg-muted/80 uppercase',
        className,
      )}
    >
      {children}
    </span>
  )
}

/* ------------------------------- Segmented ------------------------------ */

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  size = 'sm',
  ariaLabel,
  className,
}: {
  value: T
  onChange: (value: T) => void
  options: ReadonlyArray<{ value: T; label: ReactNode; hint?: string }>
  size?: 'xs' | 'sm' | 'md'
  ariaLabel?: string
  className?: string
}) {
  return (
    <ToggleButtonGroup
      aria-label={ariaLabel}
      selectionMode="single"
      disallowEmptySelection
      size={size === 'xs' ? 'sm' : size}
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

/* ------------------------------ Slider row ------------------------------ */

export function SliderRow({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format = (v) => v.toString(),
  live,
}: {
  label: ReactNode
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  format?: (value: number) => string
  live?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-fg-muted">{label}</span>
          {live != null && <LiveDot live={live} />}
        </div>
        <span className="font-mono text-xs text-fg tabular-nums">
          {format(value)}
        </span>
      </div>
      <Slider
        aria-label={typeof label === 'string' ? label : undefined}
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
