'use client'

import { useMemo, useState } from 'react'
import { CheckIcon, PlusIcon, SparklesIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { wcag2 } from '@dotui/colors'

import { cn } from '@/registry/lib/utils'
import {
  DEFAULT_COLOR_CONFIG,
  PALETTE_ORDER,
  resolveColorConfig,
  STATUS_PALETTES,
} from '@/registry/theme'
import type { AlgorithmId, ColorKnobs, PaletteSeeds } from '@/registry/theme'

import { useDesignSystem } from '../preset'
import { useStudio } from './nav'
import {
  Group,
  Hint,
  type Option,
  RampStrip,
  ScreenHeader,
  SeedSwatch,
  Segmented,
  SelectField,
  SliderField,
  SwitchRow,
} from './primitives'

/* ------------------------------------------------------------------ *
 * Color Lab
 *
 * Two doors to the same engine:
 *   Simple   — one brand seed becomes a complete, accessible system.
 *   Advanced — every role, the generation algorithm, its knobs, whether
 *              palettes are exposed as foundations, and the semantic mapping.
 * ------------------------------------------------------------------ */

type SetKnob = <K extends keyof ColorKnobs>(
  key: K,
  value: ColorKnobs[K],
) => void

const STATUS_SET: readonly string[] = STATUS_PALETTES

const ALGORITHMS: ReadonlyArray<Option<AlgorithmId>> = [
  { id: 'oklch', label: 'OKLCH' },
  { id: 'tailwind', label: 'Tailwind' },
  { id: 'material', label: 'Material' },
  { id: 'contrast', label: 'Contrast' },
]

const ROLE_SEEDS: ReadonlyArray<{
  key: keyof PaletteSeeds
  label: string
  role: string
}> = [
  { key: 'neutral', label: 'Background', role: 'Surfaces & text' },
  { key: 'accent', label: 'Primary', role: 'Brand & actions' },
  { key: 'success', label: 'Success', role: 'Positive' },
  { key: 'warning', label: 'Warning', role: 'Caution' },
  { key: 'danger', label: 'Danger', role: 'Destructive' },
  { key: 'info', label: 'Info', role: 'Neutral status' },
]

const NEUTRAL_PRESETS = {
  gray: '#808080',
  warm: '#857f78',
  cool: '#787f85',
  tinted: '#7d7a85',
} as const

type Appearance = 'light' | 'dark'
type FoundationStyle = 'palettes' | 'semantic'

// A tasteful subset of the semantic vocabulary, surfaced as remappable tokens.
const SEMANTIC_TOKENS: ReadonlyArray<{ id: string; label: string }> = [
  { id: 'primary', label: 'Primary' },
  { id: 'bg', label: 'Background' },
  { id: 'muted', label: 'Muted' },
  { id: 'border', label: 'Border' },
  { id: 'ring', label: 'Focus ring' },
]

function bestContrast(solid: string): { ratio: number; on: 'white' | 'black' } {
  try {
    const onWhite = wcag2('#ffffff', solid)
    const onBlack = wcag2('#000000', solid)
    return onWhite >= onBlack
      ? { ratio: onWhite, on: 'white' }
      : { ratio: onBlack, on: 'black' }
  } catch {
    return { ratio: 0, on: 'white' }
  }
}

function midStep(ramp: Record<string, string>): string {
  if (ramp['500']) return ramp['500']
  const values = Object.values(ramp)
  return values[Math.floor(values.length / 2)] ?? '#888888'
}

export function ColorLab() {
  const { pop } = useStudio()
  const { designSystem, setColorSeed, setColorAlgorithm, setColorKnob } =
    useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const seeds = config.seeds
  const knobs = config.knobs ?? {}

  const [mode, setMode] = useState<'simple' | 'advanced'>('simple')
  const [appearance, setAppearance] = useState<Appearance>('light')
  const [foundationStyle, setFoundationStyle] =
    useState<FoundationStyle>('palettes')
  const [includeStatus, setIncludeStatus] = useState(true)
  const [mapping, setMapping] = useState<Record<string, string>>({
    primary: '500',
    bg: '50',
    muted: '100',
    border: '200',
    ring: '500',
  })

  const resolved = useMemo(() => resolveColorConfig(config), [config])
  const ramps = appearance === 'dark' ? resolved.dark : resolved.light
  const stepOptions: ReadonlyArray<Option<string>> = resolved.steps.map(
    (s) => ({
      id: s,
      label: s,
    }),
  )

  const visiblePalettes = PALETTE_ORDER.filter(
    (p) => includeStatus || !STATUS_SET.includes(p),
  )

  const showRamps = mode === 'simple' ? true : foundationStyle === 'palettes'

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title="Color" onBack={pop} />

      {/* Live system preview — the payoff, always on top */}
      <SystemSwatches ramps={ramps} palettes={visiblePalettes} />

      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { id: 'simple', label: 'Simple' },
          { id: 'advanced', label: 'Advanced' },
        ]}
      />

      {mode === 'simple' ? (
        <SimpleColor
          brand={seeds.accent}
          neutral={seeds.neutral}
          onBrand={(hex) => setColorSeed('accent', hex)}
          onNeutral={(hex) => setColorSeed('neutral', hex)}
          appearance={appearance}
          onAppearance={setAppearance}
          includeStatus={includeStatus}
          onIncludeStatus={setIncludeStatus}
        />
      ) : (
        <AdvancedColor
          seeds={seeds}
          onSeed={setColorSeed}
          algorithm={config.algorithm}
          onAlgorithm={setColorAlgorithm}
          knobs={knobs}
          onKnob={setColorKnob}
          stepOptions={stepOptions}
          includeStatus={includeStatus}
          foundationStyle={foundationStyle}
          onFoundationStyle={setFoundationStyle}
          mapping={mapping}
          onMapping={(id, step) =>
            setMapping((prev) => ({ ...prev, [id]: step }))
          }
        />
      )}

      {showRamps && (
        <Group label="Generated ramps">
          <div className="flex flex-col gap-1.5">
            {visiblePalettes.map((palette) => {
              const ramp = ramps[palette]
              if (!ramp) return null
              return (
                <div key={palette} className="flex items-center gap-2">
                  <span className="w-12 shrink-0 text-[10px] text-fg-muted capitalize">
                    {palette}
                  </span>
                  <RampStrip ramp={ramp} className="h-4 flex-1" />
                </div>
              )
            })}
          </div>
        </Group>
      )}

      <ContrastReadout ramps={ramps} palettes={visiblePalettes} />
    </div>
  )
}

/* ------------------------------ Simple ------------------------------ */

function SimpleColor({
  brand,
  neutral,
  onBrand,
  onNeutral,
  appearance,
  onAppearance,
  includeStatus,
  onIncludeStatus,
}: {
  brand: string
  neutral: string
  onBrand: (hex: string) => void
  onNeutral: (hex: string) => void
  appearance: Appearance
  onAppearance: (a: Appearance) => void
  includeStatus: boolean
  onIncludeStatus: (v: boolean) => void
}) {
  const neutralPreset =
    (Object.entries(NEUTRAL_PRESETS).find(
      ([, hex]) => hex.toLowerCase() === neutral.toLowerCase(),
    )?.[0] as keyof typeof NEUTRAL_PRESETS | undefined) ?? 'gray'

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl border bg-gradient-to-b from-muted/50 to-transparent p-4">
        <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-fg-muted">
          <SparklesIcon className="size-3.5" />
          One color in, a whole system out
        </div>
        <SeedSwatch
          label="Brand color"
          value={brand}
          onChange={onBrand}
          description="the seed"
        />
      </div>

      <SelectField
        label="Neutral character"
        value={neutralPreset}
        onChange={(key) => onNeutral(NEUTRAL_PRESETS[key])}
        options={[
          { id: 'gray', label: 'Pure gray' },
          { id: 'tinted', label: 'Tinted by brand' },
          { id: 'warm', label: 'Warm' },
          { id: 'cool', label: 'Cool' },
        ]}
        hint="How surfaces and text lean — true gray or subtly warmed."
      />

      <Segmented
        value={appearance}
        onChange={onAppearance}
        options={[
          { id: 'light', label: 'Light' },
          { id: 'dark', label: 'Dark' },
        ]}
      />

      <SwitchRow
        label="Status colors"
        hint="Generate success, warning, danger and info."
        value={includeStatus}
        onChange={onIncludeStatus}
      />
    </div>
  )
}

/* ----------------------------- Advanced ----------------------------- */

function AdvancedColor({
  seeds,
  onSeed,
  algorithm,
  onAlgorithm,
  knobs,
  onKnob,
  stepOptions,
  includeStatus,
  foundationStyle,
  onFoundationStyle,
  mapping,
  onMapping,
}: {
  seeds: PaletteSeeds
  onSeed: (key: keyof PaletteSeeds, hex: string) => void
  algorithm: AlgorithmId
  onAlgorithm: (a: AlgorithmId) => void
  knobs: ColorKnobs
  onKnob: SetKnob
  stepOptions: ReadonlyArray<Option<string>>
  includeStatus: boolean
  foundationStyle: FoundationStyle
  onFoundationStyle: (s: FoundationStyle) => void
  mapping: Record<string, string>
  onMapping: (id: string, step: string) => void
}) {
  const roles = ROLE_SEEDS.filter(
    (r) => includeStatus || !STATUS_SET.includes(r.key),
  )

  return (
    <div className="flex flex-col gap-6">
      <Group
        label="Foundations style"
        hint={
          foundationStyle === 'palettes'
            ? 'Numbered ramps (50–950) ship as tokens — full control.'
            : 'Only semantic roles ship. Ramps stay internal — cleaner output.'
        }
      >
        <Segmented
          value={foundationStyle}
          onChange={onFoundationStyle}
          options={[
            { id: 'palettes', label: 'Expose palettes' },
            { id: 'semantic', label: 'Semantic only' },
          ]}
        />
      </Group>

      <Group label="Roles">
        <div className="grid grid-cols-2 gap-x-3 gap-y-4">
          {roles.map((r) => (
            <SeedSwatch
              key={r.key}
              label={r.label}
              value={
                seeds[r.key] ?? DEFAULT_COLOR_CONFIG.seeds[r.key] ?? '#888'
              }
              onChange={(hex) => onSeed(r.key, hex)}
              description={r.role}
            />
          ))}
        </div>
        <ButtonPrimitives.Button className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed py-2 text-xs text-fg-muted focus-reset transition-colors hover:bg-neutral focus-visible:focus-ring">
          <PlusIcon className="size-3.5" />
          Add custom palette
        </ButtonPrimitives.Button>
      </Group>

      <Group
        label="Generation algorithm"
        hint="The math that turns each seed into a ramp."
      >
        <Segmented
          value={algorithm}
          onChange={onAlgorithm}
          options={ALGORITHMS}
        />
        <AlgorithmKnobs
          algorithm={algorithm}
          knobs={knobs}
          onKnob={onKnob}
          stepOptions={stepOptions}
        />
      </Group>

      <Group
        label="Semantic mapping"
        hint="Which ramp step each role token points to."
      >
        <div className="flex flex-col gap-3">
          {SEMANTIC_TOKENS.map((token) => (
            <div
              key={token.id}
              className="flex items-center justify-between gap-3"
            >
              <span className="font-mono text-xs text-fg-muted">
                --color-{token.id}
              </span>
              <div className="w-28">
                <SelectField
                  value={mapping[token.id] ?? '500'}
                  onChange={(step) => onMapping(token.id, step)}
                  options={stepOptions}
                />
              </div>
            </div>
          ))}
        </div>
      </Group>
    </div>
  )
}

function AlgorithmKnobs({
  algorithm,
  knobs,
  onKnob,
  stepOptions,
}: {
  algorithm: AlgorithmId
  knobs: ColorKnobs
  onKnob: SetKnob
  stepOptions: ReadonlyArray<Option<string>>
}) {
  if (algorithm === 'oklch' || algorithm === 'tailwind') {
    return (
      <div className="flex flex-col gap-4 pt-1">
        <SliderField
          label="Chroma"
          value={knobs.chromaMult ?? 1}
          minValue={0}
          maxValue={2}
          step={0.05}
          onChange={(v) => onKnob('chromaMult', v)}
          format={(v) => `${v.toFixed(2)}×`}
        />
        <SliderField
          label="Min chroma"
          value={knobs.minChroma ?? 0.11}
          minValue={0}
          maxValue={0.2}
          step={0.005}
          onChange={(v) => onKnob('minChroma', v)}
          format={(v) => v.toFixed(3)}
        />
        <SliderField
          label="Hue shift"
          value={knobs.hueTorsion ?? 0}
          minValue={-40}
          maxValue={40}
          step={1}
          onChange={(v) => onKnob('hueTorsion', v)}
          format={(v) => `${v}°`}
        />
        <SelectField
          label="Chroma mode"
          value={knobs.chromaMode ?? 'consistent'}
          onChange={(v) => onKnob('chromaMode', v as 'consistent' | 'max')}
          options={[
            { id: 'consistent', label: 'Consistent' },
            { id: 'max', label: 'Vivid (gamut cusp)' },
          ]}
        />
        <SelectField
          label="Pin seed lightness at"
          value={knobs.preserveSeedAt ?? 'off'}
          onChange={(v) =>
            onKnob('preserveSeedAt', v === 'off' ? undefined : v)
          }
          options={[{ id: 'off', label: 'Off' }, ...stepOptions]}
        />
      </div>
    )
  }
  if (algorithm === 'contrast') {
    return (
      <div className="flex flex-col gap-4 pt-1">
        <SelectField
          label="Contrast formula"
          value={knobs.formula ?? 'wcag2'}
          onChange={(v) => onKnob('formula', v as 'wcag2' | 'apca')}
          options={[
            { id: 'wcag2', label: 'WCAG 2' },
            { id: 'apca', label: 'APCA' },
          ]}
        />
        <SliderField
          label="Saturation"
          value={knobs.saturation ?? 100}
          minValue={0}
          maxValue={100}
          step={1}
          onChange={(v) => onKnob('saturation', v)}
          format={(v) => `${v}%`}
        />
      </div>
    )
  }
  return (
    <Hint>
      Material derives tones automatically — a tone editor lands later.
    </Hint>
  )
}

/* ----------------------------- Displays ----------------------------- */

function SystemSwatches({
  ramps,
  palettes,
}: {
  ramps: Record<string, Record<string, string>>
  palettes: readonly string[]
}) {
  return (
    <div className="flex gap-1.5">
      {palettes.map((palette) => {
        const ramp = ramps[palette]
        if (!ramp) return null
        const solid = midStep(ramp)
        return (
          <div
            key={palette}
            className="flex h-14 flex-1 flex-col overflow-hidden rounded-lg border"
            title={palette}
          >
            <div className="flex-1" style={{ backgroundColor: solid }} />
            <div className="flex h-4">
              {[
                ramp['100'] ?? solid,
                ramp['300'] ?? solid,
                ramp['700'] ?? solid,
              ].map((c, i) => (
                <div
                  key={i}
                  className="flex-1"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ContrastReadout({
  ramps,
  palettes,
}: {
  ramps: Record<string, Record<string, string>>
  palettes: readonly string[]
}) {
  const rows = useMemo(
    () =>
      palettes
        .map((palette) => {
          const ramp = ramps[palette]
          if (!ramp) return null
          const solid = midStep(ramp)
          const { ratio, on } = bestContrast(solid)
          const level = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'fail'
          return { palette, solid, ratio, on, level }
        })
        .filter(Boolean) as Array<{
        palette: string
        solid: string
        ratio: number
        on: 'white' | 'black'
        level: string
      }>,
    [ramps, palettes],
  )

  return (
    <Group label="Accessibility">
      <div className="flex flex-col gap-1.5">
        {rows.map((row) => (
          <div
            key={row.palette}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm"
            style={{ backgroundColor: row.solid, color: row.on }}
          >
            <span className="flex-1 font-medium capitalize">{row.palette}</span>
            <span className="font-mono text-xs tabular-nums opacity-80">
              {row.ratio.toFixed(1)}
            </span>
            <span
              className={cn(
                'flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                row.level === 'fail' ? 'bg-black/20' : 'bg-white/20',
              )}
            >
              {row.level !== 'fail' && <CheckIcon className="size-2.5" />}
              {row.level === 'fail' ? 'Low' : row.level}
            </span>
          </div>
        ))}
      </div>
    </Group>
  )
}
