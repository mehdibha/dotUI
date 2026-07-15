'use client'

import { useMemo } from 'react'
import { ChevronDownIcon } from 'lucide-react'

import {
  DEFAULT_COLOR_CONFIG,
  PALETTE_ORDER,
  resolveColorConfig,
} from '@/registry/theme'
import type {
  AlgorithmId,
  PaletteSeeds,
  PrimaryColorSource,
} from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { ColorEditor } from '@/registry/ui/color-editor'
import { ColorPicker } from '@/registry/ui/color-picker'
import { ColorSwatch } from '@/registry/ui/color-swatch'
import { DialogContent } from '@/registry/ui/dialog'
import { Label } from '@/registry/ui/field'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { Select, SelectValue } from '@/registry/ui/select'

import { useDesignSystem } from '../preset'
import { ContrastReadout } from './contrast'
import { ColorKnobsControls } from './knobs'

const ALGORITHMS: ReadonlyArray<{ id: AlgorithmId; label: string }> = [
  { id: 'oklch', label: 'OKLCH Perceptual' },
  { id: 'tailwind', label: 'Tailwind-style' },
  { id: 'material', label: 'Material' },
  { id: 'contrast', label: 'Contrast-locked' },
]

const PRIMARY_SOURCES: ReadonlyArray<{
  id: PrimaryColorSource
  label: string
}> = [
  { id: 'neutral', label: 'Neutral (black & white)' },
  { id: 'accent', label: 'Accent (brand color)' },
]

const SEED_FIELDS: ReadonlyArray<{ label: string; key: keyof PaletteSeeds }> = [
  { label: 'Base', key: 'neutral' },
  { label: 'Accent', key: 'accent' },
  { label: 'Success', key: 'success' },
  { label: 'Warning', key: 'warning' },
  { label: 'Danger', key: 'danger' },
  { label: 'Info', key: 'info' },
]

/** Collapsed-card summary of the live color recipe (replaces the old hardcoded mock). */
export function ColorsSummary() {
  const { designSystem } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const algorithmLabel =
    ALGORITHMS.find((a) => a.id === config.algorithm)?.label ?? config.algorithm
  const rows = [
    { name: 'Base color', value: config.seeds.neutral },
    { name: 'Accent', value: config.seeds.accent },
  ]
  return (
    <div className="flex flex-col gap-1.5">
      {rows.map((row) => (
        <div key={row.name} className="flex items-center justify-between">
          <div className="flex min-w-0 flex-col items-start gap-1">
            <span className="text-[10px] tracking-widest text-fg-muted uppercase">
              {row.name}
            </span>
            <p className="truncate font-medium">{row.value}</p>
          </div>
          <div
            className="size-7 shrink-0 rounded-md border"
            style={{ backgroundColor: row.value }}
          />
        </div>
      ))}
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-widest text-fg-muted uppercase">
          Algorithm
        </span>
        <p className="font-medium">{algorithmLabel}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-widest text-fg-muted uppercase">
          Primary
        </span>
        <p className="font-medium">
          {config.primary === 'accent' ? 'Accent' : 'Neutral'}
        </p>
      </div>
    </div>
  )
}

export function ColorsConfig() {
  const {
    designSystem,
    setColorSeed,
    setColorAlgorithm,
    setColorPrimary,
    setColorKnob,
  } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const seeds = config.seeds
  const resolved = useMemo(() => resolveColorConfig(config), [config])

  return (
    <div className="-mt-6 flex flex-col gap-4">
      <p className="text-xs text-fg-muted">
        Pick seeds, switch the algorithm, and fine-tune — ramps regenerate live.
      </p>

      <Select
        className="w-full"
        selectedKey={config.algorithm}
        onSelectionChange={(key) => setColorAlgorithm(key as AlgorithmId)}
      >
        <Label>Algorithm</Label>
        <Button size="sm" className="w-full justify-between">
          <SelectValue className="truncate" />
          <ChevronDownIcon data-icon-end="" />
        </Button>
        <Popover>
          <ListBox>
            {ALGORITHMS.map((algorithm) => (
              <ListBoxItem key={algorithm.id} id={algorithm.id}>
                {algorithm.label}
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </Select>

      <div className="grid grid-cols-2 gap-4">
        {SEED_FIELDS.map(({ label, key }) => (
          <ColorPicker
            key={key}
            value={seeds[key] ?? DEFAULT_COLOR_CONFIG.seeds[key]}
            onChange={(color) => setColorSeed(key, color.toString('hex'))}
          >
            {({ color }) => (
              <>
                <div className="flex flex-col gap-2">
                  <Label>{label}</Label>
                  <Button className="justify-start pl-2.5">
                    <ColorSwatch />
                    <span className="truncate">{color.toString('hex')}</span>
                  </Button>
                </div>
                <Popover>
                  <DialogContent>
                    <ColorEditor showFormatSelector={false} />
                  </DialogContent>
                </Popover>
              </>
            )}
          </ColorPicker>
        ))}
      </div>

      <Select
        className="w-full"
        selectedKey={config.primary ?? 'neutral'}
        onSelectionChange={(key) => setColorPrimary(key as PrimaryColorSource)}
      >
        <Label>Primary color</Label>
        <Button size="sm" className="w-full justify-between">
          <SelectValue className="truncate" />
          <ChevronDownIcon data-icon-end="" />
        </Button>
        <Popover>
          <ListBox>
            {PRIMARY_SOURCES.map((source) => (
              <ListBoxItem key={source.id} id={source.id}>
                {source.label}
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </Select>

      <ColorKnobsControls
        algorithm={config.algorithm}
        knobs={config.knobs ?? {}}
        steps={resolved.steps}
        onChange={setColorKnob}
      />

      <ContrastReadout resolved={resolved} />

      <div className="flex flex-col gap-1.5">
        <span className="pl-1 text-xs font-medium text-fg-muted">
          Generated ramps
        </span>
        {PALETTE_ORDER.map((palette) => {
          const ramp = resolved.light[palette]
          if (!ramp) return null
          return (
            <div
              key={palette}
              className="flex overflow-hidden rounded-md"
              title={palette}
            >
              {Object.entries(ramp).map(([step, value]) => (
                <div
                  key={step}
                  className="h-5 flex-1"
                  style={{ backgroundColor: value }}
                  title={`--${palette}-${step}: ${value}`}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
