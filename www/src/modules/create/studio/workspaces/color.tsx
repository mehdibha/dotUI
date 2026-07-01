'use client'

import { useMemo, useState } from 'react'
import { ChevronDownIcon, PaletteIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import {
  DEFAULT_COLOR_CONFIG,
  PALETTE_ORDER,
  resolveColorConfig,
} from '@/registry/theme'
import type { AlgorithmId, PaletteName, PaletteSeeds } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import {
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
} from '@/registry/ui/disclosure'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { Select, SelectValue } from '@/registry/ui/select'
import { Switch } from '@/registry/ui/switch'

import { ChartColorsConfig } from '../../chart-colors'
import { ContrastReadout } from '../../colors/contrast'
import { ColorKnobsControls } from '../../colors/knobs'
import { useDesignSystem } from '../../preset'
import { SeedButton } from '../color-controls'
import { PALETTES_FOUNDATION_VAR } from '../tokens'
import { Field, GroupLabel, Panel, Segmented, WorkspaceHeader } from '../ui'

/* --------------------------- Harmony helpers ----------------------------- */

function hexToHsl(hex: string): [number, number, number] | null {
  const m = /^#?([\da-f]{6})$/i.exec(hex.trim())
  if (!m?.[1]) return null
  const n = Number.parseInt(m[1], 16)
  const r = (n >> 16) / 255
  const g = ((n >> 8) & 255) / 255
  const b = (n & 255) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  let h = 0
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return [h, s, l]
}

function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  const rgb = (
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x]
  ).map((v) => Math.round((v + m) * 255))
  const r = rgb[0] ?? 0
  const g = rgb[1] ?? 0
  const b = rgb[2] ?? 0
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

const HARMONIES: { label: string; rotate: number }[] = [
  { label: 'Complement', rotate: 180 },
  { label: 'Analogous −', rotate: -30 },
  { label: 'Analogous +', rotate: 30 },
  { label: 'Triadic −', rotate: -120 },
  { label: 'Triadic +', rotate: 120 },
]

/** Accent variations derived by rotating the brand hue — click to adopt one. */
function Harmonies() {
  const { designSystem, setColorSeed } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const hsl = hexToHsl(config.seeds.accent ?? '#438cd6')
  if (!hsl) return null
  const [h, s, l] = hsl
  return (
    <div className="flex flex-col gap-2">
      <GroupLabel>Harmonies</GroupLabel>
      <div className="flex gap-1.5">
        {HARMONIES.map((harm) => {
          const hex = hslToHex((h + harm.rotate + 360) % 360, s, l)
          return (
            <ButtonPrimitives.Button
              key={harm.label}
              onPress={() => setColorSeed('accent', hex)}
              aria-label={`${harm.label} ${hex}`}
              className="group flex flex-1 flex-col items-center gap-1 focus-reset focus-visible:focus-ring"
            >
              <span
                className="h-7 w-full rounded-md ring-1 ring-black/10 transition-transform ring-inset group-hover:scale-105"
                style={{ backgroundColor: hex }}
              />
              <span className="text-[9px] text-fg-muted">{harm.label}</span>
            </ButtonPrimitives.Button>
          )
        })}
      </div>
    </div>
  )
}

const ALGORITHMS: ReadonlyArray<{ id: AlgorithmId; label: string }> = [
  { id: 'oklch', label: 'OKLCH — perceptual' },
  { id: 'tailwind', label: 'Tailwind-style' },
  { id: 'material', label: 'Material' },
  { id: 'contrast', label: 'Contrast-locked' },
]

const STATUS_SEEDS: ReadonlyArray<{ key: keyof PaletteSeeds; label: string }> =
  [
    { key: 'success', label: 'Success' },
    { key: 'warning', label: 'Warning' },
    { key: 'danger', label: 'Danger' },
    { key: 'info', label: 'Info' },
  ]

export function ColorWorkspace() {
  const {
    designSystem,
    setColorAlgorithm,
    setColorSeed,
    setColorKnob,
    setToken,
  } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const resolved = useMemo(() => resolveColorConfig(config), [config])
  const [mode, setMode] = useState<'simple' | 'advanced'>('simple')

  const tinted = (config.seeds.neutral ?? '#808080').toLowerCase() !== '#808080'
  const exposePalettes = designSystem.tokens[PALETTES_FOUNDATION_VAR] === 'true'

  return (
    <div className="flex flex-col gap-5">
      <WorkspaceHeader
        icon={PaletteIcon}
        title="Color"
        description="Generate a full, accessible palette from one seed — or take control of every hue."
      />

      <Segmented
        ariaLabel="Color mode"
        value={mode}
        onChange={setMode}
        options={[
          { value: 'simple', label: 'Simple' },
          { value: 'advanced', label: 'Advanced' },
        ]}
      />

      {/* Seeds */}
      <Panel>
        <Field label="Brand / accent" anchor="brand-color">
          <SeedButton seed="accent" />
        </Field>
        <Field label="Base / gray" anchor="base-color">
          <SeedButton seed="neutral" />
        </Field>
        <Field
          label="Gray strategy"
          hint="Pure neutrals, or grays tinted toward the brand."
        >
          <Segmented
            ariaLabel="Gray strategy"
            value={tinted ? 'tinted' : 'pure'}
            onChange={(v) =>
              setColorSeed(
                'neutral',
                v === 'pure'
                  ? '#808080'
                  : (config.seeds.accent ?? DEFAULT_COLOR_CONFIG.seeds.accent),
              )
            }
            options={[
              { value: 'pure', label: 'Pure' },
              { value: 'tinted', label: 'Brand-tinted' },
            ]}
          />
        </Field>
      </Panel>

      <Harmonies />

      {mode === 'advanced' && (
        <>
          <Field
            label="Generation algorithm"
            anchor="color-algorithm"
            hint="How seeds expand into tonal ramps."
          >
            <Select
              className="w-full"
              selectedKey={config.algorithm}
              onSelectionChange={(k) => setColorAlgorithm(k as AlgorithmId)}
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

          <div className="flex flex-col gap-2.5">
            <GroupLabel>Status families</GroupLabel>
            <div
              className="grid grid-cols-2 gap-2.5"
              data-anchor="status-colors"
            >
              {STATUS_SEEDS.map((s) => (
                <Field key={s.key} label={s.label}>
                  <SeedButton seed={s.key} />
                </Field>
              ))}
            </div>
          </div>

          <label className="flex items-start justify-between gap-3 rounded-lg border p-3">
            <span className="flex flex-col gap-0.5">
              <span className="text-xs font-medium">
                Palettes as foundations
              </span>
              <span className="text-xs leading-snug text-fg-muted/80">
                Expose every generated ramp as named palette tokens, not just
                semantic colors.
              </span>
            </span>
            <Switch
              isSelected={exposePalettes}
              onChange={(s) => setToken(PALETTES_FOUNDATION_VAR, String(s))}
              aria-label="Palettes as foundations"
            />
          </label>

          <Disclosure className="rounded-lg border">
            <DisclosureTrigger className="px-3 py-2.5 text-xs font-medium">
              Fine-tune ramps
            </DisclosureTrigger>
            <DisclosurePanel>
              <div className="px-3 pb-3" data-anchor="color-engine">
                <ColorKnobsControls
                  algorithm={config.algorithm}
                  knobs={config.knobs ?? {}}
                  steps={resolved.steps}
                  onChange={setColorKnob}
                />
              </div>
            </DisclosurePanel>
          </Disclosure>
        </>
      )}

      {/* Generated ramps + contrast */}
      <div className="flex flex-col gap-2.5">
        <GroupLabel>Generated ramps</GroupLabel>
        <div className="flex flex-col gap-1">
          {(mode === 'simple'
            ? (['neutral', 'accent'] as PaletteName[])
            : PALETTE_ORDER
          ).map((palette) => {
            const ramp = resolved.light[palette]
            if (!ramp) return null
            return (
              <div
                key={palette}
                className="flex overflow-hidden rounded"
                title={palette}
              >
                {Object.entries(ramp).map(([step, val]) => (
                  <div
                    key={step}
                    className="h-4 flex-1"
                    style={{ backgroundColor: val }}
                    title={`--${palette}-${step}: ${val}`}
                  />
                ))}
              </div>
            )
          })}
        </div>
        <ContrastReadout resolved={resolved} />
      </div>

      <Disclosure className="rounded-lg border">
        <DisclosureTrigger className="px-3 py-2.5 text-xs font-medium">
          Chart colors
        </DisclosureTrigger>
        <DisclosurePanel>
          <div className="px-3 pt-6 pb-3">
            <ChartColorsConfig />
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
  )
}
