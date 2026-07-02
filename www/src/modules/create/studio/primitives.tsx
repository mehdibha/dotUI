'use client'

import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { ColorArea } from '@/registry/ui/color-area'
import { ColorField } from '@/registry/ui/color-field'
import { ColorPicker } from '@/registry/ui/color-picker'
import { ColorSlider } from '@/registry/ui/color-slider'
import { ColorSwatch } from '@/registry/ui/color-swatch'
import { DialogContent } from '@/registry/ui/dialog'
import { Input } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'
import { Slider, SliderControl } from '@/registry/ui/slider'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

/* ----------------------------------------------------------------------------
 * The studio's shared control vocabulary. Every inspector composes these so the
 * whole surface reads as one instrument — same labels, same rhythm, same dots.
 * -------------------------------------------------------------------------- */

/** Honest wiring indicator: filled = drives the live preview, hollow = UI stub. */
export function BindingDot({ live }: { live: boolean }) {
  return (
    <Tooltip delay={250}>
      <span
        className={cn(
          'inline-block size-1.5 shrink-0 rounded-full',
          live ? 'bg-success' : 'border border-fg-muted/50',
        )}
        aria-hidden
      />
      <TooltipContent>
        {live
          ? 'Live — drives the preview now'
          : 'Designed — wires to the preview as the engine grows'}
      </TooltipContent>
    </Tooltip>
  )
}

/** A titled block of related controls. */
export function Section({
  title,
  aside,
  children,
  className,
}: {
  title: string
  aside?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('flex flex-col gap-3', className)}>
      <div className="flex h-5 items-center justify-between">
        <h3 className="text-[11px] font-semibold tracking-wider text-fg-muted uppercase">
          {title}
        </h3>
        {aside}
      </div>
      {children}
    </section>
  )
}

/** A labelled control, stacked. */
export function Field({
  label,
  hint,
  live,
  value,
  children,
}: {
  label: string
  hint?: string
  live?: boolean
  /** Optional right-aligned readout next to the label. */
  value?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-medium text-fg">{label}</span>
          {live != null && <BindingDot live={live} />}
        </div>
        {value != null && (
          <span className="font-mono text-[11px] text-fg-muted tabular-nums">
            {value}
          </span>
        )}
      </div>
      {children}
      {hint && (
        <p className="text-xs leading-snug text-balance text-fg-muted/80">
          {hint}
        </p>
      )}
    </div>
  )
}

/** Segmented single-select — the workhorse for macro choices. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T
  onChange: (value: T) => void
  options: ReadonlyArray<{ value: T; label: ReactNode }>
  ariaLabel?: string
}) {
  return (
    <ToggleButtonGroup
      aria-label={ariaLabel}
      selectionMode="single"
      disallowEmptySelection
      size="sm"
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

/** Slider over a numeric range. The readout lives in the Field label via `value`. */
export function ValueSlider({
  value,
  onChange,
  min,
  max,
  step,
  ariaLabel,
}: {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
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
      <SliderControl />
    </Slider>
  )
}

/** A color swatch + hex that opens a full picker. The studio's seed control. */
export function SwatchButton({
  value,
  onChange,
  ariaLabel,
}: {
  value: string
  onChange: (hex: string) => void
  ariaLabel?: string
}) {
  return (
    <ColorPicker value={value} onChange={(c) => onChange(c.toString('hex'))}>
      {({ color }) => (
        <>
          <Button
            size="sm"
            aria-label={ariaLabel}
            className="w-full justify-start pl-2"
          >
            <ColorSwatch />
            <span className="truncate font-mono text-xs">
              {color.toString('hex')}
            </span>
          </Button>
          <Popover>
            <DialogContent className="flex flex-col gap-2">
              <div className="flex gap-2">
                <ColorArea
                  colorSpace="hsb"
                  xChannel="saturation"
                  yChannel="brightness"
                />
                <ColorSlider
                  orientation="vertical"
                  colorSpace="hsb"
                  channel="hue"
                  className="h-auto self-stretch"
                />
              </div>
              <ColorField aria-label="Hex" className="w-full">
                <Input size="sm" className="w-full" />
              </ColorField>
            </DialogContent>
          </Popover>
        </>
      )}
    </ColorPicker>
  )
}

/** A grid of selectable option cards — vibes, fonts, style families. */
export function OptionGrid<T extends string>({
  value,
  onChange,
  options,
  columns = 2,
}: {
  value: T
  onChange: (value: T) => void
  options: ReadonlyArray<{
    value: T
    label: string
    description?: string
    icon?: LucideIcon
    swatch?: ReactNode
  }>
  columns?: number
}) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {options.map((opt) => {
        const active = opt.value === value
        const Icon = opt.icon
        return (
          <ButtonPrimitives.Button
            key={opt.value}
            onPress={() => onChange(opt.value)}
            className={cn(
              'group/card relative flex flex-col items-start gap-1.5 rounded-lg border p-2.5 text-left focus-reset transition-colors focus-visible:focus-ring',
              active
                ? 'border-primary bg-primary/8 ring-1 ring-primary/30'
                : 'hover:border-fg-muted/30 hover:bg-neutral',
            )}
          >
            {opt.swatch}
            <div className="flex items-center gap-1.5">
              {Icon && (
                <Icon
                  className={cn(
                    'size-3.5',
                    active ? 'text-primary' : 'text-fg-muted',
                  )}
                />
              )}
              <span className="text-[13px] font-medium">{opt.label}</span>
            </div>
            {opt.description && (
              <span className="text-[11px] leading-snug text-fg-muted">
                {opt.description}
              </span>
            )}
          </ButtonPrimitives.Button>
        )
      })}
    </div>
  )
}

/** A flush row: label left, control right — for compact toggles and selects. */
export function InlineRow({
  label,
  hint,
  live,
  children,
}: {
  label: string
  hint?: string
  live?: boolean
  children: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 flex-col">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[13px] font-medium text-fg">
            {label}
          </span>
          {live != null && <BindingDot live={live} />}
        </div>
        {hint && (
          <span className="truncate text-[11px] text-fg-muted/80">{hint}</span>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}
