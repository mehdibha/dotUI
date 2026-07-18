'use client'

import { useMemo } from 'react'
import { ChevronDownIcon } from 'lucide-react'

import { STEPS } from '@dotui/colors'

import {
  DEFAULT_COLOR_CONFIG,
  DEFAULT_STATUS_SEEDS,
  PALETTE_ORDER,
  resolveColorConfig,
} from '@/registry/theme'
import type { PrimaryColorSource } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { ColorEditor } from '@/registry/ui/color-editor'
import { ColorPicker } from '@/registry/ui/color-picker'
import { ColorSwatch } from '@/registry/ui/color-swatch'
import { DialogContent } from '@/registry/ui/dialog'
import {
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
} from '@/registry/ui/disclosure'
import { Label } from '@/registry/ui/field'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { Select, SelectValue } from '@/registry/ui/select'

import { useDesignSystem } from '../preset'
import { ContrastReadout } from './contrast'
import { ColorBackgroundControls, ColorFineTuneControls } from './knobs'

type GrayMode = 'auto' | 'pure' | 'custom'

const GRAY_MODES: ReadonlyArray<{ id: GrayMode; label: string }> = [
  { id: 'auto', label: 'Auto (tinted from brand)' },
  { id: 'pure', label: 'Pure gray' },
  { id: 'custom', label: 'Custom' },
]

const PRIMARY_SOURCES: ReadonlyArray<{
  id: PrimaryColorSource
  label: string
}> = [
  { id: 'neutral', label: 'Neutral (black & white)' },
  { id: 'accent', label: 'Accent (brand color)' },
]

const STATUS_FIELDS = [
  { key: 'success', label: 'Success' },
  { key: 'warning', label: 'Warning' },
  { key: 'danger', label: 'Danger' },
  { key: 'info', label: 'Info' },
] as const

function grayModeOf(config: {
  seeds: { neutral?: string }
  neutralTint?: number
}): GrayMode {
  if (config.seeds.neutral) return 'custom'
  if (config.neutralTint === 0) return 'pure'
  return 'auto'
}

function SeedPicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (hex: string) => void
}) {
  return (
    <ColorPicker
      value={value}
      onChange={(color) => onChange(color.toString('hex'))}
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
  )
}

/** Collapsed-card summary of the live color recipe. */
export function ColorsSummary() {
  const { designSystem } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const grayLabel = GRAY_MODES.find((m) => m.id === grayModeOf(config))?.label
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 flex-col items-start gap-1">
          <span className="text-[10px] tracking-widest text-fg-muted uppercase">
            Brand color
          </span>
          <p className="truncate font-medium">{config.seeds.accent}</p>
        </div>
        <div
          className="size-7 shrink-0 rounded-md border"
          style={{ backgroundColor: config.seeds.accent }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-widest text-fg-muted uppercase">
          Gray
        </span>
        <p className="font-medium">{grayLabel}</p>
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
  const { designSystem, setDesignSystem, setColorSeed, setColorPrimary } =
    useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const theme = useMemo(() => resolveColorConfig(config), [config])
  const grayMode = grayModeOf(config)

  // Gray-mode transitions touch two fields (neutral seed + neutralTint), so
  // apply them as one atomic update.
  function setGrayMode(mode: GrayMode) {
    setDesignSystem((prev) => {
      const base = prev.color ?? DEFAULT_COLOR_CONFIG
      const { neutral, ...seeds } = base.seeds
      const { neutralTint: _tint, ...rest } = base
      const color =
        mode === 'custom'
          ? { ...rest, seeds: { ...seeds, neutral: neutral ?? '#808080' } }
          : mode === 'pure'
            ? { ...rest, seeds, neutralTint: 0 }
            : { ...rest, seeds }
      return { ...prev, color }
    })
  }

  return (
    <div className="-mt-6 flex flex-col gap-4">
      <p className="text-xs text-fg-muted">
        One brand color is enough — the engine generates every ramp, solved for
        contrast in both modes.
      </p>

      <SeedPicker
        label="Brand color"
        value={config.seeds.accent}
        onChange={(hex) => setColorSeed('accent', hex)}
      />

      <Select
        className="w-full"
        selectedKey={grayMode}
        onSelectionChange={(key) => setGrayMode(key as GrayMode)}
      >
        <Label>Gray</Label>
        <Button size="sm" className="w-full justify-between">
          <SelectValue className="truncate" />
          <ChevronDownIcon data-icon-end="" />
        </Button>
        <Popover>
          <ListBox>
            {GRAY_MODES.map((mode) => (
              <ListBoxItem key={mode.id} id={mode.id}>
                {mode.label}
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </Select>

      {grayMode === 'custom' && (
        <SeedPicker
          label="Gray seed"
          value={config.seeds.neutral ?? '#808080'}
          onChange={(hex) => setColorSeed('neutral', hex)}
        />
      )}

      <Select
        className="w-full"
        selectedKey={config.primary ?? 'neutral'}
        onSelectionChange={(key) =>
          setColorPrimary(key === 'accent' ? 'accent' : undefined)
        }
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

      <div className="grid grid-cols-2 gap-4">
        {STATUS_FIELDS.map(({ key, label }) => (
          <SeedPicker
            key={key}
            label={label}
            value={config.seeds[key] ?? DEFAULT_STATUS_SEEDS[key]}
            onChange={(hex) => setColorSeed(key, hex)}
          />
        ))}
      </div>

      <ColorBackgroundControls
        lightSwatch={theme.light.background}
        darkSwatch={theme.dark.background}
      />

      <Disclosure>
        <DisclosureTrigger>Fine-tune</DisclosureTrigger>
        <DisclosurePanel>
          <ColorFineTuneControls seedDelta={theme.report.seedDelta.accent} />
        </DisclosurePanel>
      </Disclosure>

      <ContrastReadout report={theme.report} />

      <div className="flex flex-col gap-1.5">
        <span className="pl-1 text-xs font-medium text-fg-muted">
          Generated ramps
        </span>
        {PALETTE_ORDER.map((palette) => {
          const scale = theme.light.scales[palette]
          if (!scale) return null
          return (
            <div
              key={palette}
              className="flex overflow-hidden rounded-md"
              title={palette}
            >
              {STEPS.map((step) => (
                <div
                  key={step}
                  className="h-5 flex-1"
                  style={{ backgroundColor: scale[step] }}
                  title={`--${palette}-${step}: ${scale[step]}`}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
