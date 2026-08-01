'use client'

/* Color v2 — the enhanced Color section, plus the Surfaces section it hands
   backgrounds off to. Still engine-true (state maps 1:1 onto ColorConfig v2);
   the changes are experiential:

   - Suggestions row: one-tap curated brand seeds — playable without a picker.
   - Gray graduates to a detail row with explicit Auto / Pure / Custom modes,
     absorbing the tint axis that used to hide in Fine-tune.
   - Contrast warnings expand in place instead of hiding in a tooltip.
   - No tokens view, and no backgrounds here: surfaces are their own section,
     previewing the derived ladder (bg → card → muted → highlight) per mode. */

import { useState } from 'react'
import { CheckIcon, TriangleAlertIcon } from 'lucide-react'
import { Button as RacButton } from 'react-aria-components'

import { STEPS, toOklch, wcag2 } from '@dotui/colors'
import type { StepName, Theme } from '@dotui/colors'

import { resolveColorConfigCached } from '@/lib/resolve-color'
import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import {
  ColorPickerRow,
  ControlGroup,
  GroupCaption,
  MiniSegmented,
  MiniSwitch,
  ParamRow,
  ROW,
  ROW_LABEL,
  SliderRow,
} from '@/modules/control-lab/rows'

import {
  BORDER_JOBS,
  cssToHex,
  GUARANTEE_OPTIONS,
  MiniAutoColorRow,
  MiniSliderRow,
  ModeSwitch,
  SEMANTIC_SEEDS,
  useBorderSeeds,
  useLabConfig,
} from './color-ideal'
import type { Mode } from './color-ideal'
import { ACCENT_POOL, DEFAULTS } from './data'
import type { Lab } from './data'
import { DetailRow, SegmentedControlRow, SwatchDots } from './patterns'

/* ---------------------------------- Hero ----------------------------------- */

const HERO_PALETTES = ['accent', 'neutral'] as const

/** The v1 hero with two upgrades: ramp steps crossfade on seed changes, and
 *  the warnings verdict expands in place to the report's actual sentences. */
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

  const m = theme[mode]
  const bg = toOklch(m.background)
  const warnings = theme.report.warnings
  const delta = theme.report.seedDelta.accent ?? 0
  const inspected = inspect ? m.scales[inspect.palette]?.[inspect.step] : null

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-muted p-3">
      <div className="flex items-center justify-between gap-3">
        {warnings.length === 0 ? (
          <span className="flex min-w-0 items-center gap-1.5 text-xs text-fg-muted">
            <CheckIcon className="size-3 shrink-0" />
            <span className="truncate">Contrast guarantees pass</span>
          </span>
        ) : (
          <button
            type="button"
            aria-expanded={showWarnings}
            onClick={() => setShowWarnings((open) => !open)}
            className="flex min-w-0 cursor-interactive items-center gap-1.5 text-xs text-fg-muted focus-reset hover:text-fg focus-visible:focus-ring"
          >
            <TriangleAlertIcon className="size-3 shrink-0 text-fg-warning" />
            <span className="truncate">
              {warnings.length} contrast warning
              {warnings.length === 1 ? '' : 's'}
            </span>
          </button>
        )}
        <ModeSwitch mode={mode} onChange={onModeChange} />
      </div>

      {showWarnings && warnings.length > 0 && (
        <ul className="flex flex-col gap-1">
          {warnings.map((warning) => (
            <li
              key={warning}
              className="text-xs/relaxed text-pretty text-fg-muted"
            >
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
                  'flex-1 cursor-interactive focus-reset transition-colors focus-visible:z-10 focus-visible:focus-ring',
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

/* ------------------------------- Suggestions ------------------------------- */

/** One-tap brand seeds: a row of curated colors so exploring never requires
 *  opening the picker. The current brand shows a ring. */
function SuggestionsRow({
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
      <span className={ROW_LABEL}>Suggestions</span>
      <span className="flex shrink-0 items-center gap-2">
        {ACCENT_POOL.map((hex) => {
          const selected = hex.toLowerCase() === value.toLowerCase()
          return (
            <RacButton
              key={hex}
              aria-label={`Use ${hex} as the brand color`}
              onPress={() => onChange(hex)}
              className={cn(
                'size-5 cursor-interactive rounded-full focus-reset transition-transform duration-150 ease-out focus-visible:focus-ring motion-safe:pressed:scale-90',
                selected
                  ? 'ring-2 ring-fg/80 ring-offset-2 ring-offset-muted'
                  : 'hover:scale-110',
              )}
              style={{ backgroundColor: hex }}
            />
          )
        })}
      </span>
    </div>
  )
}

/* ----------------------------------- Gray ---------------------------------- */

type GrayMode = 'auto' | 'pure' | 'custom'

const GRAY_MODE_OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: 'pure', label: 'Pure' },
  { value: 'custom', label: 'Custom' },
]

const GRAY_MODE_LABELS: Record<GrayMode, string> = {
  auto: 'Auto',
  pure: 'Pure',
  custom: 'Custom',
}

/* --------------------------------- Section --------------------------------- */

const FINE_KEYS = [
  'vividness',
  'hueShift',
  'preserveSeed',
  'guarantees',
  'borderContrast',
] as const

export function ColorSectionV2Body({ lab }: { lab: Lab }) {
  const { state, set } = lab
  const [mode, setMode] = useState<Mode>('light')

  const config = useLabConfig(state)
  const theme = resolveColorConfigCached(config)
  const borderSeeds = useBorderSeeds(config)
  const m = theme[mode]

  const solid = (palette: string) => m.scales[palette]?.['700'] ?? m.background
  const neutralMid = m.scales.neutral?.['500'] ?? m.background
  const selectionDerived =
    m.scales.selection?.['700'] ??
    (state.primary === 'accent' ? solid('accent') : solid('neutral'))

  const grayMode: GrayMode = state.graySeed
    ? 'custom'
    : state.grayTintAmount === 0
      ? 'pure'
      : 'auto'
  const setGrayMode = (next: GrayMode) => {
    if (next === 'custom') {
      set('graySeed')(cssToHex(neutralMid))
      return
    }
    set('graySeed')('')
    set('grayTintAmount')(next === 'pure' ? 0 : 1)
  }

  const semanticModified =
    SEMANTIC_SEEDS.some(({ key }) => state[key] !== '') ||
    state.selectionSeed !== ''
  const fineModified = FINE_KEYS.some((key) => state[key] !== DEFAULTS[key])

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
        <SuggestionsRow value={state.brand} onChange={set('brand')} />
        <SegmentedControlRow
          label="Primary"
          value={state.primary}
          onChange={set('primary')}
          options={[
            {
              value: 'neutral',
              label: (
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-fg" />
                  Neutral
                </span>
              ),
            },
            {
              value: 'accent',
              label: (
                <span className="flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full transition-colors"
                    style={{ backgroundColor: solid('accent') }}
                  />
                  Accent
                </span>
              ),
            },
          ]}
        />
      </ControlGroup>
      <GroupCaption>
        One required seed. Everything below derives from it — override any Auto
        value, reset back anytime.
      </GroupCaption>
      <DetailRow
        label="Gray"
        summary={
          <span className="flex items-center gap-1.5">
            <span>{GRAY_MODE_LABELS[grayMode]}</span>
            <SwatchDots colors={[neutralMid]} />
          </span>
        }
      >
        <ParamRow label="Source">
          <MiniSegmented
            ariaLabel="Gray source"
            value={grayMode}
            onChange={(value) => setGrayMode(value as GrayMode)}
            options={GRAY_MODE_OPTIONS}
          />
        </ParamRow>
        {grayMode === 'custom' ? (
          <MiniAutoColorRow
            label="Seed"
            value={state.graySeed}
            derived={neutralMid}
            onChange={set('graySeed')}
            onReset={() => set('graySeed')('')}
          />
        ) : (
          <MiniSliderRow
            label="Brand tint"
            value={state.grayTintAmount}
            onChange={set('grayTintAmount')}
            minValue={0}
            maxValue={4}
            step={0.1}
            format={(v) => (v === 0 ? 'Pure' : `${v.toFixed(1)}×`)}
          />
        )}
      </DetailRow>
      <DetailRow
        label="Semantic colors"
        summary={
          <span className="flex items-center gap-1.5">
            {semanticModified ? null : <span>Auto</span>}
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

/* --------------------------------- Surfaces -------------------------------- */

/** One mode's derived surface ladder, on its real background: the engine's
 *  bg → card → muted → highlight stack, exactly as tokens resolve them. */
function SurfaceStack({
  label,
  mode,
  theme,
}: {
  label: string
  mode: Mode
  theme: Theme
}) {
  const m = theme[mode]
  const neutral = m.scales.neutral
  const fg = neutral?.['900'] ?? m.background
  const border = neutral?.['400'] ?? m.background
  const layers = [
    { name: 'Card', color: neutral?.['50'] },
    { name: 'Muted', color: neutral?.['100'] },
    { name: 'Highlight', color: neutral?.['200'] },
  ]
  return (
    <div
      className="flex flex-col gap-1 rounded-xl border border-border/45 p-1.5 transition-colors"
      style={{ backgroundColor: m.background }}
    >
      <span
        className="px-1.5 pt-0.5 text-[10px] font-medium tracking-wider uppercase transition-colors"
        style={{ color: fg }}
      >
        {label}
      </span>
      {layers.map((layer) => (
        <span
          key={layer.name}
          className="flex h-7 items-center rounded-md border px-2 text-[11px] transition-colors"
          style={{
            backgroundColor: layer.color,
            borderColor: border,
            color: fg,
          }}
        >
          {layer.name}
        </span>
      ))}
    </div>
  )
}

/** The Surfaces section: the two mode canvases with their derived ladders, and
 *  the engine's two background axes — nothing else to drift out of sync. */
export function SurfacesSectionBody({ lab }: { lab: Lab }) {
  const { state, set } = lab
  const config = useLabConfig(state)
  const theme = resolveColorConfigCached(config)

  return (
    <>
      <div className="grid grid-cols-2 gap-1.5">
        <SurfaceStack label="Light" mode="light" theme={theme} />
        <SurfaceStack
          label={state.bgDark === 0 ? 'Dark · OLED' : 'Dark'}
          mode="dark"
          theme={theme}
        />
      </div>
      <ControlGroup>
        <SliderRow
          label="Light"
          value={state.bgLight}
          onChange={set('bgLight')}
          minValue={90}
          maxValue={100}
          step={0.5}
          format={(v) => `L* ${v.toFixed(1)}`}
        />
        <SliderRow
          label="Dark"
          value={state.bgDark}
          onChange={set('bgDark')}
          minValue={0}
          maxValue={20}
          step={0.5}
          format={(v) => (v === 0 ? 'OLED' : `L* ${v.toFixed(1)}`)}
        />
      </ControlGroup>
      <GroupCaption>
        Each slider sets a mode&apos;s canvas. Every surface — card, muted,
        highlight — is derived from it by the engine.
      </GroupCaption>
    </>
  )
}
