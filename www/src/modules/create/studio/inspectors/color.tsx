'use client'

import { useMemo, useState } from 'react'
import {
  ChevronDownIcon,
  GlobeIcon,
  ImageIcon,
  PaintBucketIcon,
  PipetteIcon,
} from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import {
  DEFAULT_COLOR_CONFIG,
  PALETTE_ORDER,
  resolveColorConfig,
} from '@/registry/theme'
import type { AlgorithmId, PaletteSeeds } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { Select, SelectValue } from '@/registry/ui/select'
import { Switch } from '@/registry/ui/switch'

import { ContrastReadout } from '../../colors/contrast'
import { ColorKnobsControls } from '../../colors/knobs'
import { useDesignSystem } from '../../preset'
import {
  Field,
  InlineRow,
  OptionGrid,
  Section,
  Segmented,
  SwatchButton,
} from '../primitives'

const ALGORITHMS: ReadonlyArray<{ id: AlgorithmId; label: string }> = [
  { id: 'oklch', label: 'OKLCH — perceptual' },
  { id: 'tailwind', label: 'Tailwind-style' },
  { id: 'material', label: 'Material' },
  { id: 'contrast', label: 'Contrast-locked' },
]

const STATUS_SEEDS: ReadonlyArray<{ seed: keyof PaletteSeeds; label: string }> =
  [
    { seed: 'success', label: 'Success' },
    { seed: 'warning', label: 'Warning' },
    { seed: 'danger', label: 'Danger' },
    { seed: 'info', label: 'Info' },
  ]

type SeedStrategy = 'one' | 'seeds' | 'import'
type Foundation = 'palettes' | 'semantic'
type RampMode = 'light' | 'dark'

function rampAt(
  ramp: Record<string, string> | undefined,
  step: string,
): string | undefined {
  return ramp?.[step]
}

export function ColorInspector() {
  const { designSystem, setColorSeed, setColorAlgorithm, setColorKnob } =
    useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const seeds = config.seeds
  const resolved = useMemo(() => resolveColorConfig(config), [config])

  const [strategy, setStrategy] = useState<SeedStrategy>('one')
  const [foundation, setFoundation] = useState<Foundation>('palettes')
  const [rampMode, setRampMode] = useState<RampMode>('light')
  const [contextAware, setContextAware] = useState(false)
  const [tintNeutrals, setTintNeutrals] = useState(
    (seeds.neutral ?? '#808080').toLowerCase() !== '#808080',
  )

  const ramps = rampMode === 'light' ? resolved.light : resolved.dark

  function setTint(on: boolean) {
    setTintNeutrals(on)
    setColorSeed(
      'neutral',
      on ? (seeds.accent ?? DEFAULT_COLOR_CONFIG.seeds.accent) : '#808080',
    )
  }

  return (
    <div className="flex flex-col gap-7">
      {/* How seeds are provided — the "1 color → full system" promise. */}
      <Section
        title="Seed strategy"
        aside={
          <span className="text-[11px] text-fg-muted">
            how the system starts
          </span>
        }
      >
        <Segmented<SeedStrategy>
          ariaLabel="Seed strategy"
          value={strategy}
          onChange={setStrategy}
          options={[
            { value: 'one', label: 'One color' },
            { value: 'seeds', label: 'Custom seeds' },
            { value: 'import', label: 'Import' },
          ]}
        />

        {strategy === 'one' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-stretch gap-3 rounded-lg border bg-card p-3">
              <div
                className="size-14 shrink-0 rounded-md border"
                style={{ backgroundColor: seeds.accent }}
              />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <span className="text-[13px] font-medium">Brand color</span>
                <SwatchButton
                  ariaLabel="Brand color"
                  value={seeds.accent ?? DEFAULT_COLOR_CONFIG.seeds.accent}
                  onChange={(hex) => setColorSeed('accent', hex)}
                />
              </div>
            </div>
            <p className="text-xs leading-snug text-fg-muted">
              Neutrals and every status family are derived automatically from
              this single seed. Switch to{' '}
              <span className="font-medium text-fg">Custom seeds</span> to drive
              each one by hand.
            </p>
            <InlineRow
              label="Tint neutrals with brand"
              hint="Warm the grays toward the accent"
              live
            >
              <Switch
                isSelected={tintNeutrals}
                onChange={setTint}
                aria-label="Tint neutrals with brand"
              />
            </InlineRow>
          </div>
        )}

        {strategy === 'seeds' && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Accent" live>
                <SwatchButton
                  ariaLabel="Accent"
                  value={seeds.accent ?? DEFAULT_COLOR_CONFIG.seeds.accent}
                  onChange={(hex) => setColorSeed('accent', hex)}
                />
              </Field>
              <Field label="Neutral" live>
                <SwatchButton
                  ariaLabel="Neutral"
                  value={seeds.neutral ?? DEFAULT_COLOR_CONFIG.seeds.neutral}
                  onChange={(hex) => setColorSeed('neutral', hex)}
                />
              </Field>
            </div>
            <Section title="Status families">
              <div className="grid grid-cols-2 gap-3">
                {STATUS_SEEDS.map(({ seed, label }) => (
                  <Field key={seed} label={label} live>
                    <SwatchButton
                      ariaLabel={label}
                      value={
                        seeds[seed] ??
                        DEFAULT_COLOR_CONFIG.seeds[seed] ??
                        '#808080'
                      }
                      onChange={(hex) => setColorSeed(seed, hex)}
                    />
                  </Field>
                ))}
              </div>
            </Section>
          </div>
        )}

        {strategy === 'import' && (
          <div className="grid gap-2">
            {[
              {
                icon: ImageIcon,
                label: 'Upload a logo',
                hint: 'Extract the palette from your mark',
              },
              {
                icon: GlobeIcon,
                label: 'Paste a website URL',
                hint: 'Pull brand colors from any site',
              },
              {
                icon: PipetteIcon,
                label: 'Paste hex / OKLCH values',
                hint: 'Bring an existing palette',
              },
            ].map((opt) => (
              <button
                key={opt.label}
                type="button"
                className="flex items-center gap-3 rounded-lg border border-dashed p-3 text-left transition-colors hover:border-fg-muted/40 hover:bg-neutral"
              >
                <opt.icon className="size-4 text-fg-muted" />
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium">{opt.label}</span>
                  <span className="text-[11px] text-fg-muted">{opt.hint}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </Section>

      {/* The generation engine — fully live. */}
      <Section title="Generation engine">
        <Field
          label="Algorithm"
          live
          hint="How a seed expands into a tonal ramp."
        >
          <Select
            className="w-full"
            selectedKey={config.algorithm}
            onSelectionChange={(key) => setColorAlgorithm(key as AlgorithmId)}
            aria-label="Color algorithm"
          >
            <Button size="sm" className="w-full justify-between">
              <SelectValue className="truncate" />
              <ChevronDownIcon data-icon-end="" />
            </Button>
            <Popover>
              <ListBox>
                {ALGORITHMS.map((a) => (
                  <ListBoxItem key={a.id} id={a.id}>
                    {a.label}
                  </ListBoxItem>
                ))}
              </ListBox>
            </Popover>
          </Select>
        </Field>
        <ColorKnobsControls
          algorithm={config.algorithm}
          knobs={config.knobs ?? {}}
          steps={resolved.steps}
          onChange={setColorKnob}
        />
      </Section>

      {/* Foundation: palettes vs semantic tokens — "palettes or not". */}
      <Section
        title="Foundation"
        aside={
          <Segmented<RampMode>
            ariaLabel="Ramp mode"
            value={rampMode}
            onChange={setRampMode}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
            ]}
          />
        }
      >
        <OptionGrid<Foundation>
          value={foundation}
          onChange={setFoundation}
          options={[
            {
              value: 'palettes',
              label: 'Palettes',
              description: 'Expose full 50–950 ramps',
              icon: PaintBucketIcon,
            },
            {
              value: 'semantic',
              label: 'Semantic only',
              description: 'Just roles: bg, fg, primary…',
              icon: PipetteIcon,
            },
          ]}
        />

        {foundation === 'palettes' ? (
          <div className="flex flex-col gap-2">
            {PALETTE_ORDER.map((palette) => {
              const ramp = ramps[palette]
              if (!ramp) return null
              return (
                <div key={palette} className="flex flex-col gap-1">
                  <span className="text-[10px] tracking-wide text-fg-muted capitalize">
                    {palette}
                  </span>
                  <div className="flex overflow-hidden rounded-md">
                    {Object.entries(ramp).map(([step, value]) => (
                      <div
                        key={step}
                        className="h-6 flex-1"
                        style={{ backgroundColor: value }}
                        title={`--${palette}-${step}: ${value}`}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <SemanticTokens ramps={ramps} />
        )}

        <InlineRow
          label="Context-aware tokens"
          hint="Re-map roles inside cards & overlays"
        >
          <Switch
            isSelected={contextAware}
            onChange={setContextAware}
            aria-label="Context-aware tokens"
          />
        </InlineRow>
      </Section>

      {/* Accessibility — live WCAG readout from the resolved ramps. */}
      <Section title="Accessibility">
        <ContrastReadout resolved={resolved} />
      </Section>
    </div>
  )
}

/** Semantic roles derived from the resolved ramps for an at-a-glance token map. */
function SemanticTokens({
  ramps,
}: {
  ramps: Record<string, Record<string, string>>
}) {
  const roles: Array<{ name: string; value: string | undefined }> = [
    { name: 'background', value: rampAt(ramps.neutral, '50') },
    { name: 'foreground', value: rampAt(ramps.neutral, '950') },
    { name: 'muted', value: rampAt(ramps.neutral, '100') },
    { name: 'border', value: rampAt(ramps.neutral, '200') },
    { name: 'primary', value: rampAt(ramps.accent, '600') },
    { name: 'success', value: rampAt(ramps.success, '600') },
    { name: 'warning', value: rampAt(ramps.warning, '500') },
    { name: 'danger', value: rampAt(ramps.danger, '600') },
  ]
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {roles.map((role) => (
        <div
          key={role.name}
          className="flex items-center gap-2 rounded-md border bg-card p-1.5"
        >
          <div
            className={cn('size-6 shrink-0 rounded border')}
            style={{ backgroundColor: role.value }}
          />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[11px] font-medium">
              {role.name}
            </span>
            <span className="truncate font-mono text-[10px] text-fg-muted">
              {role.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
