'use client'

import { useSyncExternalStore } from 'react'
import { type Color, parseColor } from 'react-aria-components/ColorField'

import { ColorField } from '@/registry/ui/color-field'
import { Input } from '@/registry/ui/input'
import { NumberField } from '@/registry/ui/number-field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'
import { Slider, SliderControl, SliderOutput } from '@/registry/ui/slider'
import { Switch } from '@/registry/ui/switch'
import { TextField } from '@/registry/ui/text-field'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'

import { getValue, setValue, subscribe } from './store'
import type {
  BooleanTweakConfig,
  ColorTweakConfig,
  NumberTweakConfig,
  RegisteredControl,
  SelectTweakConfig,
  TextTweakConfig,
} from './types'

/** Subscribe a single row to its own value (only the changed row re-renders). */
function useControlValue<T>(id: string, fallback: T): T {
  return useSyncExternalStore(
    subscribe,
    () => {
      const v = getValue(id)
      return (v === undefined ? fallback : v) as T
    },
    () => fallback,
  )
}

function FieldLabel({ children }: { children: string }) {
  return (
    <span className="block truncate text-xs font-medium text-fg-muted">
      {children}
    </span>
  )
}

/** A small enum (a few short options) renders as a segmented control; bigger sets fall back to a Select. */
function isSegmented(options: readonly string[]): boolean {
  return (
    options.length > 1 &&
    options.length <= 4 &&
    options.every((o) => o.length <= 8)
  )
}

export function ControlRow({ control }: { control: RegisteredControl }) {
  const { config } = control
  switch (config.type) {
    case 'boolean':
      return <BooleanRow control={control} config={config} />
    case 'select':
      return <SelectRow control={control} config={config} />
    case 'number':
      return <NumberRow control={control} config={config} />
    case 'color':
      return <ColorRow control={control} config={config} />
    case 'text':
      return <TextRow control={control} config={config} />
    default:
      return null
  }
}

function BooleanRow({
  control,
  config,
}: {
  control: RegisteredControl
  config: BooleanTweakConfig
}) {
  const value = useControlValue(control.id, config.default)
  return (
    <div className="flex items-center justify-between gap-3">
      <FieldLabel>{control.label}</FieldLabel>
      <Switch
        aria-label={control.label}
        isSelected={value}
        onChange={(v) => setValue(control.id, v)}
        size="sm"
        className="shrink-0"
      />
    </div>
  )
}

function SelectRow({
  control,
  config,
}: {
  control: RegisteredControl
  config: SelectTweakConfig
}) {
  const value = useControlValue(control.id, config.default)

  if (isSegmented(config.options)) {
    return (
      <div className="flex flex-col gap-1.5">
        <FieldLabel>{control.label}</FieldLabel>
        <ToggleButtonGroup
          aria-label={control.label}
          size="sm"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[value]}
          onSelectionChange={(keys) => {
            const next = keys.values().next().value
            if (next != null) setValue(control.id, String(next))
          }}
          className="w-full"
        >
          {config.options.map((option) => (
            <ToggleButton key={option} id={option} className="flex-1">
              {option}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel>{control.label}</FieldLabel>
      <Select
        aria-label={control.label}
        selectedKey={value}
        onSelectionChange={(key) => setValue(control.id, String(key))}
        className="w-full"
      >
        <SelectTrigger size="sm" />
        <SelectContent>
          {config.options.map((option) => (
            <SelectItem key={option} id={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function NumberRow({
  control,
  config,
}: {
  control: RegisteredControl
  config: NumberTweakConfig
}) {
  const value = useControlValue(control.id, config.default)
  const bounded = config.min !== undefined && config.max !== undefined

  if (bounded) {
    return (
      <Slider
        aria-label={control.label}
        value={value}
        minValue={config.min}
        maxValue={config.max}
        step={config.step}
        onChange={(v) => setValue(control.id, Array.isArray(v) ? v[0] : v)}
        className="flex w-full flex-col gap-1.5"
      >
        <div className="flex items-center justify-between gap-3">
          <FieldLabel>{control.label}</FieldLabel>
          <SliderOutput className="text-xs text-fg-muted tabular-nums" />
        </div>
        <SliderControl />
      </Slider>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel>{control.label}</FieldLabel>
      <NumberField
        aria-label={control.label}
        value={value}
        minValue={config.min}
        maxValue={config.max}
        step={config.step}
        onChange={(v) =>
          setValue(control.id, Number.isNaN(v) ? config.default : v)
        }
        className="w-full"
      />
    </div>
  )
}

function ColorRow({
  control,
  config,
}: {
  control: RegisteredControl
  config: ColorTweakConfig
}) {
  const value = useControlValue(control.id, config.default)
  let color: Color | null = null
  try {
    color = parseColor(value)
  } catch {
    color = null
  }

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel>{control.label}</FieldLabel>
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="size-6 shrink-0 rounded-md border border-border"
          style={{ backgroundColor: value }}
        />
        <ColorField
          aria-label={control.label}
          value={color}
          onChange={(c) => c && setValue(control.id, c.toString('hex'))}
          className="w-full"
        >
          <Input size="sm" />
        </ColorField>
      </div>
    </div>
  )
}

function TextRow({
  control,
  config,
}: {
  control: RegisteredControl
  config: TextTweakConfig
}) {
  const value = useControlValue(control.id, config.default)
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel>{control.label}</FieldLabel>
      <TextField
        aria-label={control.label}
        value={value}
        onChange={(v) => setValue(control.id, v)}
        className="w-full"
      >
        <Input size="sm" />
      </TextField>
    </div>
  )
}
