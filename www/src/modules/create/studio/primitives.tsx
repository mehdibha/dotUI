'use client'

import type { ReactNode } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { ColorArea } from '@/registry/ui/color-area'
import { ColorField } from '@/registry/ui/color-field'
import { ColorPicker } from '@/registry/ui/color-picker'
import { ColorSlider } from '@/registry/ui/color-slider'
import { ColorSwatch } from '@/registry/ui/color-swatch'
import { DialogContent } from '@/registry/ui/dialog'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'
import { Slider, SliderControl, SliderOutput } from '@/registry/ui/slider'
import { Switch, SwitchControl } from '@/registry/ui/switch'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'

/* ------------------------------------------------------------------ *
 * Studio primitives — the shared vocabulary every editor is built from.
 * Tight, label-forward controls tuned for a ~340px panel.
 * ------------------------------------------------------------------ */

/* ----------------------------- Chrome ----------------------------- */

export function ScreenHeader({
  title,
  onBack,
  action,
}: {
  title: string
  onBack: () => void
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-center gap-1.5">
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
      <h2 className="flex-1 truncate text-sm font-semibold">{title}</h2>
      {action}
    </div>
  )
}

export function SectionLabel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'px-0.5 text-[10px] font-medium tracking-widest text-fg-muted uppercase',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function Hint({ children }: { children: ReactNode }) {
  return <p className="text-xs leading-relaxed text-fg-muted">{children}</p>
}

/** A titled stack of controls with a hairline divider — the editor's spine. */
export function Group({
  label,
  hint,
  children,
}: {
  label?: string
  hint?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      {label && <SectionLabel>{label}</SectionLabel>}
      {children}
      {hint && <Hint>{hint}</Hint>}
    </section>
  )
}

/* ----------------------------- Fields ----------------------------- */

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs font-medium text-fg">{label}</Label>
      {children}
      {hint && <Hint>{hint}</Hint>}
    </div>
  )
}

export interface Option<T extends string> {
  id: T
  label: string
}

/** Full-width single-select segmented control — the studio's default toggle. */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label?: string
  value: T
  options: ReadonlyArray<Option<T>>
  onChange: (value: T) => void
}) {
  const control = (
    <ToggleButtonGroup
      aria-label={label ?? 'options'}
      selectionMode="single"
      disallowEmptySelection
      size="sm"
      selectedKeys={[value]}
      onSelectionChange={(keys) => {
        const next = keys.values().next().value
        if (typeof next === 'string') onChange(next as T)
      }}
      className="w-full *:min-w-0 *:flex-1"
    >
      {options.map((opt) => (
        <ToggleButton key={opt.id} id={opt.id} className="min-w-0 text-xs">
          <span className="truncate">{opt.label}</span>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
  if (!label) return control
  return <Field label={label}>{control}</Field>
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label?: string
  value: T
  options: ReadonlyArray<Option<T>>
  onChange: (value: T) => void
  hint?: ReactNode
}) {
  const control = (
    <Select
      aria-label={label ?? 'select'}
      selectedKey={value}
      onSelectionChange={(key) => {
        if (typeof key === 'string') onChange(key as T)
      }}
      className="w-full"
    >
      <SelectTrigger size="sm" className="w-full" />
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.id} id={opt.id}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
  if (!label) return control
  return (
    <Field label={label} hint={hint}>
      {control}
    </Field>
  )
}

export function SliderField({
  label,
  value,
  minValue,
  maxValue,
  step,
  onChange,
  format,
  hint,
}: {
  label: string
  value: number
  minValue: number
  maxValue: number
  step: number
  onChange: (value: number) => void
  format?: (value: number) => string
  hint?: ReactNode
}) {
  return (
    <Slider
      aria-label={label}
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      onChange={(v) => onChange(typeof v === 'number' ? v : (v[0] ?? minValue))}
    >
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-fg">{label}</Label>
        <SliderOutput className="font-mono text-xs text-fg-muted tabular-nums">
          {format ? format(value) : undefined}
        </SliderOutput>
      </div>
      <SliderControl />
      {hint && <Hint>{hint}</Hint>}
    </Slider>
  )
}

export function SwitchRow({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint?: ReactNode
  value: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium text-fg">{label}</span>
        {hint && (
          <span className="text-xs leading-snug text-fg-muted">{hint}</span>
        )}
      </div>
      <Switch isSelected={value} onChange={onChange}>
        <SwitchControl />
      </Switch>
    </div>
  )
}

/* ------------------------- Color seed swatch ------------------------- */

/** The seed picker — a swatch button opening an HSB area + hex field popover. */
export function SeedSwatch({
  label,
  value,
  onChange,
  description,
}: {
  label: string
  value: string
  onChange: (hex: string) => void
  description?: string
}) {
  return (
    <ColorPicker
      value={value}
      onChange={(color) => onChange(color.toString('hex'))}
    >
      {({ color }) => (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-2">
              <Label className="text-xs font-medium text-fg">{label}</Label>
              {description && (
                <span className="truncate text-[10px] text-fg-muted">
                  {description}
                </span>
              )}
            </div>
            <Button size="sm" className="justify-start gap-2 pl-2">
              <ColorSwatch />
              <span className="truncate font-mono text-xs">
                {color.toString('hex')}
              </span>
            </Button>
          </div>
          <Popover>
            <DialogContent className="flex flex-col gap-2">
              {/* Raw primitives consume THIS picker's context (see colors module). */}
              <div className="flex gap-2">
                <ColorArea
                  aria-label={`${label} saturation and brightness`}
                  colorSpace="hsb"
                  xChannel="saturation"
                  yChannel="brightness"
                />
                <ColorSlider
                  aria-label={`${label} hue`}
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

/* ------------------------------ Display ------------------------------ */

/** A thin horizontal strip of a generated ramp's steps. */
export function RampStrip({
  ramp,
  className,
}: {
  ramp: Record<string, string>
  className?: string
}) {
  return (
    <div className={cn('flex h-2.5 overflow-hidden rounded-full', className)}>
      {Object.entries(ramp).map(([step, value]) => (
        <div
          key={step}
          className="h-full flex-1"
          style={{ backgroundColor: value }}
        />
      ))}
    </div>
  )
}

/** Framed live-preview surface shown at the top of an editor. */
export function PreviewFrame({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex min-h-24 items-center justify-center gap-3 rounded-xl border bg-muted/40 p-5',
        className,
      )}
    >
      {children}
    </div>
  )
}

/* ------------------------------ Nav rows ------------------------------ */

/** A drill-in list row: icon · title/subtitle · live preview · chevron. */
export function NavRow({
  icon,
  title,
  subtitle,
  preview,
  onPress,
}: {
  icon?: ReactNode
  title: string
  subtitle?: string
  preview?: ReactNode
  onPress: () => void
}) {
  return (
    <ButtonPrimitives.Button
      onPress={onPress}
      className="group flex w-full items-center gap-3 rounded-lg border bg-card px-3 py-2.5 text-left focus-reset transition-colors hover:bg-neutral focus-visible:focus-ring"
    >
      {icon && (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-fg-muted [&_svg]:size-4">
          {icon}
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium">{title}</span>
        {subtitle && (
          <span className="truncate text-xs text-fg-muted">{subtitle}</span>
        )}
      </span>
      {preview}
      <ChevronRightIcon className="size-4 shrink-0 text-fg-muted/60 transition-transform group-hover:translate-x-0.5" />
    </ButtonPrimitives.Button>
  )
}

/** Selectable option card used for libraries, elevation styles, etc. */
export function OptionCard({
  selected,
  onPress,
  children,
}: {
  selected: boolean
  onPress: () => void
  children: ReactNode
}) {
  return (
    <ButtonPrimitives.Button
      onPress={onPress}
      className={cn(
        'flex flex-col items-stretch gap-2 rounded-lg border p-3 text-left focus-reset transition-colors focus-visible:focus-ring',
        selected
          ? 'border-border-focus bg-neutral ring-1 ring-border-focus'
          : 'hover:bg-neutral',
      )}
    >
      {children}
    </ButtonPrimitives.Button>
  )
}
