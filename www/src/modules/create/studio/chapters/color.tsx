'use client'

import { useMemo } from 'react'

import {
  DEFAULT_COLOR_CONFIG,
  PALETTE_ORDER,
  resolveColorConfig,
} from '@/registry/theme'
import type { AlgorithmId } from '@/registry/theme'

import { ContrastReadout } from '../../colors/contrast'
import { ColorKnobsControls } from '../../colors/knobs'
import { useDesignSystem } from '../../preset'
import {
  ChapterIntro,
  Field,
  Hint,
  Section,
  Seed,
  Segmented,
  SelectField,
  SliderField,
} from '../controls'
import { CONTRAST_TARGET_VAR, DARK_STRATEGY_VAR } from '../data'
import { useToken } from '../hooks'
import { useStudio } from '../store'

const ALGORITHMS: ReadonlyArray<{ value: AlgorithmId; label: string }> = [
  { value: 'oklch', label: 'Perceptual — even, consistent steps' },
  { value: 'tailwind', label: 'Tailwind-style — familiar web ramps' },
  { value: 'material', label: 'Material — tonal palettes' },
  { value: 'contrast', label: 'Contrast-locked — guaranteed AA/AAA' },
]

const NEUTRAL_TEMPS = [
  { value: 'pure', label: 'Pure', seed: '#808080' },
  { value: 'warm', label: 'Warm', seed: '#878079' },
  { value: 'cool', label: 'Cool', seed: '#797f87' },
]

export function ColorChapter() {
  const { designSystem, setColorSeed, setColorAlgorithm, setColorKnob } =
    useDesignSystem()
  const { colorMode, setColorMode, showPalettes } = useStudio()

  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const resolved = useMemo(() => resolveColorConfig(config), [config])

  const neutral = (config.seeds.neutral ?? '#808080').toLowerCase()
  const activeTemp =
    NEUTRAL_TEMPS.find((t) => t.seed.toLowerCase() === neutral)?.value ??
    (neutral === (config.seeds.accent ?? '').toLowerCase() ? 'brand' : 'custom')

  const vibrancy = config.knobs?.chromaMult ?? 1
  const [contrastTarget, setContrastTarget] = useToken(
    CONTRAST_TARGET_VAR,
    'aa',
  )
  const [darkStrategy, setDarkStrategy] = useToken(DARK_STRATEGY_VAR, 'mirror')

  const advanced = colorMode === 'advanced'

  return (
    <div className="flex flex-col gap-7">
      <ChapterIntro
        title="Color"
        blurb="The one real color on screen drives everything else. Switch how it's authored at any time."
        action={
          <Segmented
            ariaLabel="Color mode"
            value={colorMode}
            onChange={setColorMode}
            options={[
              { value: 'simple', label: 'Guided' },
              { value: 'advanced', label: 'Advanced' },
            ]}
          />
        }
      />

      <Section label="Seeds">
        <Seed
          label="Brand / accent"
          value={config.seeds.accent}
          live
          onChange={(hex) => setColorSeed('accent', hex)}
        />
        <Field label="Base / gray" live>
          <Seed
            value={config.seeds.neutral ?? '#808080'}
            onChange={(hex) => setColorSeed('neutral', hex)}
          />
          <div className="mt-2">
            <Segmented
              ariaLabel="Neutral temperature"
              value={activeTemp}
              onChange={(v) => {
                const temp = NEUTRAL_TEMPS.find((t) => t.value === v)
                if (temp) setColorSeed('neutral', temp.seed)
                else if (v === 'brand')
                  setColorSeed('neutral', config.seeds.accent)
              }}
              options={[
                ...NEUTRAL_TEMPS.map((t) => ({
                  value: t.value,
                  label: t.label,
                })),
                { value: 'brand', label: 'Tinted' },
              ]}
            />
          </div>
          <Hint>
            Pure neutrals, a warm/cool cast, or grays pulled toward the brand.
          </Hint>
        </Field>
      </Section>

      <Section label="Generation">
        <SelectField
          label="Algorithm"
          live
          value={config.algorithm}
          onChange={(v) => setColorAlgorithm(v)}
          options={ALGORITHMS}
          hint="How a seed expands into a full tonal ramp."
        />
        <SliderField
          label="Vibrancy"
          live
          value={vibrancy}
          min={0}
          max={2}
          step={0.05}
          format={(v) => `${Math.round(v * 100)}%`}
          onChange={(v) => setColorKnob('chromaMult', v)}
          hint="Multiplies saturation across every step."
        />
        <SelectField
          label="Contrast target"
          value={contrastTarget}
          onChange={setContrastTarget}
          options={[
            { value: 'aa', label: 'WCAG AA — 4.5:1' },
            { value: 'aaa', label: 'WCAG AAA — 7:1' },
            { value: 'apca', label: 'APCA — perceptual' },
          ]}
        />
      </Section>

      {advanced && (
        <Section label="Status families">
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                ['success', 'Success'],
                ['warning', 'Warning'],
                ['danger', 'Danger'],
                ['info', 'Info'],
              ] as const
            ).map(([seed, label]) => (
              <Seed
                key={seed}
                label={label}
                live
                value={
                  config.seeds[seed] ??
                  DEFAULT_COLOR_CONFIG.seeds[seed] ??
                  '#808080'
                }
                onChange={(hex) => setColorSeed(seed, hex)}
              />
            ))}
          </div>
        </Section>
      )}

      {advanced && (
        <Section label="Engine">
          <ColorKnobsControls
            algorithm={config.algorithm}
            knobs={config.knobs ?? {}}
            steps={resolved.steps}
            onChange={setColorKnob}
          />
          <ContrastReadout resolved={resolved} />
          <SelectField
            label="Dark mode"
            value={darkStrategy}
            onChange={setDarkStrategy}
            options={[
              { value: 'mirror', label: 'Mirror the lightness ladder' },
              { value: 'custom', label: 'Custom dark ramps' },
            ]}
          />
        </Section>
      )}

      {showPalettes && (
        <Section
          label="Foundations"
          hint={<span className="text-[11px] text-fg-muted">scales</span>}
        >
          <Hint>
            The raw generated palettes, the way a design-system team edits them.
          </Hint>
          <div className="flex flex-col gap-1.5">
            {PALETTE_ORDER.map((palette) => {
              const ramp = resolved.light[palette]
              if (!ramp) return null
              return (
                <div key={palette} className="flex items-center gap-2">
                  <span className="w-14 shrink-0 truncate text-[10px] text-fg-muted capitalize">
                    {palette}
                  </span>
                  <div className="flex h-4 flex-1 overflow-hidden rounded ring-1 ring-border">
                    {Object.entries(ramp).map(([step, value]) => (
                      <div
                        key={step}
                        className="flex-1"
                        style={{ backgroundColor: value }}
                        title={`--${palette}-${step}: ${value}`}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Section>
      )}
    </div>
  )
}
