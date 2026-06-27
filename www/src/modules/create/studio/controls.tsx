'use client'

import type { ReactNode } from 'react'
import { ChevronDownIcon } from 'lucide-react'
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
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { Select, SelectValue } from '@/registry/ui/select'
import { Slider, SliderControl } from '@/registry/ui/slider'
import { Switch } from '@/registry/ui/switch'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

/* ----------------------------------------------------------------------------
 * The studio's control vocabulary. Every chapter is built from these atoms so
 * the whole panel reads as one instrument — consistent label rhythm, the same
 * "live vs UI-only" honesty dot, the same calm spacing.
 * -------------------------------------------------------------------------- */

/** The header that opens every chapter. */
export function ChapterIntro({
  title,
  blurb,
  action,
}: {
  title: string
  blurb: string
  action?: ReactNode
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        <p className="text-xs text-balance text-fg-muted">{blurb}</p>
      </div>
      {action}
    </div>
  )
}

/** A labelled sub-group within a chapter. */
export function Section({
  label,
  hint,
  children,
  className,
}: {
  label?: ReactNode
  hint?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('flex flex-col gap-3', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold tracking-[0.12em] text-fg-muted uppercase">
            {label}
          </span>
          {hint}
        </div>
      )}
      {children}
    </section>
  )
}

/**
 * Honesty signal: a filled dot means the control drives the live preview now; a
 * hollow dot means it's a polished UI control this experiment hasn't wired to a
 * consumer yet. Surfacing it keeps the builder from pretending.
 */
export function LiveDot({ live }: { live: boolean }) {
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
        {live ? 'Live — updates the preview' : 'UI preview — not wired yet'}
      </TooltipContent>
    </Tooltip>
  )
}

/** One stacked control: label (+ live dot) (+ value readout) above its widget. */
export function Field({
  label,
  hint,
  value,
  live,
  children,
}: {
  label: string
  hint?: string
  value?: ReactNode
  live?: boolean
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-medium text-fg">{label}</span>
          {live != null && <LiveDot live={live} />}
        </div>
        {value != null && (
          <span className="font-mono text-xs text-fg-muted tabular-nums">
            {value}
          </span>
        )}
      </div>
      {children}
      {hint && <p className="text-xs leading-snug text-fg-muted/80">{hint}</p>}
    </div>
  )
}

export function Hint({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs leading-snug text-balance text-fg-muted/80">
      {children}
    </p>
  )
}

/* -------------------------------- Segmented ------------------------------- */

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

/* ------------------------------ Slider field ------------------------------ */

export function SliderField({
  label,
  value,
  min,
  max,
  step,
  live,
  hint,
  format = (v) => String(v),
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  live?: boolean
  hint?: string
  format?: (value: number) => string
  onChange: (value: number) => void
}) {
  return (
    <Field label={label} value={format(value)} live={live} hint={hint}>
      <Slider
        aria-label={label}
        value={value}
        minValue={min}
        maxValue={max}
        step={step}
        onChange={(v) => onChange(typeof v === 'number' ? v : (v[0] ?? min))}
      >
        <SliderControl />
      </Slider>
    </Field>
  )
}

/* ------------------------------ Switch field ------------------------------ */

export function SwitchField({
  label,
  hint,
  value,
  live,
  onChange,
}: {
  label: string
  hint?: string
  value: boolean
  live?: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-medium text-fg">{label}</span>
          {live != null && <LiveDot live={live} />}
        </div>
        {hint && (
          <p className="text-xs leading-snug text-fg-muted/80">{hint}</p>
        )}
      </div>
      <Switch
        isSelected={value}
        onChange={onChange}
        aria-label={label}
        className="mt-0.5 shrink-0"
      />
    </div>
  )
}

/* ------------------------------ Select field ------------------------------ */

export function SelectField<T extends string>({
  label,
  value,
  options,
  live,
  hint,
  onChange,
}: {
  label?: string
  value: T
  options: ReadonlyArray<{ value: T; label: ReactNode }>
  live?: boolean
  hint?: string
  onChange: (value: T) => void
}) {
  const select = (
    <Select
      className="w-full"
      selectedKey={value}
      onSelectionChange={(k) => onChange(k as T)}
      aria-label={label}
    >
      <Button size="sm" className="w-full justify-between">
        <SelectValue className="truncate" />
        <ChevronDownIcon data-icon-end="" />
      </Button>
      <Popover>
        <ListBox>
          {options.map((opt) => (
            <ListBoxItem key={opt.value} id={opt.value}>
              {opt.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  )
  if (!label) return select
  return (
    <Field label={label} live={live} hint={hint}>
      {select}
    </Field>
  )
}

/* -------------------------------- Option grid ----------------------------- */

/**
 * A grid of selectable cards, each with its own visual preview. The workhorse
 * for the "big choices" — style families, density, algorithms — where seeing
 * the option beats reading its name.
 */
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
    label: ReactNode
    hint?: ReactNode
    preview?: ReactNode
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
        return (
          <ButtonPrimitives.Button
            key={opt.value}
            onPress={() => onChange(opt.value)}
            className={cn(
              'group flex flex-col gap-2 rounded-lg border p-2.5 text-left focus-reset transition-colors focus-visible:focus-ring',
              active
                ? 'border-border-control bg-neutral ring-1 ring-border-control'
                : 'hover:border-border-hover hover:bg-neutral/50',
            )}
          >
            {opt.preview && (
              <div className="flex h-12 items-center justify-center overflow-hidden rounded-md border bg-bg">
                {opt.preview}
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              <span
                className={cn(
                  'text-[13px] font-medium',
                  active ? 'text-fg' : 'text-fg-muted group-hover:text-fg',
                )}
              >
                {opt.label}
              </span>
              {opt.hint && (
                <span className="text-[11px] leading-tight text-fg-muted/70">
                  {opt.hint}
                </span>
              )}
            </div>
          </ButtonPrimitives.Button>
        )
      })}
    </div>
  )
}

/* ---------------------------------- Seed ---------------------------------- */

/**
 * A color seed: a wide swatch button showing the live color + hex, opening a
 * full picker (area + hue + hex field). Reuses the registry ColorPicker so the
 * popover content consumes this picker's value/onChange.
 */
export function Seed({
  label,
  value,
  live,
  onChange,
  swatchVar,
}: {
  label?: string
  value: string
  live?: boolean
  onChange: (hex: string) => void
  /** Optional CSS var to display in the swatch instead of the raw value. */
  swatchVar?: string
}) {
  const picker = (
    <ColorPicker value={value} onChange={(c) => onChange(c.toString('hex'))}>
      {({ color }) => (
        <>
          <Button size="sm" className="w-full justify-start pl-2">
            {swatchVar ? (
              <span
                className="size-4 shrink-0 rounded-[5px] border"
                style={{ backgroundColor: `var(${swatchVar})` }}
              />
            ) : (
              <ColorSwatch />
            )}
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
  if (!label) return picker
  return (
    <Field label={label} live={live}>
      {picker}
    </Field>
  )
}
