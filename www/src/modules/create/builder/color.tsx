'use client'

import { useMemo, useState } from 'react'
import { ChevronDownIcon, PaletteIcon } from 'lucide-react'

import { toHex } from '@dotui/colors'

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
import { Input } from '@/registry/ui/input'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { Select, SelectValue } from '@/registry/ui/select'

import { ContrastReadout, solidContrastReport } from '../colors/contrast'
import { ColorKnobsControls } from '../colors/knobs'
import { Segmented } from '../panel/primitives'
import { SeedField } from '../panel/schema'
import { useDesignSystem } from '../preset'
import { AspectCard, DrillButton, Field, Swatch } from './atoms'
import { useBuilderUi } from './use-builder-ui'

const ALGORITHMS: ReadonlyArray<{ id: AlgorithmId; label: string }> = [
  { id: 'oklch', label: 'OKLCH Perceptual' },
  { id: 'tailwind', label: 'Tailwind-style' },
  { id: 'material', label: 'Material' },
  { id: 'contrast', label: 'Contrast-locked' },
]

const STATUS: Array<{ seed: keyof PaletteSeeds; label: string }> = [
  { seed: 'success', label: 'Success' },
  { seed: 'warning', label: 'Warning' },
  { seed: 'danger', label: 'Danger' },
  { seed: 'info', label: 'Info' },
]

/* ----------------------------- contrast health ---------------------------- */

export type ContrastHealth = 'pass' | 'warn' | 'fail'

/**
 * The single source of truth for the system's accessibility glance — used by the
 * identity bar and the Color head. Honest about scope: text-on-solid (the 500
 * step) across palettes, light mode (what solidContrastReport actually measures).
 */
export function useContrastHealth(): { level: ContrastHealth; label: string } {
  const { designSystem } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  return useMemo(() => {
    const results = solidContrastReport(resolveColorConfig(config))
    if (results.length === 0)
      return { level: 'pass', label: 'No contrast data' }
    const hasFail = results.some((r) => r.level === 'fail')
    const allAAA = results.every((r) => r.level === 'AAA')
    const level: ContrastHealth = hasFail ? 'fail' : allAAA ? 'pass' : 'warn'
    const label =
      level === 'fail'
        ? 'A solid surface fails text contrast'
        : level === 'warn'
          ? 'Text on solids passes AA, not all AAA'
          : 'Text on solids passes WCAG AAA'
    return { level, label: `${label} · solids, light` }
  }, [config])
}

export function ContrastDot({ className }: { className?: string }) {
  const { level, label } = useContrastHealth()
  const color =
    level === 'fail'
      ? 'bg-danger'
      : level === 'warn'
        ? 'bg-warning'
        : 'bg-success'
  return (
    <span
      title={label}
      aria-label={label}
      className={`inline-block size-2 shrink-0 rounded-full ${color} ${className ?? ''}`}
    />
  )
}

/* ------------------------------- Color card ------------------------------ */

export function ColorCard() {
  const { designSystem, setColorSeed } = useDesignSystem()
  const { foundation, setFoundation, setDrill } = useBuilderUi()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const accent = config.seeds.accent ?? DEFAULT_COLOR_CONFIG.seeds.accent
  const neutral = config.seeds.neutral ?? DEFAULT_COLOR_CONFIG.seeds.neutral
  const isTinted = neutral.toLowerCase() !== '#808080'

  return (
    <AspectCard
      id="color"
      icon={PaletteIcon}
      title="Color"
      readout={
        <div className="flex items-center gap-2">
          <ContrastDot />
          <Swatch color={neutral} className="size-4" />
          <Swatch color={accent} className="size-4" />
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <Field
          label="Foundation"
          binding={foundation === 'tonal' ? 'live' : 'stub'}
          hint={
            foundation === 'tonal'
              ? 'Generated tonal ramps — seeds expand into full scales.'
              : 'Flat semantic colors — you set each role by hand.'
          }
        >
          <Segmented
            ariaLabel="Color foundation"
            value={foundation}
            onChange={setFoundation}
            options={[
              { value: 'tonal', label: 'Tonal palettes' },
              { value: 'flat', label: 'Flat semantic' },
            ]}
          />
        </Field>

        {foundation === 'tonal' ? (
          <>
            <Field label="Base / gray" binding="live">
              <SeedField seed="neutral" />
            </Field>
            <Field label="Gray strategy" binding="live">
              <Segmented
                ariaLabel="Gray strategy"
                value={isTinted ? 'tinted' : 'pure'}
                onChange={(v) =>
                  setColorSeed('neutral', v === 'pure' ? '#808080' : accent)
                }
                options={[
                  { value: 'pure', label: 'Pure' },
                  { value: 'tinted', label: 'Brand-tinted' },
                ]}
              />
            </Field>
            <Field label="Status colors" binding="live">
              <div className="grid grid-cols-2 gap-2">
                {STATUS.map((s) => (
                  <div key={s.seed} className="flex flex-col gap-1">
                    <span className="text-[10px] tracking-wider text-fg-muted uppercase">
                      {s.label}
                    </span>
                    <SeedField seed={s.seed} />
                  </div>
                ))}
              </div>
            </Field>
            <DrillButton
              label="Open color lab"
              hint="Algorithm, ramps, contrast & tuning"
              onPress={() => setDrill({ kind: 'color' })}
            />
          </>
        ) : (
          <FlatSemanticEditor />
        )}
      </div>
    </AspectCard>
  )
}

/* --------------------------- Flat semantic editor ------------------------ */

const FLAT_ROLES: Array<{
  key: string
  label: string
  palette: string
  step: string
}> = [
  { key: 'bg', label: 'Background', palette: 'neutral', step: '50' },
  { key: 'card', label: 'Surface', palette: 'neutral', step: '100' },
  { key: 'fg', label: 'Foreground', palette: 'neutral', step: '900' },
  { key: 'muted', label: 'Muted text', palette: 'neutral', step: '500' },
  { key: 'primary', label: 'Primary', palette: 'accent', step: '500' },
  { key: 'border', label: 'Border', palette: 'neutral', step: '200' },
  { key: 'success', label: 'Success', palette: 'success', step: '500' },
  { key: 'warning', label: 'Warning', palette: 'warning', step: '500' },
  { key: 'danger', label: 'Danger', palette: 'danger', step: '500' },
  { key: 'info', label: 'Info', palette: 'info', step: '500' },
]

function FlatSemanticEditor() {
  const { designSystem } = useDesignSystem()
  const { flatColors, setFlatColor } = useBuilderUi()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG

  // Seed defaults from the current tonal system so flipping to flat keeps the look.
  const defaults = useMemo(() => {
    const resolved = resolveColorConfig(config)
    const out: Record<string, string> = {}
    for (const r of FLAT_ROLES) {
      const ramp = resolved.light[r.palette] as
        | Record<string, string>
        | undefined
      const value = ramp?.[r.step]
      out[r.key] = value ? toHex(value) : '#808080'
    }
    return out
  }, [config])

  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-md border border-warning/30 bg-warning/5 px-2.5 py-2 text-xs text-fg-muted">
        Flat foundation — you hold the pen. Each role is set directly, no ramps.
        Live preview wiring for this mode is on the roadmap.
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        {FLAT_ROLES.map((r) => (
          <FlatSwatch
            key={r.key}
            label={r.label}
            value={flatColors[r.key] ?? defaults[r.key] ?? '#808080'}
            onChange={(v) => setFlatColor(r.key, v)}
          />
        ))}
      </div>
    </div>
  )
}

function FlatSwatch({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] tracking-wider text-fg-muted uppercase">
        {label}
      </span>
      <ColorPicker value={value} onChange={(c) => onChange(c.toString('hex'))}>
        <Button size="sm" className="w-full justify-start pl-2">
          <ColorSwatch />
          <span className="truncate font-mono text-xs">{value}</span>
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
      </ColorPicker>
    </div>
  )
}

/* -------------------------------- Color lab ------------------------------ */

/** The full-width deep editor — the one place the rail earns a takeover. */
export function ColorLab() {
  const { designSystem, setColorAlgorithm, setColorKnob } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const resolved = useMemo(() => resolveColorConfig(config), [config])
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const ramps = mode === 'light' ? resolved.light : resolved.dark

  return (
    <div className="flex flex-col gap-6">
      <Field
        label="Generation algorithm"
        binding="live"
        hint="How seeds expand into tonal ramps."
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

      <Field label="Tuning" binding="live">
        <ColorKnobsControls
          algorithm={config.algorithm}
          knobs={config.knobs ?? {}}
          steps={resolved.steps}
          onChange={setColorKnob}
        />
      </Field>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-fg">
            Generated ramps
          </span>
          <Segmented
            ariaLabel="Ramp mode"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
            ]}
          />
        </div>
        <div className="flex flex-col gap-2">
          {PALETTE_ORDER.map((palette) => {
            const ramp = ramps[palette]
            if (!ramp) return null
            return (
              <div key={palette} className="flex flex-col gap-1">
                <span className="text-[10px] tracking-wider text-fg-muted capitalize">
                  {palette}
                </span>
                <div className="flex overflow-hidden rounded-md ring-1 ring-border">
                  {Object.entries(ramp).map(([step, val]) => (
                    <div
                      key={step}
                      className="h-6 flex-1"
                      style={{ backgroundColor: val }}
                      title={`--${palette}-${step}: ${val}`}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <ContrastPanel />
    </div>
  )
}

/** Live WCAG readout reused from the colors module. */
function ContrastPanel() {
  const { designSystem } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const resolved = useMemo(() => resolveColorConfig(config), [config])
  return (
    <div className="rounded-lg border bg-neutral/30 p-3">
      <ContrastReadout resolved={resolved} />
    </div>
  )
}
