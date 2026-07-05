'use client'

import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { SegmentedControl, SegmentedControlItem } from '@/ui/segmented-control'
import { Slider, SliderControl } from '@/ui/slider'
import { Switch } from '@/ui/switch'

/** Single-select segmented toggle for playground axes. */
export function Choice<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: readonly { value: T; label: ReactNode }[]
  value: T
  onChange: (value: T) => void
  label?: string
  className?: string
}) {
  return (
    <SegmentedControl
      aria-label={label ?? 'Options'}
      selectedKeys={[value]}
      onSelectionChange={(keys) => {
        const next = [...keys][0]
        if (next != null) onChange(String(next) as T)
      }}
      className={className}
    >
      {options.map((option) => (
        <SegmentedControlItem key={option.value} id={option.value}>
          {option.label}
        </SegmentedControlItem>
      ))}
    </SegmentedControl>
  )
}

/** Labeled slider that shows its formatted value inline. */
export function Range({
  label,
  value,
  onChange,
  minValue,
  maxValue,
  step = 1,
  format,
  className,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  minValue: number
  maxValue: number
  step?: number
  format?: (value: number) => ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex min-w-44 flex-col gap-1', className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-fg-muted">{label}</span>
        <span className="font-mono text-fg tabular-nums">
          {format ? format(value) : value}
        </span>
      </div>
      <Slider
        aria-label={label}
        value={value}
        onChange={(next) => onChange(next as number)}
        minValue={minValue}
        maxValue={maxValue}
        step={step}
      >
        <SliderControl />
      </Slider>
    </div>
  )
}

/** Boolean switch for playground axes. */
export function Toggle({
  isSelected,
  onChange,
  children,
}: {
  isSelected: boolean
  onChange: (value: boolean) => void
  children: ReactNode
}) {
  return (
    <Switch isSelected={isSelected} onChange={onChange} size="sm">
      {children}
    </Switch>
  )
}
