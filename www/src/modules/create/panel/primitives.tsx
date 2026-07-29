'use client'

import type { ReactNode } from 'react'
import { RotateCcwIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@/registry/ui/segmented-control'
import { Slider, SliderControl } from '@/registry/ui/slider'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import type { Control } from './types'

/* ------------------------------ Control row ------------------------------ */

/**
 * The scroll/flash anchor around one control. Widgets are self-labeled (the
 * label lives inside the input), so no chrome is added here.
 */
export function ControlRow({ control }: { control: Control }) {
  return (
    <div data-control={control.id}>
      <control.Widget />
    </div>
  )
}

/* ---------------------------- Chapter heading ---------------------------- */

/** A chapter marker in the story scroll. */
export function ChapterHeading({
  icon: Icon,
  label,
  modified,
  onReset,
  className,
}: {
  icon: LucideIcon
  label: string
  /** Chapter deviates from the default system — shows the dot + reset. */
  modified?: boolean
  onReset?: () => void
  className?: string
}) {
  return (
    <div className={cn('flex h-8 items-center gap-2', className)}>
      <Icon className="size-3.5 text-fg-muted" />
      <span className="text-[11px] font-semibold tracking-wider text-fg-muted uppercase">
        {label}
      </span>
      {modified && (
        <>
          <span
            aria-label="Modified"
            className="size-1 rounded-full bg-fg-muted"
          />
          {onReset && (
            <Tooltip delay={300}>
              <Button
                size="xs"
                variant="quiet"
                isIconOnly
                aria-label={`Reset ${label}`}
                onPress={onReset}
                className="ml-auto text-fg-muted"
              >
                <RotateCcwIcon />
              </Button>
              <TooltipContent>Reset {label.toLowerCase()}</TooltipContent>
            </Tooltip>
          )}
        </>
      )}
    </div>
  )
}

/* ------------------------------ Inline row ------------------------------- */

/** A one-line control: quiet label on the left, the input filling the right. */
export function InlineRow({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="grid grid-cols-[4.5rem_1fr] items-center gap-2">
      <span className="truncate text-xs text-fg-muted">{label}</span>
      {children}
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
  size?: 'xs' | 'sm'
  ariaLabel?: string
}) {
  return (
    <SegmentedControl
      aria-label={ariaLabel}
      selectedKeys={[value]}
      onSelectionChange={(keys) => {
        const next = keys.values().next().value
        if (next) onChange(next as T)
      }}
      className="flex w-full"
    >
      {options.map((opt) => (
        <SegmentedControlItem
          key={opt.value}
          id={opt.value}
          aria-label={opt.hint}
          className={cn('flex-1', size === 'xs' && 'px-2 text-xs')}
        >
          {opt.label}
        </SegmentedControlItem>
      ))}
    </SegmentedControl>
  )
}

/** Slider with its label and live value on one quiet line above the track. */
export function ValueSlider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format = (v) => v.toString(),
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  format?: (value: number) => string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-fg-muted">{label}</span>
        <span className="font-mono text-xs text-fg tabular-nums">
          {format(value)}
        </span>
      </div>
      <Slider
        aria-label={label}
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
