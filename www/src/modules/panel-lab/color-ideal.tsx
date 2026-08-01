'use client'

/* The ideal Color section — engine-true. State maps 1:1 onto ColorConfig v2
   (one required seed, Auto everywhere else), the hero shows REAL engine ramps
   per mode, and Fine-tune exposes the engine's actual axes (vividness, hue
   shift, gray tint, guarantees, borders, seed pinning) instead of invented
   knobs. */

import { useMemo, useState } from 'react'
import {
  CheckIcon,
  MoonIcon,
  RotateCcwIcon,
  SunIcon,
  TriangleAlertIcon,
} from 'lucide-react'

import { STEPS, toHex, toOklch, wcag2 } from '@dotui/colors'
import type { StepName, Theme } from '@dotui/colors'

import { resolveColorConfigCached } from '@/lib/resolve-color'
import { cn } from '@/registry/lib/utils'
import type { ColorConfig } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { ColorPicker } from '@/registry/ui/color-picker'
import { ColorSwatch } from '@/registry/ui/color-swatch'
import {
  Slider,
  SliderControl,
  SliderFill,
  SliderThumb,
  SliderTrack,
} from '@/registry/ui/slider'
import { Switch, SwitchControl } from '@/registry/ui/switch'
import {
  ColorPickerRow,
  ControlGroup,
  GroupCaption,
  MiniSegmented,
  MiniSwitch,
  ParamRow,
  ROW,
  ROW_LABEL,
  ROW_VALUE,
} from '@/modules/control-lab/rows'

import { DEFAULTS, PRIMARY_OPTIONS } from './data'
import type { Lab, LabState } from './data'
import {
  DetailRow,
  PickerPopoverContent,
  SegmentedControlRow,
  SwatchDots,
} from './patterns'

type Mode = 'light' | 'dark'

/* ------------------------------ Config bridge ------------------------------ */

/** Lab state → ColorConfig, undefined at every default so the recipe stays
 *  minimal — the same absent-means-default contract the real config keeps. */
function useLabConfig(state: LabState): ColorConfig {
  const {
    brand,
    primary,
    graySeed,
    successSeed,
    warningSeed,
    dangerSeed,
    infoSeed,
    selectionSeed,
    bgLight,
    bgDark,
    vividness,
    hueShift,
    grayTintAmount,
    preserveSeed,
    guarantees,
    borderContrast,
    border400,
    border500,
    border600,
  } = state
  return useMemo<ColorConfig>(
    () => ({
      v: 2,
      seeds: {
        accent: brand,
        neutral: graySeed || undefined,
        success: successSeed || undefined,
        warning: warningSeed || undefined,
        danger: dangerSeed || undefined,
        info: infoSeed || undefined,
        selection: selectionSeed || undefined,
      },
      background: {
        light: bgLight,
        dark: bgDark === 0 ? 'oled' : bgDark,
      },
      vividness: vividness === 1 ? undefined : vividness,
      hueShift: hueShift === 1 ? undefined : hueShift,
      neutralTint: grayTintAmount === 1 ? undefined : grayTintAmount,
      preserveSeed: preserveSeed || undefined,
      guaranteePolicy:
        guarantees === 'relaxed' || guarantees === 'strict'
          ? guarantees
          : undefined,
      primary: primary === 'accent' ? 'accent' : undefined,
      borders: borderContrast
        ? {
            '*': {
              '400': border400 > 0 ? border400 : undefined,
              '500': border500 > 0 ? border500 : undefined,
              '600': border600 > 0 ? border600 : undefined,
            },
          }
        : undefined,
    }),
    [
      brand,
      primary,
      graySeed,
      successSeed,
      warningSeed,
      dangerSeed,
      infoSeed,
      selectionSeed,
      bgLight,
      bgDark,
      vividness,
      hueShift,
      grayTintAmount,
      preserveSeed,
      guarantees,
      borderContrast,
      border400,
      border500,
      border600,
    ],
  )
}

/** WCAG of the untouched borders vs the app background — the border sliders'
 *  stable zero point, measured with any border targets stripped. */
function useBorderSeeds(config: ColorConfig) {
  return useMemo(() => {
    const { borders: _drop, ...rest } = config
    const baseline = resolveColorConfigCached(config.borders ? rest : config)
    const bg = toOklch(baseline.light.background)
    const ratio = (step: '400' | '500' | '600') => {
      const color = baseline.light.scales.neutral?.[step]
      return color ? Math.round(wcag2(toOklch(color), bg) * 100) / 100 : 1.05
    }
    return { '400': ratio('400'), '500': ratio('500'), '600': ratio('600') }
  }, [config])
}

function cssToHex(css: string): string {
  return toHex(toOklch(css))
}

/* ---------------------------------- Hero ----------------------------------- */

/**
 * Light/dark is a real binary, so it's a Switch underneath (one focusable
 * control, native isSelected/onChange) — but skinned to the exact look of the
 * old two-icon MiniSegmented pill. The highlight is one element translating
 * between icon slots, so — unlike a toggle-button group swapping `selected:`
 * backgrounds instantly — it glides.
 */
function ModeSwitch({
  mode,
  onChange,
}: {
  mode: Mode
  onChange: (mode: Mode) => void
}) {
  const isDark = mode === 'dark'
  return (
    <Switch
      aria-label="Ramp preview mode"
      isSelected={isDark}
      onChange={(selected) => onChange(selected ? 'dark' : 'light')}
    >
      <SwitchControl className="h-7 shrink-0 cursor-interactive gap-0 rounded-md bg-bg/50 p-0.5">
        <span className="relative flex h-6 items-center gap-0.5">
          <span
            aria-hidden
            className={cn(
              'absolute inset-y-0 left-0 w-7 rounded-[5px] bg-highlight transition-transform duration-200 ease-out',
              isDark && 'translate-x-[calc(100%+0.125rem)]',
            )}
          />
          <span
            className={cn(
              'relative z-10 flex h-6 w-7 items-center justify-center',
              isDark ? 'text-fg-muted' : 'text-fg',
            )}
          >
            <SunIcon className="size-3" />
          </span>
          <span
            className={cn(
              'relative z-10 flex h-6 w-7 items-center justify-center',
              isDark ? 'text-fg' : 'text-fg-muted',
            )}
          >
            <MoonIcon className="size-3" />
          </span>
        </span>
      </SwitchControl>
    </Switch>
  )
}

const HERO_PALETTES = ['accent', 'neutral'] as const

/** Real engine output as the section's opening visual: brand + gray ramps in
 *  the chosen mode, steps tappable to inspect, the report's verdict on top
 *  and the seed's snap price (with a pin shortcut) below. */
function EngineHero({
  lab,
  theme,
  mode,
  onModeChange,
}: {
  lab: Lab
  theme: Theme
  mode: Mode
  onModeChange: (mode: Mode) => void
}) {
  const { state, set } = lab
  const [inspect, setInspect] = useState<{
    palette: string
    step: StepName
  } | null>(null)

  const m = theme[mode]
  const bg = toOklch(m.background)
  const warnings = theme.report.warnings.length
  const delta = theme.report.seedDelta.accent ?? 0
  const inspected = inspect ? m.scales[inspect.palette]?.[inspect.step] : null

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-muted p-3">
      <div className="flex items-center justify-between gap-3">
        <span
          className="flex min-w-0 items-center gap-1.5 text-xs text-fg-muted"
          title={theme.report.warnings.join('\n') || undefined}
        >
          {warnings === 0 ? (
            <CheckIcon className="size-3 shrink-0" />
          ) : (
            <TriangleAlertIcon className="size-3 shrink-0 text-fg-warning" />
          )}
          <span className="truncate">
            {warnings === 0
              ? 'Contrast guarantees pass'
              : `${warnings} contrast warning${warnings === 1 ? '' : 's'}`}
          </span>
        </span>
        <ModeSwitch mode={mode} onChange={onModeChange} />
      </div>

      {HERO_PALETTES.map((palette) => (
        <div key={palette} className="flex h-5 overflow-hidden rounded-md">
          {STEPS.map((step) => {
            const selected =
              inspect?.palette === palette && inspect.step === step
            return (
              <button
                key={step}
                type="button"
                aria-label={`Inspect ${palette} ${step}`}
                aria-pressed={selected}
                className={cn(
                  'flex-1 cursor-interactive focus-reset focus-visible:z-10 focus-visible:focus-ring',
                  selected && 'z-10 rounded-[3px] ring-2 ring-bg ring-inset',
                )}
                style={{ backgroundColor: m.scales[palette]?.[step] }}
                onClick={() => setInspect(selected ? null : { palette, step })}
              />
            )
          })}
        </div>
      ))}

      {inspect && inspected && (
        <div className="flex items-center justify-between gap-3 font-mono text-xs text-fg-muted tabular-nums">
          <span>
            {inspect.palette} · {inspect.step}
          </span>
          <span className="flex items-center gap-3">
            <span className="uppercase">{cssToHex(inspected)}</span>
            <span>{wcag2(toOklch(inspected), bg).toFixed(2)}:1 vs bg</span>
          </span>
        </div>
      )}

      {state.preserveSeed ? (
        <p className="text-xs text-fg-muted">
          Brand pinned verbatim — any contrast cost is priced in the report.
        </p>
      ) : delta >= 0.005 ? (
        <div className="flex items-center justify-between gap-3 text-xs text-fg-muted">
          <span className="truncate">
            Brand snapped ΔE {delta.toFixed(3)} for contrast
          </span>
          <Button
            size="xs"
            variant="quiet"
            className="shrink-0"
            onPress={() => set('preserveSeed')(true)}
          >
            Pin exact
          </Button>
        </div>
      ) : null}
    </div>
  )
}

/* -------------------------------- Auto rows -------------------------------- */

/** A seed row that reads “Auto” (showing the engine's derived color) until
 *  overridden — the panel face of absent-means-default. Reset returns to Auto. */
function AutoColorRow({
  label,
  value,
  derived,
  onChange,
  onReset,
}: {
  label: string
  /** '' = Auto. */
  value: string
  /** The engine's derived color while Auto (any CSS color). */
  derived: string
  onChange: (hex: string) => void
  onReset: () => void
}) {
  return (
    <ColorPicker
      value={value || cssToHex(derived)}
      onChange={(c) => onChange(c.toString('hex'))}
    >
      {({ color }) => (
        <div
          data-row=""
          className={cn(ROW, 'flex items-center gap-0.5 pr-1.5')}
        >
          <Button
            variant="quiet"
            className="flex h-full min-w-0 flex-1 items-center justify-between gap-3 rounded-none px-4 font-normal"
          >
            <span className={ROW_LABEL}>{label}</span>
            <span className="flex shrink-0 items-center gap-2.5">
              <span className={cn(ROW_VALUE, value && 'font-mono uppercase')}>
                {value ? color.toString('hex') : 'Auto'}
              </span>
              <ColorSwatch className="size-5 rounded-full" />
            </span>
          </Button>
          {value !== '' && (
            <Button
              size="xs"
              variant="quiet"
              isIconOnly
              aria-label={`Reset ${label} to auto`}
              onPress={onReset}
              className="shrink-0 text-fg-muted"
            >
              <RotateCcwIcon />
            </Button>
          )}
          <PickerPopoverContent />
        </div>
      )}
    </ColorPicker>
  )
}

/** AutoColorRow at sub-row scale, for the semantic seeds inside a DetailRow. */
function MiniAutoColorRow({
  label,
  value,
  derived,
  onChange,
  onReset,
}: {
  label: string
  value: string
  derived: string
  onChange: (hex: string) => void
  onReset: () => void
}) {
  return (
    <ColorPicker
      value={value || cssToHex(derived)}
      onChange={(c) => onChange(c.toString('hex'))}
    >
      {({ color }) => (
        <div className="flex items-center gap-0.5">
          <Button
            variant="quiet"
            className="flex h-9 min-w-0 flex-1 items-center justify-between gap-3 rounded-lg px-2 font-normal"
          >
            <span className="truncate text-xs text-fg-muted">{label}</span>
            <span className="flex shrink-0 items-center gap-2">
              <span className="font-mono text-xs text-fg-muted uppercase">
                {value ? color.toString('hex') : 'Auto'}
              </span>
              <ColorSwatch className="size-4 rounded-full" />
            </span>
          </Button>
          {value !== '' && (
            <Button
              size="xs"
              variant="quiet"
              isIconOnly
              aria-label={`Reset ${label} to auto`}
              onPress={onReset}
              className="shrink-0 text-fg-muted"
            >
              <RotateCcwIcon />
            </Button>
          )}
          <PickerPopoverContent />
        </div>
      )}
    </ColorPicker>
  )
}

/* ------------------------------- Mini slider ------------------------------- */

/** A continuous axis at sub-row scale: label left, compact drag pill + value
 *  right — the engine's sliders in the mini-control language. */
function MiniSliderRow({
  label,
  value,
  onChange,
  minValue,
  maxValue,
  step,
  format,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  minValue: number
  maxValue: number
  step: number
  format: (value: number) => string
}) {
  return (
    <div className="flex h-9 items-center justify-between gap-3 px-2">
      <span className="truncate text-xs text-fg-muted">{label}</span>
      <span className="flex shrink-0 items-center gap-2">
        <Slider
          aria-label={label}
          value={value}
          minValue={minValue}
          maxValue={maxValue}
          step={step}
          onChange={(v) => onChange(v as number)}
          className="relative w-24"
        >
          <SliderControl>
            <SliderTrack className="relative h-5 overflow-hidden rounded-md bg-bg/50">
              <SliderFill className="absolute inset-y-0 left-0 bg-highlight" />
            </SliderTrack>
            <SliderThumb className="absolute top-1/2 z-10 h-3.5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg/25" />
          </SliderControl>
        </Slider>
        <span className="w-14 text-right font-mono text-xs text-fg-muted tabular-nums">
          {format(value)}
        </span>
      </span>
    </div>
  )
}

/* --------------------------------- Section --------------------------------- */

const GUARANTEE_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'relaxed', label: 'Relaxed' },
  { value: 'strict', label: 'Strict' },
]

const FINE_KEYS = [
  'vividness',
  'hueShift',
  'grayTintAmount',
  'preserveSeed',
  'guarantees',
  'borderContrast',
] as const

const SEMANTIC_SEEDS = [
  { key: 'successSeed', palette: 'success', label: 'Success' },
  { key: 'warningSeed', palette: 'warning', label: 'Warning' },
  { key: 'dangerSeed', palette: 'danger', label: 'Danger' },
  { key: 'infoSeed', palette: 'info', label: 'Info' },
] as const

const BORDER_JOBS = [
  { key: 'border400', job: '400', label: 'Border · subtle', maxValue: 3 },
  { key: 'border500', job: '500', label: 'Border · interactive', maxValue: 4 },
  { key: 'border600', job: '600', label: 'Border · emphasized', maxValue: 8 },
] as const

export function IdealColorSectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  const [mode, setMode] = useState<Mode>('light')

  const config = useLabConfig(state)
  const theme = resolveColorConfigCached(config)
  const borderSeeds = useBorderSeeds(config)
  const m = theme[mode]

  const solid = (palette: string) => m.scales[palette]?.['700'] ?? m.background
  const selectionDerived =
    m.scales.selection?.['700'] ??
    (state.primary === 'accent' ? solid('accent') : solid('neutral'))

  const semanticModified =
    SEMANTIC_SEEDS.some(({ key }) => state[key] !== '') ||
    state.selectionSeed !== ''
  const fineModified = FINE_KEYS.some((key) => state[key] !== DEFAULTS[key])
  const bgModified =
    state.bgLight !== DEFAULTS.bgLight || state.bgDark !== DEFAULTS.bgDark

  const setBorderContrast = (on: boolean) => {
    set('borderContrast')(on)
    for (const { key, job } of BORDER_JOBS) set(key)(on ? borderSeeds[job] : 0)
  }

  return (
    <>
      <EngineHero lab={lab} theme={theme} mode={mode} onModeChange={setMode} />
      <ControlGroup>
        <ColorPickerRow
          label="Brand"
          value={state.brand}
          onChange={set('brand')}
        />
        <AutoColorRow
          label="Gray"
          value={state.graySeed}
          derived={m.scales.neutral?.['500'] ?? m.background}
          onChange={set('graySeed')}
          onReset={() => set('graySeed')('')}
        />
        <SegmentedControlRow
          label="Primary"
          value={state.primary}
          onChange={set('primary')}
          options={PRIMARY_OPTIONS}
        />
      </ControlGroup>
      <GroupCaption>
        One required seed. Every Auto row derives from it — override any, reset
        back anytime.
      </GroupCaption>
      <DetailRow
        label="Background"
        summary={
          bgModified ? (
            <SwatchDots
              colors={[theme.light.background, theme.dark.background]}
            />
          ) : (
            'Default'
          )
        }
      >
        <MiniSliderRow
          label="Light"
          value={state.bgLight}
          onChange={set('bgLight')}
          minValue={90}
          maxValue={100}
          step={0.5}
          format={(v) => `L* ${v.toFixed(1)}`}
        />
        <MiniSliderRow
          label="Dark"
          value={state.bgDark}
          onChange={set('bgDark')}
          minValue={0}
          maxValue={20}
          step={0.5}
          format={(v) => (v === 0 ? 'OLED' : `L* ${v.toFixed(1)}`)}
        />
      </DetailRow>
      <DetailRow
        label="Semantic colors"
        summary={
          <span className="flex items-center gap-1.5">
            {semanticModified ? null : <span className={ROW_VALUE}>Auto</span>}
            <SwatchDots
              colors={SEMANTIC_SEEDS.map(({ palette }) => solid(palette))}
            />
          </span>
        }
      >
        {SEMANTIC_SEEDS.map(({ key, palette, label }) => (
          <MiniAutoColorRow
            key={key}
            label={label}
            value={state[key]}
            derived={solid(palette)}
            onChange={set(key)}
            onReset={() => set(key)('')}
          />
        ))}
        <MiniAutoColorRow
          label="Selection"
          value={state.selectionSeed}
          derived={selectionDerived}
          onChange={set('selectionSeed')}
          onReset={() => set('selectionSeed')('')}
        />
      </DetailRow>
      <DetailRow
        label="Fine-tune"
        summary={fineModified ? 'Custom' : 'Default'}
      >
        <MiniSliderRow
          label="Vividness"
          value={state.vividness}
          onChange={set('vividness')}
          minValue={0}
          maxValue={2}
          step={0.05}
          format={(v) => `${v.toFixed(2)}×`}
        />
        <MiniSliderRow
          label="Hue shift"
          value={state.hueShift}
          onChange={set('hueShift')}
          minValue={0}
          maxValue={3}
          step={0.1}
          format={(v) => `${v.toFixed(1)}×`}
        />
        <MiniSliderRow
          label="Gray tint"
          value={state.grayTintAmount}
          onChange={set('grayTintAmount')}
          minValue={0}
          maxValue={4}
          step={0.1}
          format={(v) => (v === 0 ? 'Pure' : `${v.toFixed(1)}×`)}
        />
        <ParamRow label="Guarantees">
          <MiniSegmented
            ariaLabel="Contrast guarantees"
            value={state.guarantees}
            onChange={set('guarantees')}
            options={GUARANTEE_OPTIONS}
          />
        </ParamRow>
        <ParamRow label="Pin brand seed">
          <MiniSwitch
            ariaLabel="Pin exact brand color"
            value={state.preserveSeed}
            onChange={set('preserveSeed')}
          />
        </ParamRow>
        <ParamRow label="Custom borders">
          <MiniSwitch
            ariaLabel="Custom border contrast"
            value={state.borderContrast}
            onChange={setBorderContrast}
          />
        </ParamRow>
        {state.borderContrast &&
          BORDER_JOBS.map(({ key, job, label, maxValue }) => (
            <MiniSliderRow
              key={key}
              label={label}
              value={state[key] > 0 ? state[key] : borderSeeds[job]}
              onChange={set(key)}
              minValue={1.05}
              maxValue={maxValue}
              step={0.01}
              format={(v) => `${v.toFixed(2)}:1`}
            />
          ))}
      </DetailRow>
    </>
  )
}
