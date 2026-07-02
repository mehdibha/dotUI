'use client'

/**
 * The tier axis — the builder organized by token altitude rather than by
 * feature domain. Primitives are the raw values everything derives from;
 * Semantic is how those values acquire meaning (roles, states, motion);
 * Components (its own section) is the per-component override layer.
 *
 * Same controls as the domain view, re-cut along the axis design-system teams
 * actually think in: primitive → semantic → component.
 */

import { useMemo } from 'react'

import * as sampleIcons from '@/registry/__generated__/icons'
import { iconLibraries } from '@/registry/icons/icon-map'
import {
  DEFAULT_COLOR_CONFIG,
  PALETTE_ORDER,
  resolveColorConfig,
} from '@/registry/theme'
import type { AlgorithmId, PaletteSeeds } from '@/registry/theme'

import { ContrastReadout } from '../colors/contrast'
import { ColorKnobsControls } from '../colors/knobs'
import {
  CURSOR_DISABLED_VAR,
  CURSOR_INTERACTIVE_VAR,
  DEFAULT_CURSOR_DISABLED,
  DEFAULT_CURSOR_INTERACTIVE,
} from '../cursor'
import { DEFAULT_RADIUS_FACTOR, RADIUS_FACTOR_VAR } from '../layout'
import { useDesignSystem } from '../preset'
import type { Density } from '../preset'
import {
  Advanced,
  Field,
  GroupLabel,
  RampStrip,
  SectionIntro,
  SeedSwatch,
  Segmented,
  SelectRow,
  SliderRow,
  SwitchRow,
  usePro,
} from './widgets'

/* --------------------------------- Tokens -------------------------------- */

const BORDER_WIDTH_VAR = '--ds-border-width'
const SPACING_SCALE_VAR = '--ds-spacing-scale'
const ELEVATION_STYLE_VAR = '--ds-elevation-style'
const SHADOW_INTENSITY_VAR = '--ds-shadow-intensity'
const BACKDROP_BLUR_VAR = '--ds-backdrop-blur'
const MOTION_DURATION_VAR = '--ds-motion-duration'
const MOTION_EASING_VAR = '--ds-motion-easing'
const MOTION_ENABLED_VAR = '--ds-motion-enabled'
const REDUCED_MOTION_VAR = '--ds-reduced-motion'
const TYPE_SCALE_VAR = '--ds-type-scale'
const TYPE_BASE_VAR = '--ds-type-base'
const FONT_HEADING_VAR = '--ds-font-heading'
const FONT_BODY_VAR = '--ds-font-body'
const ICON_STROKE_VAR = '--ds-icon-stroke'
const ICON_LIBRARY_VAR = '--ds-icon-library'
const FOCUS_RING_VAR = '--ds-focus-ring-width'
const PALETTE_FOUNDATION_VAR = '--ds-palette-foundations'
const DEFAULT_MODE_VAR = '--ds-default-mode'

function useToken(name: string, fallback: string) {
  const { designSystem, setToken } = useDesignSystem()
  const value = designSystem.tokens[name] ?? fallback
  return [value, (v: string) => setToken(name, v)] as const
}

const num = (v: string, f: number) => {
  const n = Number.parseFloat(v)
  return Number.isFinite(n) ? n : f
}

const ALGORITHMS: ReadonlyArray<{ value: AlgorithmId; label: string }> = [
  { value: 'oklch', label: 'OKLCH — perceptual' },
  { value: 'tailwind', label: 'Tailwind-style' },
  { value: 'material', label: 'Material — tonal' },
  { value: 'contrast', label: 'Contrast-locked' },
]

const STATUS_SEEDS: ReadonlyArray<{ key: keyof PaletteSeeds; label: string }> =
  [
    { key: 'success', label: 'Success' },
    { key: 'warning', label: 'Warning' },
    { key: 'danger', label: 'Danger' },
    { key: 'info', label: 'Info' },
  ]

const FONT_OPTIONS = [
  'Geist',
  'Inter',
  'Roboto',
  'Space Grotesk',
  'IBM Plex Sans',
  'Satoshi',
  'Manrope',
  'Playfair Display',
  'Merriweather',
  'Source Serif 4',
  'JetBrains Mono',
  'Geist Mono',
].map((f) => ({ value: f, label: f }))

const CURSORS = [
  'default',
  'pointer',
  'not-allowed',
  'wait',
  'progress',
  'text',
  'grab',
].map((c) => ({ value: c, label: c }))

const DENSITIES: ReadonlyArray<{ value: Density; label: string }> = [
  { value: 'compact', label: 'Compact' },
  { value: 'default', label: 'Default' },
  { value: 'comfortable', label: 'Cozy' },
]

/* ============================== Primitives ================================ */

export function PrimitivesSection() {
  const pro = usePro()
  const { designSystem, setColorSeed, setColorAlgorithm, setDensity } =
    useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const resolved = useMemo(() => resolveColorConfig(config), [config])

  const accent = config.seeds.accent ?? DEFAULT_COLOR_CONFIG.seeds.accent
  const neutral = config.seeds.neutral ?? DEFAULT_COLOR_CONFIG.seeds.neutral

  const [heading, setHeading] = useToken(FONT_HEADING_VAR, 'Geist')
  const [body, setBody] = useToken(FONT_BODY_VAR, 'Geist')
  const [scale, setScale] = useToken(TYPE_SCALE_VAR, '1.25')
  const [base, setBase] = useToken(TYPE_BASE_VAR, '16')
  const [radius, setRadius] = useToken(RADIUS_FACTOR_VAR, DEFAULT_RADIUS_FACTOR)
  const [border, setBorder] = useToken(BORDER_WIDTH_VAR, '1')
  const [spacing, setSpacing] = useToken(SPACING_SCALE_VAR, '1')
  const [library, setLibrary] = useToken(ICON_LIBRARY_VAR, 'lucide')
  const [stroke, setStroke] = useToken(ICON_STROKE_VAR, '2')

  return (
    <div className="flex flex-col gap-5">
      <SectionIntro title="Primitives">
        The raw token values everything else is built from — the literal colors,
        type, shape, spacing and icon set.
      </SectionIntro>

      <div className="flex flex-col gap-3">
        <GroupLabel>Color</GroupLabel>
        <Field label="Brand" live>
          <SeedSwatch
            value={accent}
            onChange={(hex) => setColorSeed('accent', hex)}
            label="Brand color"
          />
        </Field>
        <Field label="Base / gray" live>
          <SeedSwatch
            value={neutral}
            onChange={(hex) => setColorSeed('neutral', hex)}
            label="Base gray"
          />
        </Field>
        {pro && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {STATUS_SEEDS.map((s) => (
                <Field key={s.key} label={s.label} live>
                  <SeedSwatch
                    value={
                      config.seeds[s.key] ??
                      DEFAULT_COLOR_CONFIG.seeds[s.key] ??
                      ''
                    }
                    onChange={(hex) => setColorSeed(s.key, hex)}
                    label={s.label}
                  />
                </Field>
              ))}
            </div>
            <Field label="Generation algorithm" live>
              <SelectRow<AlgorithmId>
                ariaLabel="Color algorithm"
                value={config.algorithm}
                onChange={setColorAlgorithm}
                options={ALGORITHMS}
              />
            </Field>
          </>
        )}
        <div className="flex flex-col gap-1 pt-1">
          {PALETTE_ORDER.map((palette) => {
            const ramp = resolved.light[palette]
            if (!ramp) return null
            return (
              <RampStrip
                key={palette}
                title={palette}
                steps={Object.entries(ramp)}
              />
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <GroupLabel>Typography</GroupLabel>
        <Field label="Display font" live={false}>
          <SelectRow
            ariaLabel="Display font"
            value={heading}
            onChange={setHeading}
            options={FONT_OPTIONS}
          />
        </Field>
        <Field label="Body font" live={false}>
          <SelectRow
            ariaLabel="Body font"
            value={body}
            onChange={setBody}
            options={FONT_OPTIONS}
          />
        </Field>
        {pro && (
          <Advanced label="Type scale">
            <SliderRow
              label="Scale ratio"
              value={num(scale, 1.25)}
              min={1.1}
              max={1.5}
              step={0.01}
              format={(v) => v.toFixed(3)}
              onChange={(v) => setScale(String(v))}
            />
            <SliderRow
              label="Base size"
              value={num(base, 16)}
              min={13}
              max={18}
              step={1}
              format={(v) => `${v}px`}
              onChange={(v) => setBase(String(v))}
            />
          </Advanced>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <GroupLabel>Shape & space</GroupLabel>
        <SliderRow
          label="Radius factor"
          live
          value={num(radius, 1)}
          min={0}
          max={2}
          step={0.05}
          format={(v) => `${v.toFixed(2)}×`}
          onChange={(v) => setRadius(String(v))}
        />
        <Field label="Density" live>
          <Segmented<Density>
            ariaLabel="Density"
            value={designSystem.density}
            onChange={setDensity}
            options={DENSITIES}
          />
        </Field>
        {pro && (
          <>
            <SliderRow
              label="Border width"
              live={false}
              value={num(border, 1)}
              min={0}
              max={3}
              step={0.5}
              format={(v) => `${v}px`}
              onChange={(v) => setBorder(String(v))}
            />
            <SliderRow
              label="Spacing scale"
              live={false}
              value={num(spacing, 1)}
              min={0.75}
              max={1.5}
              step={0.05}
              format={(v) => `${v.toFixed(2)}×`}
              onChange={(v) => setSpacing(String(v))}
            />
          </>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <GroupLabel>Icons</GroupLabel>
        <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-neutral/40 px-3 py-3 text-fg-muted [&_svg]:size-4">
          {Object.entries(sampleIcons)
            .sort(([a], [b]) => a.localeCompare(b))
            .slice(0, 12)
            .map(([name, Icon]) => (
              <Icon key={name} />
            ))}
        </div>
        <Field label="Library" live={false}>
          <SelectRow
            ariaLabel="Icon library"
            value={library}
            onChange={setLibrary}
            options={iconLibraries.map((l) => ({
              value: l.name,
              label: l.label,
            }))}
          />
        </Field>
        {pro && (
          <SliderRow
            label="Stroke width"
            live={false}
            value={num(stroke, 2)}
            min={1}
            max={2.5}
            step={0.25}
            format={(v) => `${v}px`}
            onChange={(v) => setStroke(String(v))}
          />
        )}
      </div>
    </div>
  )
}

/* =============================== Semantic ================================= */

type Foundation = 'tonal' | 'semantic'

export function SemanticSection() {
  const pro = usePro()
  const { designSystem, setColorSeed, setColorKnob, setToken } =
    useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const resolved = useMemo(() => resolveColorConfig(config), [config])

  const accent = config.seeds.accent ?? DEFAULT_COLOR_CONFIG.seeds.accent
  const neutral = config.seeds.neutral ?? DEFAULT_COLOR_CONFIG.seeds.neutral
  const isTinted = neutral.toLowerCase() !== '#808080'

  const foundation = (designSystem.tokens[PALETTE_FOUNDATION_VAR] ??
    'tonal') as Foundation

  const [interactive, setInteractive] = useToken(
    CURSOR_INTERACTIVE_VAR,
    DEFAULT_CURSOR_INTERACTIVE,
  )
  const [disabled, setDisabled] = useToken(
    CURSOR_DISABLED_VAR,
    DEFAULT_CURSOR_DISABLED,
  )
  const [focusRing, setFocusRing] = useToken(FOCUS_RING_VAR, '2')
  const [style, setStyle] = useToken(ELEVATION_STYLE_VAR, 'soft')
  const [shadow, setShadow] = useToken(SHADOW_INTENSITY_VAR, '0.5')
  const [blur, setBlur] = useToken(BACKDROP_BLUR_VAR, '0')
  const [duration, setDuration] = useToken(MOTION_DURATION_VAR, '150')
  const [easing, setEasing] = useToken(MOTION_EASING_VAR, 'standard')
  const [enabled, setEnabled] = useToken(MOTION_ENABLED_VAR, 'true')
  const [reduced, setReduced] = useToken(REDUCED_MOTION_VAR, 'true')
  const [mode, setMode] = useToken(DEFAULT_MODE_VAR, 'system')

  return (
    <div className="flex flex-col gap-5">
      <SectionIntro title="Semantic">
        How the raw values acquire meaning — surface and foreground roles,
        states, interaction, elevation and motion.
      </SectionIntro>

      <div className="flex flex-col gap-3">
        <GroupLabel>Color roles</GroupLabel>
        <Field
          label="Gray strategy"
          live
          hint="Pure neutrals, or grays tinted toward the brand."
        >
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
        <Field
          label="Palette foundations"
          live={false}
          hint={
            foundation === 'tonal'
              ? 'Ships every 50–950 tonal step as a foundation token.'
              : 'Ships only resolved semantic tokens — no raw ramps.'
          }
        >
          <Segmented<Foundation>
            ariaLabel="Palette foundations"
            value={foundation}
            onChange={(v) => setToken(PALETTE_FOUNDATION_VAR, v)}
            options={[
              { value: 'tonal', label: 'Tonal ramps' },
              { value: 'semantic', label: 'Semantic only' },
            ]}
          />
        </Field>
        {pro && (
          <Advanced label="Contrast & ramp tuning">
            <ColorKnobsControls
              algorithm={config.algorithm}
              knobs={config.knobs ?? {}}
              steps={resolved.steps}
              onChange={setColorKnob}
            />
            <ContrastReadout resolved={resolved} />
          </Advanced>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <GroupLabel>Interaction</GroupLabel>
        <Field label="Interactive cursor" live>
          <SelectRow
            ariaLabel="Interactive cursor"
            value={interactive}
            onChange={setInteractive}
            options={CURSORS}
          />
        </Field>
        <Field label="Disabled cursor" live>
          <SelectRow
            ariaLabel="Disabled cursor"
            value={disabled}
            onChange={setDisabled}
            options={CURSORS}
          />
        </Field>
        {pro && (
          <SliderRow
            label="Focus ring width"
            live={false}
            value={num(focusRing, 2)}
            min={0}
            max={4}
            step={1}
            format={(v) => `${v}px`}
            onChange={(v) => setFocusRing(String(v))}
          />
        )}
      </div>

      <div className="flex flex-col gap-3">
        <GroupLabel>Elevation</GroupLabel>
        <Field label="Style family" live={false}>
          <Segmented
            ariaLabel="Style family"
            value={style}
            onChange={setStyle}
            options={[
              { value: 'flat', label: 'Flat' },
              { value: 'soft', label: 'Soft' },
              { value: 'depth', label: '3D' },
              { value: 'glass', label: 'Glass' },
            ]}
          />
        </Field>
        {pro && (
          <>
            <SliderRow
              label="Shadow intensity"
              live={false}
              value={num(shadow, 0.5)}
              min={0}
              max={1}
              step={0.05}
              format={(v) => `${Math.round(v * 100)}%`}
              onChange={(v) => setShadow(String(v))}
            />
            <SliderRow
              label="Backdrop blur"
              live={false}
              value={num(blur, 0)}
              min={0}
              max={24}
              step={1}
              format={(v) => `${v}px`}
              onChange={(v) => setBlur(String(v))}
            />
          </>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <GroupLabel>Motion</GroupLabel>
        <SwitchRow
          label="Animations"
          hint="Global on/off for transitions"
          live={false}
          isSelected={enabled === 'true'}
          onChange={(v) => setEnabled(String(v))}
        />
        {pro && (
          <>
            <SliderRow
              label="Duration"
              live={false}
              value={num(duration, 150)}
              min={0}
              max={400}
              step={10}
              format={(v) => `${v}ms`}
              onChange={(v) => setDuration(String(v))}
            />
            <Field label="Easing" live={false}>
              <SelectRow
                value={easing}
                onChange={setEasing}
                options={[
                  { value: 'standard', label: 'Standard' },
                  { value: 'emphasized', label: 'Emphasized' },
                  { value: 'spring', label: 'Spring' },
                  { value: 'linear', label: 'Linear' },
                ]}
              />
            </Field>
            <SwitchRow
              label="Respect reduced-motion"
              live={false}
              isSelected={reduced === 'true'}
              onChange={(v) => setReduced(String(v))}
            />
          </>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <GroupLabel>Modes</GroupLabel>
        <Field label="Default mode" live={false}>
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
    </div>
  )
}
