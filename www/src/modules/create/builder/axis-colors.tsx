'use client'

import { useMemo, useState } from 'react'
import { ChevronDownIcon, ShieldCheckIcon, ShuffleIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
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
import { Switch } from '@/registry/ui/switch'
import { Tab, TabList, TabPanel, Tabs } from '@/registry/ui/tabs'

import { ContrastReadout, solidContrastReport } from '../colors/contrast'
import { ColorKnobsControls } from '../colors/knobs'
import { useDesignSystem } from '../preset'
import { Field, SummaryValue, SwatchDot } from './primitives'
import { CONTEXT_TOKENS_VAR, EXPOSE_PALETTES_VAR, useToken } from './tokens'

/* Plain-language relabel — beginners never see "torsion"; the raw id stays
   visible in Advanced so experts aren't lied to. */
const ALGORITHMS: ReadonlyArray<{
  id: AlgorithmId
  label: string
  blurb: string
}> = [
  { id: 'oklch', label: 'Natural', blurb: 'oklch · perceptual ramps' },
  { id: 'tailwind', label: 'Vibrant', blurb: 'tailwind · punchy mid-tones' },
  { id: 'material', label: 'Material', blurb: 'material · tonal palette' },
  { id: 'contrast', label: 'Accessible', blurb: 'contrast · WCAG-locked' },
]

const SEEDS: ReadonlyArray<{ key: keyof PaletteSeeds; label: string }> = [
  { key: 'accent', label: 'Brand' },
  { key: 'neutral', label: 'Base' },
  { key: 'success', label: 'Success' },
  { key: 'warning', label: 'Warning' },
  { key: 'danger', label: 'Danger' },
  { key: 'info', label: 'Info' },
]

function algoLabel(id: AlgorithmId) {
  return ALGORITHMS.find((a) => a.id === id)?.label ?? id
}

/* ------------------------------- Summary -------------------------------- */

export function ColorsSummary() {
  const { designSystem } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const resolved = useMemo(() => resolveColorConfig(config), [config])
  const ramp = resolved.light.accent
  const stops = ramp ? Object.values(ramp) : []
  return (
    <>
      <span
        className="hidden h-3 w-14 shrink-0 overflow-hidden rounded-full ring-1 ring-black/5 ring-inset sm:flex"
        style={{
          background:
            stops.length > 0
              ? `linear-gradient(to right, ${stops.join(',')})`
              : undefined,
        }}
        aria-hidden
      />
      <SwatchDot color={config.seeds.accent} />
      <SwatchDot color={config.seeds.neutral} />
      <SummaryValue className="max-sm:hidden">
        {algoLabel(config.algorithm)}
      </SummaryValue>
    </>
  )
}

/* ----------------------------- Seed picker ------------------------------ */

function SeedPicker({
  seed,
  label,
  auto,
}: {
  seed: keyof PaletteSeeds
  label: string
  auto: boolean
}) {
  const { designSystem, setColorSeed } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const value = config.seeds[seed] ?? DEFAULT_COLOR_CONFIG.seeds[seed]
  return (
    <ColorPicker
      value={value}
      onChange={(c) => setColorSeed(seed, c.toString('hex'))}
    >
      {({ color }) => (
        <div className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1.5 text-[11px] text-fg-muted">
            {label}
            {auto && (
              <span className="rounded-full border border-dashed border-fg-muted/40 px-1 text-[9px] tracking-wide text-fg-muted/70 uppercase">
                auto
              </span>
            )}
          </span>
          <Button
            size="sm"
            className={cn('justify-start pl-2', auto && 'opacity-60')}
          >
            <ColorSwatch />
            <span className="truncate font-mono text-[11px]">
              {color.toString('hex')}
            </span>
          </Button>
          <Popover>
            <DialogContent className="flex w-56 flex-col gap-2">
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
        </div>
      )}
    </ColorPicker>
  )
}

function StyleSelect({ showRaw }: { showRaw?: boolean }) {
  const { designSystem, setColorAlgorithm } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  return (
    <Select
      className="w-full"
      selectedKey={config.algorithm}
      onSelectionChange={(key) => setColorAlgorithm(key as AlgorithmId)}
      aria-label="Color style"
    >
      <Button size="sm" className="w-full justify-between">
        <SelectValue className="truncate" />
        <ChevronDownIcon data-icon-end="" />
      </Button>
      <Popover>
        <ListBox>
          {ALGORITHMS.map((a) => (
            <ListBoxItem key={a.id} id={a.id} textValue={a.label}>
              <div className="flex flex-col">
                <span>{a.label}</span>
                {showRaw && (
                  <span className="font-mono text-[10px] text-fg-muted">
                    {a.blurb}
                  </span>
                )}
              </div>
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  )
}

function SeedGrid() {
  const { designSystem } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-3">
      {SEEDS.map(({ key, label }) => {
        const isAuto =
          (config.seeds[key] ?? DEFAULT_COLOR_CONFIG.seeds[key]) ===
            DEFAULT_COLOR_CONFIG.seeds[key] && key !== 'accent'
        return <SeedPicker key={key} seed={key} label={label} auto={isAuto} />
      })}
    </div>
  )
}

/* --------------------------- Contrast guard ----------------------------- */

function ContrastGuard() {
  const { designSystem, setColorAlgorithm } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const resolved = useMemo(() => resolveColorConfig(config), [config])
  const report = solidContrastReport(resolved)
  const failing = report.filter((r) => r.level === 'fail')
  return (
    <div className="flex flex-col gap-2">
      <ContrastReadout resolved={resolved} />
      {failing.length > 0 && config.algorithm !== 'contrast' && (
        <Button
          size="sm"
          variant="primary"
          className="w-full"
          onPress={() => setColorAlgorithm('contrast')}
        >
          <ShieldCheckIcon data-icon-start="" />
          Nudge {failing.length} to AA
        </Button>
      )}
    </div>
  )
}

/* ---------------------------- Generated ramps --------------------------- */

function RampViewer() {
  const { designSystem } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const resolved = useMemo(() => resolveColorConfig(config), [config])
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium text-fg-muted">
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
  )
}

/* -------------------------------- Axis ---------------------------------- */

export function ColorsAxis() {
  const { designSystem, setColorSeed, setColorKnob } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const [mode, setMode] = useState<'simple' | 'advanced'>('simple')
  const [exposed, setExposed] = useToken(EXPOSE_PALETTES_VAR, 'false')
  const [contextTokens, setContextTokens] = useToken(
    CONTEXT_TOKENS_VAR,
    'false',
  )

  const resolved = useMemo(() => resolveColorConfig(config), [config])

  function surpriseAccent() {
    // Re-roll the brand hue while staying in a legible lightness/chroma band.
    const hue = Math.floor(Math.random() * 360)
    const c = `oklch(0.62 0.19 ${hue})`
    setColorSeed('accent', c)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Non-destructive Simple | Advanced — switching only hides advanced
          controls, never discards their values. */}
      <Tabs
        selectedKey={mode}
        onSelectionChange={(k) => setMode(k as 'simple' | 'advanced')}
      >
        <TabList variant="line" className="w-full">
          <Tab id="simple" className="flex-1">
            Simple
          </Tab>
          <Tab id="advanced" className="flex-1">
            Advanced
          </Tab>
        </TabList>

        <TabPanel id="simple" className="mt-4 flex flex-col gap-4">
          <Field
            label="Brand & base"
            hint="Pick one brand colour — the rest of the system derives from it."
          >
            <SeedGrid />
          </Field>
          <Field label="Style" binding="live">
            <div className="flex gap-2">
              <StyleSelect />
              <Button
                size="sm"
                isIconOnly
                aria-label="Surprise me"
                onPress={surpriseAccent}
              >
                <ShuffleIcon />
              </Button>
            </div>
          </Field>
          <ContrastGuard />
        </TabPanel>

        <TabPanel id="advanced" className="mt-4 flex flex-col gap-4">
          <Field label="Seeds" binding="live">
            <SeedGrid />
          </Field>
          <Field label="Generation algorithm" binding="live">
            <StyleSelect showRaw />
          </Field>
          <Field label="Fine-tuning" binding="live">
            <ColorKnobsControls
              algorithm={config.algorithm}
              knobs={config.knobs ?? {}}
              steps={resolved.steps}
              onChange={setColorKnob}
            />
          </Field>
          <ContrastGuard />
          <RampViewer />
          <label className="flex items-center justify-between gap-2 text-xs text-fg-muted">
            <span className="flex flex-col">
              <span className="font-medium text-fg">Context-aware tokens</span>
              <span>Tokens that adapt to the surface they sit on.</span>
            </span>
            <Switch
              isSelected={contextTokens === 'true'}
              onChange={(s) => setContextTokens(String(s))}
              aria-label="Context-aware tokens"
            />
          </label>
        </TabPanel>
      </Tabs>

      {/* Palettes as first-class foundations — the literal brief requirement. */}
      <label className="flex items-center justify-between gap-2 border-t pt-3 text-xs text-fg-muted">
        <span className="flex flex-col">
          <span className="font-medium text-fg">
            Expose palettes as foundations
          </span>
          <span>Surface every generated ramp as an editable foundation.</span>
        </span>
        <Switch
          isSelected={exposed === 'true'}
          onChange={(s) => setExposed(String(s))}
          aria-label="Expose palettes as foundations"
        />
      </label>
    </div>
  )
}
