'use client'

import { useMemo } from 'react'
import { ChevronDownIcon } from 'lucide-react'

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

import { ContrastReadout } from '../colors/contrast'
import { ColorKnobsControls } from '../colors/knobs'
import { Segmented } from '../panel/primitives'
import { SeedField } from '../panel/schema'
import { useDesignSystem } from '../preset'

/* Color widgets reused by the Studio inspector. They wrap the real color recipe
 * (seeds, algorithm, per-producer knobs) and the live contrast readout, so the
 * whole Color section genuinely drives the preview. */

export { SeedField }

const ALGORITHMS: ReadonlyArray<{ id: AlgorithmId; label: string }> = [
  { id: 'oklch', label: 'OKLCH Perceptual' },
  { id: 'tailwind', label: 'Tailwind-style' },
  { id: 'material', label: 'Material' },
  { id: 'contrast', label: 'Contrast-locked' },
]

export function AlgorithmWidget() {
  const { designSystem, setColorAlgorithm } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  return (
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
  )
}

export function StatusColorsWidget() {
  const status: Array<{ seed: keyof PaletteSeeds; label: string }> = [
    { seed: 'success', label: 'Success' },
    { seed: 'warning', label: 'Warning' },
    { seed: 'danger', label: 'Danger' },
    { seed: 'info', label: 'Info' },
  ]
  return (
    <div className="grid grid-cols-2 gap-2">
      {status.map((s) => (
        <div key={s.seed} className="flex flex-col gap-1">
          <span className="text-[10px] tracking-wider text-fg-muted uppercase">
            {s.label}
          </span>
          <SeedField seed={s.seed} />
        </div>
      ))}
    </div>
  )
}

export function GrayStrategyWidget() {
  const { designSystem, setColorSeed } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const isTinted =
    (config.seeds.neutral ?? '#808080').toLowerCase() !== '#808080'
  return (
    <Segmented
      ariaLabel="Gray strategy"
      value={isTinted ? 'tinted' : 'pure'}
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
  )
}

/** Per-algorithm knobs + WCAG readout + the generated ramps. */
export function ColorEngineWidget() {
  const { designSystem, setColorKnob } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const resolved = useMemo(() => resolveColorConfig(config), [config])
  return (
    <div className="flex flex-col gap-4">
      <ColorKnobsControls
        algorithm={config.algorithm}
        knobs={config.knobs ?? {}}
        steps={resolved.steps}
        onChange={setColorKnob}
      />
      <ContrastReadout resolved={resolved} />
      <div className="flex flex-col gap-1">
        {PALETTE_ORDER.map((palette) => {
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
                  title={`--${palette}-${step}`}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
