'use client'

import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Label } from '@/registry/ui/field'
import { Slider, SliderControl, SliderOutput } from '@/registry/ui/slider'
import { Switch } from '@/registry/ui/switch'

import { useDesignSystem } from '../preset'

const DEFAULT_LIGHT_BG = 99
const DEFAULT_DARK_BG = 6

function AxisSlider({
  label,
  value,
  defaultValue,
  minValue,
  maxValue,
  step,
  swatch,
  onChange,
}: {
  label: string
  value: number
  /** Sliding back to this value deletes the axis from the config. */
  defaultValue: number
  minValue: number
  maxValue: number
  step: number
  /** Live color rendered next to the output (backgrounds). */
  swatch?: string
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
        <div className="flex items-center gap-1.5">
          {swatch && (
            <span
              className="size-3.5 rounded-xs border"
              style={{ backgroundColor: swatch }}
            />
          )}
          <SliderOutput className="text-fg-muted" />
        </div>
      </div>
      <SliderControl />
    </Slider>
  )
}

/**
 * App-background lightness per mode. First-order decision, so it lives in the
 * main tier (not Fine-tune): light spans pure white → soft gray canvas, dark
 * spans OLED black (0) → dim. Both store `undefined` at their default.
 */
export function ColorBackgroundControls({
  lightSwatch,
  darkSwatch,
}: {
  lightSwatch: string
  darkSwatch: string
}) {
  const { designSystem, setColorBackground } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const dark = config.background?.dark
  return (
    <div className="flex flex-col gap-3">
      <AxisSlider
        label="Light background"
        value={config.background?.light ?? DEFAULT_LIGHT_BG}
        defaultValue={DEFAULT_LIGHT_BG}
        minValue={90}
        maxValue={100}
        step={0.5}
        swatch={lightSwatch}
        onChange={(v) => setColorBackground('light', v)}
      />
      <AxisSlider
        label="Dark background"
        value={dark === 'oled' ? 0 : (dark ?? DEFAULT_DARK_BG)}
        defaultValue={DEFAULT_DARK_BG}
        minValue={0}
        maxValue={20}
        step={0.5}
        swatch={darkSwatch}
        onChange={(v) => setColorBackground('dark', v)}
      />
    </div>
  )
}

/**
 * The engine's advanced axes — vividness, hue shift, exact-seed pinning.
 * Every control stores `undefined` at its default so an untouched recipe
 * keeps encoding as the default.
 */
export function ColorFineTuneControls({ seedDelta }: { seedDelta?: number }) {
  const { designSystem, setColorAxis, setColorPreserveSeed } = useDesignSystem()
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
