'use client'

import { useMemo, useState } from 'react'

import {
  DEFAULT_COLOR_CONFIG,
  PALETTE_ORDER,
  resolveColorConfig,
} from '@/registry/theme'
import type { AlgorithmId, PaletteSeeds } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { ColorArea } from '@/registry/ui/color-area'
import { ColorField } from '@/registry/ui/color-field'
import { ColorPicker } from '@/registry/ui/color-picker'
import { ColorSlider } from '@/registry/ui/color-slider'
import { ColorSwatch } from '@/registry/ui/color-swatch'
import { DialogContent } from '@/registry/ui/dialog'
import {
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
} from '@/registry/ui/disclosure'
import { Input } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'
import { Switch } from '@/registry/ui/switch'

import { ChartColorsConfig } from '../../chart-colors'
import { ContrastReadout } from '../../colors/contrast'
import { ColorKnobsControls } from '../../colors/knobs'
import { useDesignSystem } from '../../preset'
import { useStudio } from '../context'
import { STUB } from '../data'
import {
  Field,
  Segmented,
  SelectField,
  SectionShell,
  Subgroup,
  Swatch,
  useToken,
} from '../primitives'
import { SemanticTokens } from './semantic'

type ColorModel = 'single' | 'duo' | 'full' | 'manual'

const ALGORITHMS = [
  { id: 'oklch' as const, label: 'OKLCH — perceptual' },
  { id: 'tailwind' as const, label: 'Tailwind-style' },
  { id: 'material' as const, label: 'Material 3' },
  { id: 'contrast' as const, label: 'Contrast-locked' },
]

const STATUS_SEEDS: Array<{ seed: keyof PaletteSeeds; label: string }> = [
  { seed: 'success', label: 'Success' },
  { seed: 'warning', label: 'Warning' },
  { seed: 'danger', label: 'Danger' },
  { seed: 'info', label: 'Info' },
]

/** A labelled color seed: swatch button + picker popover bound to one seed. */
function SeedField({
  seed,
  label,
  hint,
}: {
  seed: keyof PaletteSeeds
  label: string
  hint?: string
}) {
  const { designSystem, setColorSeed } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const value =
    config.seeds[seed] ?? DEFAULT_COLOR_CONFIG.seeds[seed] ?? '#808080'
  return (
    <Field label={label} hint={hint}>
      <ColorPicker
        value={value}
        onChange={(c) => setColorSeed(seed, c.toString('hex'))}
      >
        {({ color }) => (
          <>
            <Button size="sm" className="w-full justify-start pl-2">
              <ColorSwatch />
              <span className="truncate font-mono text-xs">
                {color.toString('hex')}
              </span>
            </Button>
            <Popover>
              <DialogContent className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <ColorArea
                    colorSpace="hsb"
                    xChannel="saturation"
                    yChannel="brightness"
                  />
                  <ColorSlider
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
    </Field>
  )
}

/** One generated ramp, expandable to reveal per-step swatches + tokens. */
function FoundationRamp({
  name,
  ramp,
}: {
  name: string
  ramp: Record<string, string>
}) {
  return (
    <Disclosure>
      <DisclosureTrigger className="flex w-full items-center gap-2 rounded-md py-1 text-left">
        <span className="w-16 shrink-0 truncate font-mono text-[11px] text-fg-muted capitalize">
          {name}
        </span>
        <span className="flex flex-1 overflow-hidden rounded ring-1 ring-black/5 ring-inset">
          {Object.values(ramp).map((c, i) => (
            <span
              key={i}
              className="h-4 flex-1"
              style={{ backgroundColor: c }}
            />
          ))}
        </span>
      </DisclosureTrigger>
      <DisclosurePanel>
        <div className="grid grid-cols-6 gap-1.5 py-2">
          {Object.entries(ramp).map(([step, c]) => (
            <div key={step} className="flex flex-col items-center gap-1">
              <Swatch color={c} className="size-7" />
              <span className="font-mono text-[9px] text-fg-muted">{step}</span>
            </div>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}

export function ColorSection() {
  const { mode } = useStudio()
  const { designSystem, setColorAlgorithm, setColorKnob } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const resolved = useMemo(() => resolveColorConfig(config), [config])

  const [model, setModel] = useState<ColorModel>('single')
  const [foundations, setFoundations] = useToken(
    STUB.paletteFoundations,
    'false',
  )
  const showFoundations = foundations === 'true'

  return (
    <SectionShell
      title="Color system"
      blurb="Decide how your palette is built — one seed expands to the whole system, or take control of every family and ramp."
    >
      {/* How the system is structured */}
      <Field
        label="Color model"
        hint={
          model === 'single'
            ? 'One brand color generates every ramp, neutral and status hue.'
            : model === 'duo'
              ? 'Pick your brand and a base/gray; everything else is derived.'
              : model === 'full'
                ? 'Seed every family yourself for full editorial control.'
                : 'Bring your own ramps — paste tokens to override generation.'
        }
      >
        <Segmented<ColorModel>
          ariaLabel="Color model"
          value={model}
          onChange={setModel}
          options={[
            { value: 'single', label: '1 seed', hint: 'Single seed' },
            { value: 'duo', label: '2 seeds', hint: 'Brand + base' },
            { value: 'full', label: 'Full', hint: 'Full palette' },
            { value: 'manual', label: 'Manual', hint: 'Bring your own ramps' },
          ]}
        />
      </Field>

      {model === 'manual' ? (
        <Field
          label="Paste your ramps"
          live={false}
          hint="CSS custom properties or a tokens JSON. Overrides the generator."
        >
          <textarea
            aria-label="Manual ramps"
            rows={5}
            spellCheck={false}
            placeholder={
              '--accent-500: oklch(0.62 0.19 256);\n--neutral-500: …'
            }
            className="w-full resize-none rounded-md border bg-field p-2.5 font-mono text-xs text-fg outline-none placeholder:text-fg-muted/60 focus-visible:focus-ring"
          />
        </Field>
      ) : (
        <Subgroup title="Seeds">
          <div className="grid grid-cols-2 gap-3">
            <SeedField
              seed="accent"
              label="Brand"
              hint="Drives primary + accent"
            />
            {model !== 'single' && (
              <SeedField seed="neutral" label="Base / gray" />
            )}
          </div>
          {model === 'full' && (
            <div className="mt-1 grid grid-cols-2 gap-3">
              {STATUS_SEEDS.map((s) => (
                <SeedField key={s.seed} seed={s.seed} label={s.label} />
              ))}
            </div>
          )}
        </Subgroup>
      )}

      {/* Generation algorithm */}
      {model !== 'manual' && (
        <Field
          label="Generation algorithm"
          hint="How a seed expands into a tonal ramp."
        >
          <SelectField<AlgorithmId>
            ariaLabel="Algorithm"
            value={config.algorithm}
            onChange={setColorAlgorithm}
            options={ALGORITHMS.map((a) => ({ id: a.id, label: a.label }))}
          />
        </Field>
      )}

      {/* Palettes as foundations */}
      <div className="flex items-start justify-between gap-4 rounded-lg border bg-neutral/30 p-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-medium text-fg">
            Expose palettes as foundations
          </span>
          <p className="text-xs leading-snug text-fg-muted">
            Surface the generated ramps as named, editable foundation tokens.
            Off keeps only the semantic layer.
          </p>
        </div>
        <Switch
          isSelected={showFoundations}
          onChange={(s) => setFoundations(String(s))}
          aria-label="Expose palettes as foundations"
        />
      </div>

      {/* Generated ramps */}
      {(showFoundations || mode === 'simple') && (
        <Subgroup title={showFoundations ? 'Foundations' : 'Generated ramps'}>
          {showFoundations ? (
            <div className="flex flex-col gap-1">
              {PALETTE_ORDER.map((p) => {
                const ramp = resolved.light[p]
                return ramp ? (
                  <FoundationRamp key={p} name={p} ramp={ramp} />
                ) : null
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {PALETTE_ORDER.map((p) => {
                const ramp = resolved.light[p]
                if (!ramp) return null
                return (
                  <div
                    key={p}
                    className="flex overflow-hidden rounded-md ring-1 ring-black/5 ring-inset"
                    title={p}
                  >
                    {Object.values(ramp).map((c, i) => (
                      <span
                        key={i}
                        className="h-5 flex-1"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                )
              })}
            </div>
          )}
        </Subgroup>
      )}

      {/* Pro: fine-tuning, semantic layer, accessibility */}
      {mode === 'pro' && model !== 'manual' && (
        <>
          <Subgroup title="Ramp tuning">
            <ColorKnobsControls
              algorithm={config.algorithm}
              knobs={config.knobs ?? {}}
              steps={resolved.steps}
              onChange={setColorKnob}
            />
          </Subgroup>

          <Subgroup title="Semantic tokens">
            <SemanticTokens />
          </Subgroup>

          <Subgroup title="Chart colors">
            <ChartColorsConfig />
          </Subgroup>

          <Subgroup title="Accessibility">
            <ContrastReadout resolved={resolved} />
          </Subgroup>
        </>
      )}
    </SectionShell>
  )
}
