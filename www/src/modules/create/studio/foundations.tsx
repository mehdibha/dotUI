'use client'

import { type CSSProperties, useMemo, useState } from 'react'
import {
  BellIcon,
  ChevronDownIcon,
  HeartIcon,
  HouseIcon,
  PlayIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
} from 'lucide-react'

import {
  displayFonts,
  monoFonts,
  sansSerifFonts,
  serifFonts,
} from '@/registry/base/fonts'
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
import { Command } from '@/registry/ui/command'
import { DialogContent } from '@/registry/ui/dialog'
import { Description, FieldGroup, Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioIndicator,
} from '@/registry/ui/radio-group'
import { SearchField } from '@/registry/ui/search-field'
import { Select, SelectValue } from '@/registry/ui/select'
import { Switch } from '@/registry/ui/switch'

import { ChartColorsConfig } from '../chart-colors'
import { ContrastReadout } from '../colors/contrast'
import { ColorKnobsControls } from '../colors/knobs'
import {
  CURSOR_DISABLED_VAR,
  CURSOR_INTERACTIVE_VAR,
  DEFAULT_CURSOR_DISABLED,
  DEFAULT_CURSOR_INTERACTIVE,
} from '../cursor'
import { useDesignSystem } from '../preset'
import {
  BACKDROP_BLUR_VAR,
  BORDER_WIDTH_VAR,
  DEFAULT_MODE_VAR,
  DEFAULT_RADIUS_FACTOR,
  EASINGS,
  EXPOSE_PALETTES_VAR,
  FOCUS_RING_WIDTH_VAR,
  FONT_BODY_VAR,
  FONT_HEADING_VAR,
  HOVER_LIFT_VAR,
  ICON_STROKE_VAR,
  MOTION_DURATION_VAR,
  MOTION_EASING_VAR,
  MOTION_ENABLED_VAR,
  RADIUS_FACTOR_VAR,
  SHADOW_INTENSITY_VAR,
  SPACING_SCALE_VAR,
  STYLE_FAMILIES,
  TRACKING_VAR,
  TYPE_BASE_VAR,
  TYPE_SCALE_VAR,
  TYPE_WEIGHT_VAR,
} from './data'
import { Field, GroupLabel, Segmented, SliderRow } from './primitives'
import { useStudio } from './store'

/* ------------------------------ Token helper ----------------------------- */

function useToken(name: string, fallback: string) {
  const { designSystem, setToken } = useDesignSystem()
  const value = designSystem.tokens[name] ?? fallback
  return [value, (v: string) => setToken(name, v)] as const
}

/* ------------------------------- Selects -------------------------------- */

function SimpleSelect({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: string
  onChange: (v: string) => void
  options: ReadonlyArray<{ value: string; label: string }>
  ariaLabel?: string
}) {
  return (
    <Select
      className="w-full"
      selectedKey={value}
      onSelectionChange={(k) => onChange(k as string)}
      aria-label={ariaLabel}
    >
      <Button size="sm" className="w-full justify-between">
        <SelectValue className="truncate" />
        <ChevronDownIcon data-icon-end="" />
      </Button>
      <Popover>
        <ListBox>
          {options.map((opt) => (
            <ListBoxItem key={opt.value} id={opt.value}>
              {opt.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  )
}

function FontSelect({ varName }: { varName: string }) {
  const [value, set] = useToken(varName, 'Geist')
  return (
    <Select
      className="w-full"
      selectedKey={value}
      onSelectionChange={(k) => set(k as string)}
      aria-label="Font"
    >
      <Button size="sm" className="w-full justify-between">
        <SelectValue className="truncate" />
        <ChevronDownIcon data-icon-end="" />
      </Button>
      <Popover>
        <Command>
          <SearchField
            aria-label="Search fonts"
            autoFocus
            className="w-full p-2"
          >
            <Input className="w-full" />
          </SearchField>
          <ListBox>
            <ListBoxSection>
              <ListBoxSectionHeader>Sans</ListBoxSectionHeader>
              {sansSerifFonts.slice(0, 40).map((f) => (
                <ListBoxItem key={f} id={f} textValue={f}>
                  <span style={{ fontFamily: f }}>{f}</span>
                </ListBoxItem>
              ))}
            </ListBoxSection>
            <ListBoxSection>
              <ListBoxSectionHeader>Serif</ListBoxSectionHeader>
              {serifFonts.slice(0, 30).map((f) => (
                <ListBoxItem key={f} id={f} textValue={f}>
                  <span style={{ fontFamily: f }}>{f}</span>
                </ListBoxItem>
              ))}
            </ListBoxSection>
            <ListBoxSection>
              <ListBoxSectionHeader>Display</ListBoxSectionHeader>
              {displayFonts.slice(0, 30).map((f) => (
                <ListBoxItem key={f} id={f} textValue={f}>
                  <span style={{ fontFamily: f }}>{f}</span>
                </ListBoxItem>
              ))}
            </ListBoxSection>
            <ListBoxSection>
              <ListBoxSectionHeader>Mono</ListBoxSectionHeader>
              {monoFonts.slice(0, 20).map((f) => (
                <ListBoxItem key={f} id={f} textValue={f}>
                  <span style={{ fontFamily: f }}>{f}</span>
                </ListBoxItem>
              ))}
            </ListBoxSection>
          </ListBox>
        </Command>
      </Popover>
    </Select>
  )
}

/* ------------------------------- Seed field ------------------------------ */

function SeedField({ seed }: { seed: keyof PaletteSeeds }) {
  const { designSystem, setColorSeed } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const value =
    config.seeds[seed] ?? DEFAULT_COLOR_CONFIG.seeds[seed] ?? '#808080'
  return (
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
  )
}

/* ------------------------------- Ramp grid ------------------------------- */

function RampGrid() {
  const { designSystem } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const resolved = useMemo(() => resolveColorConfig(config), [config])
  return (
    <div className="flex flex-col gap-1.5">
      {PALETTE_ORDER.map((palette) => {
        const ramp = resolved.light[palette]
        if (!ramp) return null
        return (
          <div key={palette} className="flex flex-col gap-1">
            <span className="text-[10px] tracking-wide text-fg-muted/70 capitalize">
              {palette}
            </span>
            <div className="flex overflow-hidden rounded-md">
              {Object.entries(ramp).map(([step, val]) => (
                <div
                  key={step}
                  className="h-5 flex-1"
                  style={{ backgroundColor: val }}
                  title={`--${palette}-${step}: ${val}`}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ================================ COLOR ================================== */

const ALGORITHMS: ReadonlyArray<{ value: AlgorithmId; label: string }> = [
  { value: 'oklch', label: 'OKLCH Perceptual' },
  { value: 'tailwind', label: 'Tailwind-style' },
  { value: 'material', label: 'Material' },
  { value: 'contrast', label: 'Contrast-locked' },
]

type ColorMode = 'auto' | 'guided' | 'manual'

export function ColorEditor() {
  const { navigate } = useStudio()
  const { designSystem, setColorAlgorithm, setColorKnob, setColorSeed } =
    useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const resolved = useMemo(() => resolveColorConfig(config), [config])

  // Derive the editor mode from the current recipe so the segmented control
  // reflects how much the user has already reached into the system.
  const tinted = (config.seeds.neutral ?? '#808080').toLowerCase() !== '#808080'
  const [mode, setMode] = useTokenMode()

  return (
    <div className="flex flex-col gap-5">
      <Segmented<ColorMode>
        ariaLabel="Colour system mode"
        value={mode}
        onChange={setMode}
        options={[
          { value: 'auto', label: 'Auto', hint: 'One seed → full system' },
          { value: 'guided', label: 'Guided', hint: 'Tune the generator' },
          { value: 'manual', label: 'Manual', hint: 'Every palette by hand' },
        ]}
      />

      <Field label="Brand seed" live>
        <SeedField seed="accent" />
      </Field>

      {mode === 'auto' && (
        <div className="flex items-center justify-between gap-3 rounded-lg border bg-neutral/30 p-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium">
              Tint neutrals with brand
            </span>
            <span className="text-xs text-fg-muted">
              Warm the grays toward your accent
            </span>
          </div>
          <Switch
            isSelected={tinted}
            onChange={(on) =>
              setColorSeed(
                'neutral',
                on ? (config.seeds.accent ?? '#808080') : '#808080',
              )
            }
            aria-label="Tint neutrals with brand"
          />
        </div>
      )}

      {(mode === 'guided' || mode === 'manual') && (
        <>
          <Field label="Base / gray seed" live>
            <SeedField seed="neutral" />
          </Field>
          <Field
            label="Generation algorithm"
            hint="How seeds expand into tonal ramps."
            live
          >
            <SimpleSelect
              ariaLabel="Algorithm"
              value={config.algorithm}
              onChange={(v) => setColorAlgorithm(v as AlgorithmId)}
              options={ALGORITHMS}
            />
          </Field>
          <div className="flex flex-col gap-3">
            <GroupLabel>Engine knobs</GroupLabel>
            <ColorKnobsControls
              algorithm={config.algorithm}
              knobs={config.knobs ?? {}}
              steps={resolved.steps}
              onChange={setColorKnob}
            />
          </div>
        </>
      )}

      {mode === 'manual' && (
        <>
          <div className="flex flex-col gap-2">
            <GroupLabel>Status families</GroupLabel>
            <div className="grid grid-cols-2 gap-2">
              {(['success', 'warning', 'danger', 'info'] as const).map((s) => (
                <Field key={s} label={s} className="capitalize">
                  <SeedField seed={s} />
                </Field>
              ))}
            </div>
          </div>
          <PaletteExposeSwitch />
          <Button
            variant="default"
            size="sm"
            className="justify-between"
            onPress={() => navigate('chart-colors')}
          >
            Chart palette
            <ChevronDownIcon data-icon-end="" className="-rotate-90" />
          </Button>
        </>
      )}

      <ContrastReadout resolved={resolved} />

      <div className="flex flex-col gap-2">
        <GroupLabel>Generated ramps</GroupLabel>
        <RampGrid />
      </div>
    </div>
  )
}

/** Auto/guided/manual lives in local component state via a stub token so it persists in the preset. */
function useTokenMode() {
  const [value, set] = useToken('--ds-color-mode', 'auto')
  const mode = (
    value === 'guided' || value === 'manual' ? value : 'auto'
  ) as ColorMode
  return [mode, (m: ColorMode) => set(m)] as const
}

function PaletteExposeSwitch() {
  const [value, set] = useToken(EXPOSE_PALETTES_VAR, 'true')
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-neutral/30 p-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium">Expose palettes as tokens</span>
        <span className="text-xs text-fg-muted">
          Ship every ramp step as a foundation token
        </span>
      </div>
      <Switch
        isSelected={value === 'true'}
        onChange={(on) => set(String(on))}
        aria-label="Expose palettes as tokens"
      />
    </div>
  )
}

/* ============================== TYPOGRAPHY =============================== */

export function TypographyEditor() {
  const [scale, setScale] = useToken(TYPE_SCALE_VAR, '1.25')
  const [base, setBase] = useToken(TYPE_BASE_VAR, '16')
  const [weight, setWeight] = useToken(TYPE_WEIGHT_VAR, '500')
  const [tracking, setTracking] = useToken(TRACKING_VAR, '0')
  const [heading] = useToken(FONT_HEADING_VAR, 'Geist')
  const [body] = useToken(FONT_BODY_VAR, 'Geist')
  const baseNum = Number.parseFloat(base) || 16
  const scaleNum = Number.parseFloat(scale) || 1.25

  return (
    <div className="flex flex-col gap-5">
      {/* The card is the live proof: scale, weight and tracking are real CSS
          that render regardless of whether the chosen webfont is loaded. */}
      <div className="overflow-hidden rounded-lg border bg-neutral/30 p-4">
        <p
          className="truncate leading-tight"
          style={{
            fontFamily: heading,
            fontSize: `${baseNum * scaleNum * 1.4}px`,
            fontWeight: Number(weight),
            letterSpacing: `${tracking}em`,
          }}
        >
          The quick brown fox
        </p>
        <p
          className="mt-1 text-fg-muted"
          style={{ fontFamily: body, fontSize: `${baseNum}px` }}
        >
          jumps over the lazy dog — 0123456789
        </p>
      </div>
      <Field label="Display font">
        <FontSelect varName={FONT_HEADING_VAR} />
      </Field>
      <Field label="Body font">
        <FontSelect varName={FONT_BODY_VAR} />
      </Field>
      <SliderRow
        label="Scale ratio"
        value={Number.parseFloat(scale) || 1.25}
        min={1.1}
        max={1.5}
        step={0.005}
        format={(v) => v.toFixed(3)}
        onChange={(v) => setScale(String(v))}
      />
      <SliderRow
        label="Base size"
        value={Number.parseFloat(base) || 16}
        min={13}
        max={18}
        step={1}
        format={(v) => `${v}px`}
        onChange={(v) => setBase(String(v))}
      />
      <Field label="Heading weight">
        <Segmented
          ariaLabel="Heading weight"
          value={weight}
          onChange={setWeight}
          options={[
            { value: '400', label: 'Regular' },
            { value: '500', label: 'Medium' },
            { value: '600', label: 'Semibold' },
            { value: '700', label: 'Bold' },
          ]}
        />
      </Field>
      <SliderRow
        label="Letter spacing"
        value={Number.parseFloat(tracking) || 0}
        min={-0.05}
        max={0.1}
        step={0.005}
        format={(v) => `${v}em`}
        onChange={(v) => setTracking(String(v))}
      />
    </div>
  )
}

/* ================================ SHAPE ================================= */

export function ShapeEditor() {
  const [radius, setRadius] = useToken(RADIUS_FACTOR_VAR, DEFAULT_RADIUS_FACTOR)
  const [border, setBorder] = useToken(BORDER_WIDTH_VAR, '1')
  const num = Number.parseFloat(radius) || 1

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-center gap-3 rounded-lg border bg-neutral/30 p-4">
        {[0.5, 1, 1.5].map((m) => (
          <div
            key={m}
            className="size-12 border-2 border-primary/60 bg-primary/10"
            style={{ borderRadius: `calc(0.75rem * ${num} * ${m})` }}
          />
        ))}
      </div>
      <SliderRow
        label="Radius factor"
        live
        value={num}
        min={0}
        max={2}
        step={0.05}
        format={(v) => `${v.toFixed(2)}×`}
        onChange={(v) => setRadius(String(v))}
      />
      <SliderRow
        label="Border width"
        value={Number.parseFloat(border) || 1}
        min={0}
        max={3}
        step={0.5}
        format={(v) => `${v}px`}
        onChange={(v) => setBorder(String(v))}
      />
    </div>
  )
}

/* ============================ SPACING / DENSITY ========================== */

export function SpacingEditor() {
  const { designSystem, setDensity } = useDesignSystem()
  const [scale, setScale] = useToken(SPACING_SCALE_VAR, '1')

  const density = designSystem.density
  return (
    <div className="flex flex-col gap-5">
      <Field
        label="Density"
        live
        hint="Drives control heights, gaps and padding across the system."
      >
        <Segmented
          ariaLabel="Density"
          value={density}
          onChange={setDensity}
          options={[
            { value: 'compact', label: 'Compact' },
            { value: 'default', label: 'Default' },
            { value: 'comfortable', label: 'Cozy' },
          ]}
        />
      </Field>
      <SliderRow
        label="Spacing scale"
        value={Number.parseFloat(scale) || 1}
        min={0.75}
        max={1.5}
        step={0.05}
        format={(v) => `${v.toFixed(2)}×`}
        onChange={(v) => setScale(String(v))}
      />
    </div>
  )
}

/* ============================== ELEVATION =============================== */

export function ElevationEditor() {
  const [family, setFamily] = useToken('--ds-style-family', 'soft')
  const [shadow, setShadow] = useToken(SHADOW_INTENSITY_VAR, '0.5')
  const [blur, setBlur] = useToken(BACKDROP_BLUR_VAR, '0')

  const shadowNum = Number.parseFloat(shadow) || 0
  const blurNum = Number.parseFloat(blur) || 0

  return (
    <div className="flex flex-col gap-5">
      <ElevationPreview family={family} shadow={shadowNum} blur={blurNum} />
      <Field
        label="Style family"
        hint={STYLE_FAMILIES.find((s) => s.value === family)?.hint}
      >
        <Segmented
          ariaLabel="Style family"
          value={family}
          onChange={setFamily}
          options={STYLE_FAMILIES.map((s) => ({
            value: s.value,
            label: s.label,
          }))}
        />
      </Field>
      <SliderRow
        label="Shadow intensity"
        value={Number.parseFloat(shadow) || 0}
        min={0}
        max={1}
        step={0.05}
        format={(v) => `${Math.round(v * 100)}%`}
        onChange={(v) => setShadow(String(v))}
      />
      <SliderRow
        label="Backdrop blur"
        value={Number.parseFloat(blur) || 0}
        min={0}
        max={24}
        step={1}
        format={(v) => `${v}px`}
        onChange={(v) => setBlur(String(v))}
      />
    </div>
  )
}

/* ================================ MOTION ================================ */

export function MotionEditor() {
  const [duration, setDuration] = useToken(MOTION_DURATION_VAR, '150')
  const [easing, setEasing] = useToken(MOTION_EASING_VAR, 'standard')
  const [enabled, setEnabled] = useToken(MOTION_ENABLED_VAR, 'true')
  const [lift, setLift] = useToken(HOVER_LIFT_VAR, '1')

  return (
    <div className="flex flex-col gap-5">
      <MotionPreview
        duration={Number.parseFloat(duration) || 150}
        easing={easing}
        lift={Number.parseFloat(lift) || 0}
        enabled={enabled === 'true'}
      />
      <SwitchRow
        label="Animations"
        description="Master switch for every transition"
        value={enabled === 'true'}
        onChange={(on) => setEnabled(String(on))}
      />
      <SliderRow
        label="Duration scale"
        value={Number.parseFloat(duration) || 150}
        min={0}
        max={400}
        step={10}
        format={(v) => `${v}ms`}
        onChange={(v) => setDuration(String(v))}
      />
      <Field label="Easing">
        <SimpleSelect
          ariaLabel="Easing"
          value={easing}
          onChange={setEasing}
          options={EASINGS}
        />
      </Field>
      <SliderRow
        label="Hover lift"
        value={Number.parseFloat(lift) || 0}
        min={0}
        max={4}
        step={1}
        format={(v) => `${v}px`}
        onChange={(v) => setLift(String(v))}
      />
    </div>
  )
}

/* ================================ ICONS ================================= */

const ICON_LIBRARIES = [
  { name: 'Lucide', value: 'lucide', description: 'Clean & consistent' },
  { name: 'Remix Icons', value: 'remix', description: 'Neutral & versatile' },
  { name: 'Tabler Icons', value: 'tabler', description: 'Over 5,000 icons' },
  { name: 'Hugeicons', value: 'hugeicons', description: 'Modern & bold' },
  { name: 'Phosphor', value: 'phosphor', description: 'Flexible weights' },
]

export function IconsEditor() {
  const [library, setLibrary] = useToken('--ds-icon-library', 'lucide')
  const [stroke, setStroke] = useToken(ICON_STROKE_VAR, '2')

  const strokeNum = Number.parseFloat(stroke) || 2

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-around rounded-lg border bg-neutral/30 p-4 text-fg">
        {[
          HouseIcon,
          SearchIcon,
          BellIcon,
          HeartIcon,
          StarIcon,
          SettingsIcon,
        ].map((Icon, i) => (
          <Icon key={i} className="size-6" strokeWidth={strokeNum} />
        ))}
      </div>
      <RadioGroup
        value={library}
        onChange={setLibrary}
        aria-label="Icon library"
      >
        <FieldGroup className="gap-1.5">
          {ICON_LIBRARIES.map((lib) => (
            <Radio key={lib.value} value={lib.value}>
              <RadioControl className="justify-between rounded-lg border p-3 hover:bg-neutral/50 selected:border-border-control selected:bg-neutral-hover/80">
                <div className="flex flex-col gap-0.5 text-left">
                  <Label className="text-fg!">{lib.name}</Label>
                  <Description>{lib.description}</Description>
                </div>
                <RadioIndicator />
              </RadioControl>
            </Radio>
          ))}
        </FieldGroup>
      </RadioGroup>
      <SliderRow
        label="Stroke width"
        value={Number.parseFloat(stroke) || 2}
        min={1}
        max={2.5}
        step={0.25}
        format={(v) => `${v}px`}
        onChange={(v) => setStroke(String(v))}
      />
    </div>
  )
}

/* ============================= INTERACTION ============================== */

const CURSORS: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'default', label: 'Default' },
  { value: 'pointer', label: 'Pointer' },
  { value: 'not-allowed', label: 'Not allowed' },
  { value: 'wait', label: 'Wait' },
  { value: 'progress', label: 'Progress' },
  { value: 'text', label: 'Text' },
  { value: 'grab', label: 'Grab' },
  { value: 'help', label: 'Help' },
]

export function InteractionEditor() {
  const [interactive, setInteractive] = useToken(
    CURSOR_INTERACTIVE_VAR,
    DEFAULT_CURSOR_INTERACTIVE,
  )
  const [disabled, setDisabled] = useToken(
    CURSOR_DISABLED_VAR,
    DEFAULT_CURSOR_DISABLED,
  )
  const [ring, setRing] = useToken(FOCUS_RING_WIDTH_VAR, '2')

  return (
    <div className="flex flex-col gap-5">
      <Field label="Interactive cursor" live>
        <SimpleSelect
          ariaLabel="Interactive cursor"
          value={interactive}
          onChange={setInteractive}
          options={CURSORS}
        />
      </Field>
      <Field label="Disabled cursor" live>
        <SimpleSelect
          ariaLabel="Disabled cursor"
          value={disabled}
          onChange={setDisabled}
          options={CURSORS}
        />
      </Field>
      <SliderRow
        label="Focus ring width"
        value={Number.parseFloat(ring) || 2}
        min={0}
        max={4}
        step={1}
        format={(v) => `${v}px`}
        onChange={(v) => setRing(String(v))}
      />
    </div>
  )
}

/* ================================ MODES ================================= */

export function ModesEditor() {
  const [mode, setMode] = useToken(DEFAULT_MODE_VAR, 'system')
  return (
    <div className="flex flex-col gap-5">
      <Field
        label="Default mode"
        hint="Which appearance the exported system boots in."
      >
        <Segmented
          ariaLabel="Default mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'Auto' },
          ]}
        />
      </Field>
    </div>
  )
}

/* ============================= CHART COLORS ============================= */

export function ChartColorsEditor() {
  return (
    <div className="mt-6">
      <ChartColorsConfig />
    </div>
  )
}

/* ------------------------------- Switch row ------------------------------ */

function SwitchRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string
  description?: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-neutral/30 p-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium">{label}</span>
        {description && (
          <span className="text-xs text-fg-muted">{description}</span>
        )}
      </div>
      <Switch isSelected={value} onChange={onChange} aria-label={label} />
    </div>
  )
}

/* --------------------------- Elevation preview --------------------------- */

const EASING_CSS: Record<string, string> = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  emphasized: 'cubic-bezier(0.3, 0, 0, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  linear: 'linear',
}

function easingCss(id: string): string {
  return EASING_CSS[id] ?? 'cubic-bezier(0.2, 0, 0, 1)'
}

function elevationTileStyle(
  family: string,
  s: number,
  blur: number,
): CSSProperties {
  const soft = `0 1px 2px rgba(0,0,0,${(0.04 + 0.06 * s).toFixed(3)}), 0 ${Math.round(4 + 12 * s)}px ${Math.round(8 + 22 * s)}px rgba(0,0,0,${(0.05 + 0.13 * s).toFixed(3)})`
  if (family === 'flat') return { boxShadow: 'none' }
  if (family === 'depth')
    return {
      boxShadow: `0 2px 4px rgba(0,0,0,${(0.06 + 0.08 * s).toFixed(3)}), 0 ${Math.round(10 + 22 * s)}px ${Math.round(20 + 34 * s)}px rgba(0,0,0,${(0.1 + 0.18 * s).toFixed(3)})`,
      transform: 'translateY(-2px)',
    }
  if (family === 'glass')
    return {
      background: 'color-mix(in oklab, var(--color-card) 55%, transparent)',
      backdropFilter: `blur(${Math.max(blur, 10)}px)`,
      WebkitBackdropFilter: `blur(${Math.max(blur, 10)}px)`,
      boxShadow: soft,
    }
  return { boxShadow: soft }
}

/** Live preview of the elevation choices — real CSS shadows/blur, no preview iframe needed. */
function ElevationPreview({
  family,
  shadow,
  blur,
}: {
  family: string
  shadow: number
  blur: number
}) {
  return (
    <div
      className="relative overflow-hidden rounded-lg border p-4"
      style={{
        background:
          'radial-gradient(120% 120% at 0% 0%, color-mix(in oklab, var(--color-primary) 20%, var(--color-bg)) 0%, var(--color-bg) 65%)',
      }}
    >
      <div className="flex items-center justify-around gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="font-heading flex h-14 w-full items-center justify-center rounded-md border bg-card text-sm text-fg-muted transition-shadow"
            style={elevationTileStyle(family, shadow, blur)}
          >
            Aa
          </div>
        ))}
      </div>
    </div>
  )
}

/* ----------------------------- Motion preview ---------------------------- */

/** A slide + hover chip that replay at the chosen duration/easing — the axis made tangible. */
function MotionPreview({
  duration,
  easing,
  lift,
  enabled,
}: {
  duration: number
  easing: string
  lift: number
  enabled: boolean
}) {
  const [at, setAt] = useState(false)
  const d = enabled ? duration : 0
  const ease = easingCss(easing)
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-neutral/30 p-4">
      <div className="relative h-8 overflow-hidden rounded-md bg-neutral">
        <div
          className="absolute top-1/2 size-6 -translate-y-1/2 rounded-md bg-primary"
          style={{
            left: at ? 'calc(100% - 1.5rem - 4px)' : '4px',
            transitionProperty: 'left',
            transitionDuration: `${d}ms`,
            transitionTimingFunction: ease,
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <div
          className="flex h-7 items-center rounded-md border bg-card px-2 text-xs hover:[transform:translateY(calc(var(--lift)*-1))]"
          style={
            {
              '--lift': `${lift}px`,
              transitionProperty: 'transform',
              transitionDuration: `${d}ms`,
              transitionTimingFunction: ease,
            } as CSSProperties
          }
        >
          Hover me
        </div>
        <Button
          size="sm"
          variant="default"
          className="h-7 gap-1.5 px-2 text-xs"
          onPress={() => setAt((v) => !v)}
        >
          <PlayIcon className="size-3.5" />
          Replay
        </Button>
      </div>
    </div>
  )
}
