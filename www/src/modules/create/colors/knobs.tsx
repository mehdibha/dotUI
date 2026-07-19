'use client'

import { useMemo } from 'react'
import { ChevronDownIcon } from 'lucide-react'

import { type Theme, toOklch, wcag2 } from '@dotui/colors'

import { resolveColorConfigCached } from '@/lib/resolve-color'
import { type ColorConfig, DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { Label } from '@/registry/ui/field'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { Select, SelectValue } from '@/registry/ui/select'
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
  formatValue,
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
  formatValue?: (value: number) => string
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
          <SliderOutput
            className="text-fg-muted"
            children={
              formatValue
                ? ({ state }) => formatValue(state.values[0] ?? defaultValue)
                : undefined
            }
          />
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
        formatValue={(v) => `L* ${v}`}
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
        formatValue={(v) => (v === 0 ? 'OLED black' : `L* ${v}`)}
        onChange={(v) => setColorBackground('dark', v)}
      />
    </div>
  )
}

const GUARANTEE_POLICIES = [
  { id: 'default', label: 'Default' },
  { id: 'relaxed', label: 'Relaxed — border floors become warnings' },
  { id: 'strict', label: 'Strict — AA text on solid buttons' },
] as const

const BORDER_JOBS = [
  { job: '400', label: 'Border · subtle', maxValue: 3 },
  { job: '500', label: 'Border · interactive', maxValue: 4 },
  { job: '600', label: 'Border · emphasized', maxValue: 8 },
] as const

/**
 * The WCAG ratios of the untouched (skeleton-placed) borders vs the app
 * background — the sliders' stable zero point, measured with any border
 * targets stripped so it never tracks the sliders themselves.
 */
export type BorderSeeds = Record<'400' | '500' | '600', number>

export function useBorderSeeds(config: ColorConfig, theme: Theme): BorderSeeds {
  return useMemo(() => {
    const { borders: _drop, ...rest } = config
    const baseline = config.borders ? resolveColorConfigCached(rest) : theme
    const bg = toOklch(baseline.light.background)
    const ratio = (step: '400' | '500' | '600') =>
      Math.round(
        wcag2(toOklch(baseline.light.scales.neutral![step]), bg) * 100,
      ) / 100
    return { '400': ratio('400'), '500': ratio('500'), '600': ratio('600') }
  }, [config, theme])
}

/**
 * The engine's advanced axes — vividness, hue shift, guarantee policy,
 * border contrast, exact-seed pinning. Every control stores `undefined` at
 * its default so an untouched recipe keeps encoding as the default.
 */
export function ColorFineTuneControls({
  seedDelta,
  borderSeeds,
}: {
  seedDelta?: number
  borderSeeds: BorderSeeds
}) {
  const {
    designSystem,
    setColorAxis,
    setColorGuaranteePolicy,
    setColorBorderTarget,
    setColorPreserveSeed,
  } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG

  const preserveSeed = config.preserveSeed ?? false
  // The simple tier drives the all-palette (`'*'`) targets; per-palette
  // entries stay a preset/config-level affair.
  const sharedBorders = config.borders?.['*']

  return (
    <div className="flex flex-col gap-3">
      <AxisSlider
        label="Vividness"
        value={config.vividness ?? 1}
        defaultValue={1}
        minValue={0}
        maxValue={2}
        step={0.05}
        formatValue={(v) => `${v.toFixed(2)}×`}
        onChange={(v) => setColorAxis('vividness', v)}
      />
      <AxisSlider
        label="Hue shift"
        value={config.hueShift ?? 1}
        defaultValue={1}
        minValue={0}
        maxValue={3}
        step={0.1}
        formatValue={(v) => `${v.toFixed(1)}×`}
        onChange={(v) => setColorAxis('hueShift', v)}
      />
      <Select
        className="w-full"
        selectedKey={config.guaranteePolicy ?? 'default'}
        onSelectionChange={(key) =>
          setColorGuaranteePolicy(
            key === 'relaxed' || key === 'strict' ? key : undefined,
          )
        }
      >
        <Label>Contrast guarantees</Label>
        <Button size="sm" className="w-full justify-between">
          <SelectValue className="truncate" />
          <ChevronDownIcon data-icon-end="" />
        </Button>
        <Popover>
          <ListBox>
            {GUARANTEE_POLICIES.map((policy) => (
              <ListBoxItem key={policy.id} id={policy.id}>
                {policy.label}
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </Select>

      <Switch
        size="sm"
        isSelected={sharedBorders !== undefined}
        onChange={(on) => {
          for (const { job } of BORDER_JOBS)
            setColorBorderTarget(job, on ? borderSeeds[job] : undefined)
        }}
      >
        Custom border contrast
      </Switch>
      {sharedBorders !== undefined &&
        BORDER_JOBS.map(({ job, label, maxValue }) => {
          const target = sharedBorders[job]
          return (
            <AxisSlider
              key={job}
              label={label}
              value={typeof target === 'number' ? target : borderSeeds[job]}
              defaultValue={borderSeeds[job]}
              minValue={1.05}
              maxValue={maxValue}
              step={0.01}
              formatValue={(v) => `${v.toFixed(2)}:1`}
              onChange={(v) => setColorBorderTarget(job, v)}
            />
          )
        })}

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
