'use client'

/* Color v2 — the working Colors frame, forked from color-ideal (v1's frozen
   body). What changed and why:

   - Surfaces moved out: background lightness now lives in its own Surfaces
     section (surfaces.tsx) — it's a canvas decision, not a seed decision.
   - Brand gets quick-pick swatches: one tap to try a color, picker for exact.
   - Gray is a mental model, not a hex: Auto (tint slider, 0 = pure gray) or
     Custom seed — and the tint slider leaves Fine-tune, since it only ever
     affected gray.
   - The hero explains itself: contrast warnings expand to the actual
     messages, and an inspected step's hex is one tap to copy.
   - Deliberately no token-overrides view: re-pointing semantic tokens is an
     expert/export-layer concern, not part of choosing colors. */

import { useState } from 'react'
import {
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  MoonIcon,
  RotateCcwIcon,
  SunIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { Button as RacButton } from 'react-aria-components'

import { STEPS, toOklch, wcag2 } from '@dotui/colors'
import type { StepName, Theme } from '@dotui/colors'

import { resolveColorConfigCached } from '@/lib/resolve-color'
import { cn } from '@/registry/lib/utils'
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

import { ACCENT_POOL, DEFAULTS, PRIMARY_OPTIONS } from '../data'
import type { Lab, LabState } from '../data'
import {
  DetailRow,
  PickerPopoverContent,
  SegmentedControlRow,
  SwatchDots,
} from '../patterns'
import { cssToHex, useBorderSeeds, useLabConfig } from './engine-562'

type Mode = 'light' | 'dark'

/* ---------------------------------- Hero ----------------------------------- */

/** Light/dark as a Switch skinned to a two-icon pill — one focusable control,
 *  the highlight gliding between slots (see color-ideal for the rationale). */
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

/** The engine's output as the opening visual — v2 adds an expandable warning
 *  list (tap the verdict) and one-tap hex copy on the inspected step. */
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
  const [showWarnings, setShowWarnings] = useState(false)
  const [copied, setCopied] = useState(false)

  const m = theme[mode]
  const bg = toOklch(m.background)
  const warnings = theme.report.warnings
  const delta = theme.report.seedDelta.accent ?? 0
  const inspected = inspect ? m.scales[inspect.palette]?.[inspect.step] : null

  const copyHex = (hex: string) => {
    void navigator.clipboard?.writeText(hex)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-muted p-3">
      <div className="flex items-center justify-between gap-3">
        {warnings.length === 0 ? (
          <span className="flex min-w-0 items-center gap-1.5 text-xs text-fg-muted">
            <CheckIcon className="size-3 shrink-0" />
            <span className="truncate">Contrast guarantees pass</span>
          </span>
        ) : (
          <RacButton
            className="flex min-w-0 cursor-interactive items-center gap-1.5 text-xs text-fg-muted focus-reset transition-colors hover:text-fg focus-visible:focus-ring"
            onPress={() => setShowWarnings((v) => !v)}
          >
            <TriangleAlertIcon className="size-3 shrink-0 text-fg-warning" />
            <span className="truncate">
              {warnings.length} contrast warning
              {warnings.length === 1 ? '' : 's'}
            </span>
            <ChevronDownIcon
              className={cn(
                'size-3 shrink-0 transition-transform duration-200',
                showWarnings && 'rotate-180',
              )}
            />
          </RacButton>
        )}
        <ModeSwitch mode={mode} onChange={onModeChange} />
      </div>

      {showWarnings && warnings.length > 0 && (
        <ul className="flex flex-col gap-1">
          {warnings.map((warning, i) => (
            <li key={i} className="text-[11px]/snug text-fg-muted">
              {warning}
            </li>
          ))}
        </ul>
      )}

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
                onClick={() => {
                  setInspect(selected ? null : { palette, step })
                  setCopied(false)
                }}
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
            <RacButton
              aria-label="Copy hex"
              className="flex cursor-interactive items-center gap-1.5 uppercase focus-reset transition-colors hover:text-fg focus-visible:focus-ring"
              onPress={() => copyHex(cssToHex(inspected))}
            >
              {cssToHex(inspected)}
              {copied ? (
                <CheckIcon className="size-3" />
              ) : (
                <CopyIcon className="size-3" />
              )}
            </RacButton>
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

/* ------------------------------ Quick swatches ------------------------------ */

/** Curated brand colors, one tap each — trying a direction shouldn't take a
 *  picker round-trip. The exact color still comes from the Brand row above. */
function SwatchRow({
  value,
  onChange,
}: {
  value: string
  onChange: (hex: string) => void
}) {
  return (
    <div
      data-row=""
      className={cn(ROW, 'flex items-center justify-between gap-3 px-4')}
    >
      <span className={ROW_LABEL}>Swatches</span>
      <span className="flex shrink-0 items-center gap-2">
        {ACCENT_POOL.map((hex) => {
          const active = hex.toLowerCase() === value.toLowerCase()
          return (
            <button
              key={hex}
              type="button"
              aria-label={`Use ${hex} as the brand color`}
              aria-pressed={active}
              className={cn(
                'size-5 cursor-interactive rounded-full focus-reset transition-shadow focus-visible:focus-ring',
                active && 'ring-2 ring-fg/50 ring-offset-2 ring-offset-muted',
              )}
              style={{ backgroundColor: hex }}
              onClick={() => onChange(hex)}
            />
          )
        })}
      </span>
    </div>
  )
}

/* -------------------------------- Mini rows -------------------------------- */

/** A seed sub-row that reads “Auto” (showing the engine's derived color) until
 *  overridden. Reset returns to Auto. */
function MiniAutoColorRow({
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

/** A continuous axis at sub-row scale: label left, compact drag pill + value
 *  right. */
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

const GRAY_MODE_OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: 'custom', label: 'Custom' },
]

const FINE_KEYS = [
  'vividness',
  'hueShift',
  'preserveSeed',
  'guarantees',
  'borderContrast',
] as const satisfies readonly (keyof LabState)[]

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

export function ColorSectionV2Body({ lab }: { lab: Lab }) {
  const { state, set } = lab
  const [mode, setMode] = useState<Mode>('light')

  const config = useLabConfig(state)
  const theme = resolveColorConfigCached(config)
  const borderSeeds = useBorderSeeds(config)
  const m = theme[mode]

  const solid = (palette: string) => m.scales[palette]?.['700'] ?? m.background
  const gray500 = m.scales.neutral?.['500'] ?? m.background
  const selectionDerived =
    m.scales.selection?.['700'] ??
    (state.primary === 'accent' ? solid('accent') : solid('neutral'))

  const grayMode = state.graySeed ? 'custom' : 'auto'
  const grayLabel = state.graySeed
    ? 'Custom'
    : state.grayTintAmount === 0
      ? 'Pure'
      : 'Auto'

  const semanticModified =
    SEMANTIC_SEEDS.some(({ key }) => state[key] !== '') ||
    state.selectionSeed !== ''
  const fineModified = FINE_KEYS.some((key) => state[key] !== DEFAULTS[key])

  const setGrayMode = (next: string) =>
    set('graySeed')(next === 'custom' ? cssToHex(gray500) : '')

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
        <SwatchRow value={state.brand} onChange={set('brand')} />
        <SegmentedControlRow
          label="Primary"
          value={state.primary}
          onChange={set('primary')}
          options={PRIMARY_OPTIONS}
        />
      </ControlGroup>
      <GroupCaption>
        One required seed — every ramp derives from it, solved for contrast in
        both modes. Override any Auto below, reset back anytime.
      </GroupCaption>
      <DetailRow
        label="Gray"
        summary={
          <span className="flex items-center gap-1.5">
            <span className={ROW_VALUE}>{grayLabel}</span>
            <SwatchDots colors={[gray500]} />
          </span>
        }
      >
        <ParamRow label="Seed">
          <MiniSegmented
            ariaLabel="Gray seed"
            value={grayMode}
            onChange={setGrayMode}
            options={GRAY_MODE_OPTIONS}
          />
        </ParamRow>
        {grayMode === 'auto' ? (
          <MiniSliderRow
            label="Brand tint"
            value={state.grayTintAmount}
            onChange={set('grayTintAmount')}
            minValue={0}
            maxValue={4}
            step={0.1}
            format={(v) => (v === 0 ? 'Pure' : `${v.toFixed(1)}×`)}
          />
        ) : (
          <MiniAutoColorRow
            label="Seed color"
            value={state.graySeed}
            derived={gray500}
            onChange={set('graySeed')}
            onReset={() => set('graySeed')('')}
          />
        )}
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
