'use client'

import { ChevronDownIcon } from 'lucide-react'

import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { Label } from '@/registry/ui/field'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { Select, SelectValue } from '@/registry/ui/select'
import { Slider, SliderControl, SliderOutput } from '@/registry/ui/slider'
import { Switch } from '@/registry/ui/switch'

import { useDesignSystem } from '../preset'

const DEFAULT_LIGHT_BG = 99

function AxisSlider({
  label,
  value,
  defaultValue,
  minValue,
  maxValue,
  step,
  onChange,
}: {
  label: string
  value: number
  /** Sliding back to this value deletes the axis from the config. */
  defaultValue: number
  minValue: number
  maxValue: number
  step: number
  onChange: (value: number | undefined) => void
}) {
  return (
    <Slider
      aria-label={label}
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      onChange={(v) => {
        const next = typeof v === 'number' ? v : (v[0] ?? defaultValue)
        onChange(next === defaultValue ? undefined : next)
      }}
    >
      <div className="flex items-center justify-between text-xs">
        <Label>{label}</Label>
        <SliderOutput className="text-fg-muted" />
      </div>
      <SliderControl />
    </Slider>
  )
}

/**
 * The engine's advanced axes — vividness, hue shift, background lightness,
 * exact-seed pinning. Every control stores `undefined` at its default so an
 * untouched recipe keeps encoding as the default.
 */
export function ColorFineTuneControls({ seedDelta }: { seedDelta?: number }) {
  const {
    designSystem,
    setColorAxis,
    setColorBackground,
    setColorPreserveSeed,
  } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG

  const preserveSeed = config.preserveSeed ?? false

  return (
    <div className="flex flex-col gap-3">
      <AxisSlider
        label="Vividness"
        value={config.vividness ?? 1}
        defaultValue={1}
        minValue={0}
        maxValue={2}
        step={0.05}
        onChange={(v) => setColorAxis('vividness', v)}
      />
      <AxisSlider
        label="Hue shift"
        value={config.hueShift ?? 1}
        defaultValue={1}
        minValue={0}
        maxValue={3}
        step={0.1}
        onChange={(v) => setColorAxis('hueShift', v)}
      />
      <AxisSlider
        label="Light background"
        value={config.background?.light ?? DEFAULT_LIGHT_BG}
        defaultValue={DEFAULT_LIGHT_BG}
        minValue={96}
        maxValue={100}
        step={0.5}
        onChange={(v) => setColorBackground('light', v)}
      />
      <Select
        className="w-full"
        selectedKey={config.background?.dark === 'oled' ? 'oled' : 'default'}
        onSelectionChange={(key) =>
          setColorBackground('dark', key === 'oled' ? 'oled' : undefined)
        }
      >
        <Label className="text-xs">Dark background</Label>
        <Button size="sm" className="w-full justify-between">
          <SelectValue className="truncate" />
          <ChevronDownIcon data-icon-end="" />
        </Button>
        <Popover>
          <ListBox>
            <ListBoxItem id="default">Near-black (default)</ListBoxItem>
            <ListBoxItem id="oled">OLED black</ListBoxItem>
          </ListBox>
        </Popover>
      </Select>
      <div className="flex flex-col gap-1">
        <Switch
          size="sm"
          isSelected={preserveSeed}
          onChange={setColorPreserveSeed}
        >
          Ship my exact brand hex
        </Switch>
        {preserveSeed && seedDelta !== undefined && (
          <p className="pl-1 text-[11px] text-fg-muted">
            Seed deviation ΔEok {seedDelta.toFixed(3)} — any contrast cost shows
            in the readout below.
          </p>
        )}
      </div>
    </div>
  )
}
