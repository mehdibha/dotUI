'use client'

import { type ComponentType, useMemo } from 'react'
import {
  BoxSelectIcon,
  ChevronDownIcon,
  type LucideIcon,
  LayersIcon,
  MessageSquareIcon,
  MoonIcon,
  MousePointer2Icon,
  PaletteIcon,
  RulerIcon,
  ShapesIcon,
  SmileIcon,
  TypeIcon,
  ZapIcon,
} from 'lucide-react'

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

import { ContrastReadout } from '../colors/contrast'
import { ColorKnobsControls } from '../colors/knobs'
import { ComponentDetailView } from '../components'
import { Segmented, ValueSlider } from '../panel/primitives'
import { SeedField } from '../panel/schema'
import { useDesignSystem } from '../preset'
import * as T from './tokens'

/* ----------------------------------------------------------------------------
 * The studio axis catalog
 *
 * Every visual decision a design system makes, as a configurable axis grouped
 * by domain. `binding: 'live'` controls drive the preview through an existing
 * token channel; `'stub'` controls write a `--ds-*` var no component reads yet —
 * honest UI for axes the engine will grow into. New tweaks beyond the shipped
 * set are marked in their descriptions.
 * -------------------------------------------------------------------------- */

export type Binding = 'live' | 'stub'

export interface StudioControl {
  id: string
  label: string
  description?: string
  binding: Binding
  /** Widget renders its own full UI (no chrome label row). */
  block?: boolean
  Widget: ComponentType
}

export interface StudioGroup {
  label?: string
  controls: StudioControl[]
}

export interface StudioDomain {
  id: string
  label: string
  tagline: string
  icon: LucideIcon
  groups: StudioGroup[]
}

/* ------------------------------ Token helper ----------------------------- */

function useToken(name: string, fallback: string) {
  const { designSystem, setToken } = useDesignSystem()
  const value = designSystem.tokens[name] ?? fallback
  return [value, (v: string) => setToken(name, v)] as const
}

/* -------------------------------- Widgets -------------------------------- */

function SelectWidget({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  ariaLabel: string
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
          {options.map((o) => (
            <ListBoxItem key={o} id={o}>
              {o}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  )
}

function SwitchToken({
  varName,
  fallback,
}: {
  varName: string
  fallback: string
}) {
  const [value, set] = useToken(varName, fallback)
  return (
    <Switch
      isSelected={value === 'true'}
      onChange={(s) => set(String(s))}
      aria-label="Toggle"
    />
  )
}

/* ------------------------------- Color ----------------------------------- */

const ALGORITHMS: ReadonlyArray<{ id: AlgorithmId; label: string }> = [
  { id: 'oklch', label: 'OKLCH Perceptual' },
  { id: 'tailwind', label: 'Tailwind-style' },
  { id: 'material', label: 'Material' },
  { id: 'contrast', label: 'Contrast-locked' },
]

function AlgorithmWidget() {
  const { designSystem, setColorAlgorithm } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  return (
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
  )
}

function GrayStrategyWidget() {
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

function StatusColorsWidget() {
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

function ColorEngineWidget() {
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

/* ------------------------------ Typography -------------------------------- */

const FONTS = ['Geist', 'Inter', 'Satoshi', 'Söhne', 'IBM Plex Sans', 'Mono']

function TrackingWidget() {
  const [value, set] = useToken(T.TRACKING_VAR, '0')
  return (
    <ValueSlider
      ariaLabel="Letter spacing"
      value={Number.parseFloat(value) || 0}
      min={-0.05}
      max={0.1}
      step={0.005}
      format={(v) => `${v.toFixed(3)}em`}
      onChange={(v) => set(String(v))}
    />
  )
}

function HeadingWeightWidget() {
  const [value, set] = useToken(T.HEADING_WEIGHT_VAR, '600')
  return (
    <Segmented
      ariaLabel="Heading weight"
      value={value}
      onChange={set}
      options={[
        { value: '500', label: 'Medium' },
        { value: '600', label: 'Semibold' },
        { value: '700', label: 'Bold' },
      ]}
    />
  )
}

/* -------------------------------- Shape ---------------------------------- */

function RadiusFactorWidget() {
  const [value, set] = useToken(T.RADIUS_FACTOR_VAR, T.DEFAULT_RADIUS_FACTOR)
  return (
    <ValueSlider
      ariaLabel="Radius factor"
      value={Number.parseFloat(value) || 1}
      min={0}
      max={2}
      step={0.05}
      format={(v) => `${v.toFixed(2)}×`}
      onChange={(v) => set(String(v))}
    />
  )
}

function CornerStyleWidget() {
  const [value, set] = useToken(T.CORNER_STYLE_VAR, 'rounded')
  return (
    <Segmented
      ariaLabel="Corner style"
      value={value}
      onChange={set}
      options={[
        { value: 'rounded', label: 'Rounded' },
        { value: 'squircle', label: 'Squircle' },
      ]}
    />
  )
}

/* ------------------------------- Spacing --------------------------------- */

function DensityWidget() {
  const { designSystem, setDensity } = useDesignSystem()
  return (
    <Segmented
      ariaLabel="Density"
      value={designSystem.density}
      onChange={setDensity}
      options={[
        { value: 'compact', label: 'Compact' },
        { value: 'default', label: 'Default' },
        { value: 'comfortable', label: 'Cozy' },
      ]}
    />
  )
}

function BaseUnitWidget() {
  const [value, set] = useToken(T.BASE_UNIT_VAR, '4')
  return (
    <Segmented
      ariaLabel="Base grid unit"
      value={value}
      onChange={set}
      options={[
        { value: '4', label: '4 pt' },
        { value: '8', label: '8 pt' },
      ]}
    />
  )
}

/* ------------------------------ Elevation -------------------------------- */

function StyleFamilyWidget() {
  const [value, set] = useToken(T.ELEVATION_STYLE_VAR, 'soft')
  return (
    <Segmented
      ariaLabel="Style family"
      value={value}
      onChange={set}
      options={[
        { value: 'flat', label: 'Flat' },
        { value: 'soft', label: 'Soft' },
        { value: 'depth', label: '3D' },
        { value: 'glass', label: 'Glass' },
      ]}
    />
  )
}

function ShadowTintWidget() {
  const [value, set] = useToken(T.SHADOW_TINT_VAR, 'neutral')
  return (
    <Segmented
      ariaLabel="Shadow tint"
      value={value}
      onChange={set}
      options={[
        { value: 'neutral', label: 'Neutral' },
        { value: 'brand', label: 'Brand' },
      ]}
    />
  )
}

/* -------------------------------- Motion --------------------------------- */

function EasingWidget() {
  const [value, set] = useToken(T.MOTION_EASING_VAR, 'standard')
  return (
    <Segmented
      ariaLabel="Easing"
      value={value}
      onChange={set}
      options={[
        { value: 'standard', label: 'Standard' },
        { value: 'spring', label: 'Spring' },
        { value: 'sharp', label: 'Sharp' },
      ]}
    />
  )
}

/* ------------------------------ Components -------------------------------- */

function ComponentAnatomyWidget({ name }: { name: string }) {
  const { designSystem, setComponentParam } = useDesignSystem()
  return (
    <ComponentDetailView
      componentName={name}
      selectedParams={designSystem.componentParams[name] ?? {}}
      onParamChange={(param, value) => setComponentParam(name, param, value)}
    />
  )
}

/* --------------------------------- Mode ---------------------------------- */

function DefaultModeWidget() {
  const [value, set] = useToken(T.DEFAULT_MODE_VAR, 'system')
  return (
    <Segmented
      ariaLabel="Default mode"
      value={value}
      onChange={set}
      options={[
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
        { value: 'system', label: 'Auto' },
      ]}
    />
  )
}

function LabelCasingWidget() {
  const [value, set] = useToken(T.LABEL_CASING_VAR, 'title')
  return (
    <Segmented
      ariaLabel="Label casing"
      value={value}
      onChange={set}
      options={[
        { value: 'title', label: 'Title Case' },
        { value: 'sentence', label: 'Sentence case' },
      ]}
    />
  )
}

/* -------------------------- Generic slider helpers ----------------------- */

function sliderToken(
  varName: string,
  fallback: string,
  opts: {
    min: number
    max: number
    step: number
    format: (v: number) => string
    aria: string
  },
): ComponentType {
  return function TokenSlider() {
    const [value, set] = useToken(varName, fallback)
    return (
      <ValueSlider
        ariaLabel={opts.aria}
        value={Number.parseFloat(value) || Number.parseFloat(fallback)}
        min={opts.min}
        max={opts.max}
        step={opts.step}
        format={opts.format}
        onChange={(v) => set(String(v))}
      />
    )
  }
}

const pxFmt = (v: number) => `${v}px`
const xFmt = (v: number) => `${v.toFixed(2)}×`
const pctFmt = (v: number) => `${Math.round(v * 100)}%`

/* ------------------------------- The catalog ----------------------------- */

const ctl = (c: StudioControl): StudioControl => c

export const STUDIO_DOMAINS: StudioDomain[] = [
  {
    id: 'color',
    label: 'Color',
    tagline: 'Seeds, ramps and contrast',
    icon: PaletteIcon,
    groups: [
      {
        label: 'Seeds',
        controls: [
          ctl({
            id: 'brand-color',
            label: 'Brand color',
            description:
              'The one real color on screen — drives the accent ramps.',
            binding: 'live',
            Widget: () => <SeedField seed="accent" />,
          }),
          ctl({
            id: 'base-color',
            label: 'Base / gray',
            description: 'Neutral seed the whole surface system derives from.',
            binding: 'live',
            Widget: () => <SeedField seed="neutral" />,
          }),
          ctl({
            id: 'gray-strategy',
            label: 'Gray strategy',
            description: 'Pure neutrals, or grays tinted toward the brand.',
            binding: 'live',
            Widget: GrayStrategyWidget,
          }),
        ],
      },
      {
        label: 'Generation',
        controls: [
          ctl({
            id: 'color-algorithm',
            label: 'Generation algorithm',
            description: 'How seeds expand into tonal ramps.',
            binding: 'live',
            Widget: AlgorithmWidget,
          }),
          ctl({
            id: 'status-colors',
            label: 'Status families',
            binding: 'live',
            block: true,
            Widget: StatusColorsWidget,
          }),
          ctl({
            id: 'color-engine',
            label: 'Ramps & contrast',
            binding: 'live',
            block: true,
            Widget: ColorEngineWidget,
          }),
        ],
      },
    ],
  },
  {
    id: 'typography',
    label: 'Type',
    tagline: 'Fonts, scale and rhythm',
    icon: TypeIcon,
    groups: [
      {
        label: 'Fonts',
        controls: [
          ctl({
            id: 'heading-font',
            label: 'Display font',
            binding: 'stub',
            Widget: () => {
              const [v, set] = useToken(T.FONT_HEADING_VAR, 'Geist')
              return (
                <SelectWidget
                  value={v}
                  onChange={set}
                  options={FONTS}
                  ariaLabel="Display font"
                />
              )
            },
          }),
          ctl({
            id: 'body-font',
            label: 'Body font',
            binding: 'stub',
            Widget: () => {
              const [v, set] = useToken(T.FONT_BODY_VAR, 'Geist')
              return (
                <SelectWidget
                  value={v}
                  onChange={set}
                  options={FONTS}
                  ariaLabel="Body font"
                />
              )
            },
          }),
        ],
      },
      {
        label: 'Scale & rhythm',
        controls: [
          ctl({
            id: 'type-scale',
            label: 'Scale ratio',
            description: 'Modular scale between type steps.',
            binding: 'stub',
            Widget: sliderToken(T.TYPE_SCALE_VAR, '1.25', {
              min: 1.1,
              max: 1.5,
              step: 0.01,
              format: (v) => v.toFixed(3),
              aria: 'Type scale',
            }),
          }),
          ctl({
            id: 'base-size',
            label: 'Base size',
            binding: 'stub',
            Widget: sliderToken(T.TYPE_BASE_VAR, '16', {
              min: 13,
              max: 18,
              step: 1,
              format: pxFmt,
              aria: 'Base size',
            }),
          }),
          ctl({
            id: 'tracking',
            label: 'Display tracking',
            description: 'New — letter-spacing on headings.',
            binding: 'stub',
            Widget: TrackingWidget,
          }),
          ctl({
            id: 'heading-weight',
            label: 'Heading weight',
            description: 'New — weight headings render at.',
            binding: 'stub',
            Widget: HeadingWeightWidget,
          }),
          ctl({
            id: 'line-height',
            label: 'Line height',
            description: 'New — body reading rhythm.',
            binding: 'stub',
            Widget: sliderToken(T.LINE_HEIGHT_VAR, '1.5', {
              min: 1.2,
              max: 1.8,
              step: 0.05,
              format: xFmt,
              aria: 'Line height',
            }),
          }),
        ],
      },
    ],
  },
  {
    id: 'shape',
    label: 'Shape',
    tagline: 'Radius and borders',
    icon: ShapesIcon,
    groups: [
      {
        controls: [
          ctl({
            id: 'radius-factor',
            label: 'Radius factor',
            description: 'Scales the whole corner-radius scale at once.',
            binding: 'live',
            Widget: RadiusFactorWidget,
          }),
          ctl({
            id: 'corner-style',
            label: 'Corner style',
            description: 'New — circular vs. iOS-style squircle corners.',
            binding: 'stub',
            Widget: CornerStyleWidget,
          }),
          ctl({
            id: 'border-width',
            label: 'Border width',
            binding: 'stub',
            Widget: sliderToken(T.BORDER_WIDTH_VAR, '1', {
              min: 0,
              max: 3,
              step: 0.5,
              format: pxFmt,
              aria: 'Border width',
            }),
          }),
        ],
      },
    ],
  },
  {
    id: 'spacing',
    label: 'Space',
    tagline: 'Density and grid',
    icon: RulerIcon,
    groups: [
      {
        controls: [
          ctl({
            id: 'density',
            label: 'Density',
            description: 'Global control heights, gaps and padding.',
            binding: 'live',
            Widget: DensityWidget,
          }),
          ctl({
            id: 'spacing-scale',
            label: 'Spacing scale',
            binding: 'stub',
            Widget: sliderToken(T.SPACING_SCALE_VAR, '1', {
              min: 0.75,
              max: 1.5,
              step: 0.05,
              format: xFmt,
              aria: 'Spacing scale',
            }),
          }),
          ctl({
            id: 'base-unit',
            label: 'Grid unit',
            description: 'New — 4pt or 8pt spacing grid.',
            binding: 'stub',
            Widget: BaseUnitWidget,
          }),
          ctl({
            id: 'content-width',
            label: 'Content width',
            description: 'New — max readable line / container width.',
            binding: 'stub',
            Widget: sliderToken(T.CONTENT_WIDTH_VAR, '1280', {
              min: 960,
              max: 1600,
              step: 40,
              format: pxFmt,
              aria: 'Content width',
            }),
          }),
        ],
      },
    ],
  },
  {
    id: 'elevation',
    label: 'Elevation',
    tagline: 'Depth, shadow and glass',
    icon: LayersIcon,
    groups: [
      {
        controls: [
          ctl({
            id: 'style-family',
            label: 'Style family',
            description: 'The big re-skin: flat, soft, 3D or glass.',
            binding: 'stub',
            Widget: StyleFamilyWidget,
          }),
          ctl({
            id: 'shadow-intensity',
            label: 'Shadow intensity',
            binding: 'stub',
            Widget: sliderToken(T.SHADOW_INTENSITY_VAR, '0.5', {
              min: 0,
              max: 1,
              step: 0.05,
              format: pctFmt,
              aria: 'Shadow intensity',
            }),
          }),
          ctl({
            id: 'shadow-tint',
            label: 'Shadow tint',
            description: 'New — neutral shadows or brand-tinted.',
            binding: 'stub',
            Widget: ShadowTintWidget,
          }),
          ctl({
            id: 'backdrop-blur',
            label: 'Backdrop blur',
            description: 'Frost behind overlays and menus.',
            binding: 'stub',
            Widget: sliderToken(T.BACKDROP_BLUR_VAR, '0', {
              min: 0,
              max: 24,
              step: 1,
              format: pxFmt,
              aria: 'Backdrop blur',
            }),
          }),
        ],
      },
    ],
  },
  {
    id: 'motion',
    label: 'Motion',
    tagline: 'Timing, easing and feel',
    icon: ZapIcon,
    groups: [
      {
        controls: [
          ctl({
            id: 'duration',
            label: 'Duration scale',
            binding: 'stub',
            Widget: sliderToken(T.MOTION_DURATION_VAR, '150', {
              min: 0,
              max: 400,
              step: 10,
              format: (v) => `${v}ms`,
              aria: 'Duration',
            }),
          }),
          ctl({
            id: 'easing',
            label: 'Easing curve',
            description: 'New — the personality of every transition.',
            binding: 'stub',
            Widget: EasingWidget,
          }),
          ctl({
            id: 'hover-lift',
            label: 'Hover lift',
            description: 'New — how far interactive surfaces rise on hover.',
            binding: 'stub',
            Widget: sliderToken(T.HOVER_LIFT_VAR, '0', {
              min: 0,
              max: 6,
              step: 1,
              format: pxFmt,
              aria: 'Hover lift',
            }),
          }),
          ctl({
            id: 'press-scale',
            label: 'Press scale',
            description: 'New — tactile shrink on press.',
            binding: 'stub',
            Widget: sliderToken(T.PRESS_SCALE_VAR, '1', {
              min: 0.9,
              max: 1,
              step: 0.01,
              format: xFmt,
              aria: 'Press scale',
            }),
          }),
          ctl({
            id: 'animations',
            label: 'Animations',
            description: 'Global on/off for all transitions.',
            binding: 'stub',
            Widget: () => (
              <SwitchToken varName={T.MOTION_ENABLED_VAR} fallback="true" />
            ),
          }),
        ],
      },
    ],
  },
  {
    id: 'interaction',
    label: 'Interaction',
    tagline: 'Cursors and focus',
    icon: MousePointer2Icon,
    groups: [
      {
        controls: [
          ctl({
            id: 'cursor-interactive',
            label: 'Interactive cursor',
            binding: 'live',
            Widget: () => {
              const [v, set] = useToken(
                T.CURSOR_INTERACTIVE_VAR,
                T.DEFAULT_CURSOR_INTERACTIVE,
              )
              return (
                <Segmented
                  ariaLabel="Interactive cursor"
                  value={v}
                  onChange={set}
                  options={[
                    { value: 'default', label: 'Default' },
                    { value: 'pointer', label: 'Pointer' },
                  ]}
                />
              )
            },
          }),
          ctl({
            id: 'cursor-disabled',
            label: 'Disabled cursor',
            binding: 'live',
            Widget: () => {
              const [v, set] = useToken(
                T.CURSOR_DISABLED_VAR,
                T.DEFAULT_CURSOR_DISABLED,
              )
              return (
                <Segmented
                  ariaLabel="Disabled cursor"
                  value={v}
                  onChange={set}
                  options={[
                    { value: 'default', label: 'Default' },
                    { value: 'not-allowed', label: 'Not allowed' },
                  ]}
                />
              )
            },
          }),
          ctl({
            id: 'focus-ring-style',
            label: 'Focus ring style',
            description: 'New — ring, outline or soft glow.',
            binding: 'stub',
            Widget: () => {
              const [v, set] = useToken(T.FOCUS_RING_STYLE_VAR, 'ring')
              return (
                <Segmented
                  ariaLabel="Focus ring style"
                  value={v}
                  onChange={set}
                  options={[
                    { value: 'ring', label: 'Ring' },
                    { value: 'outline', label: 'Outline' },
                    { value: 'glow', label: 'Glow' },
                  ]}
                />
              )
            },
          }),
          ctl({
            id: 'focus-ring-width',
            label: 'Focus ring width',
            binding: 'stub',
            Widget: sliderToken(T.FOCUS_RING_WIDTH_VAR, '2', {
              min: 0,
              max: 4,
              step: 1,
              format: pxFmt,
              aria: 'Focus ring width',
            }),
          }),
        ],
      },
    ],
  },
  {
    id: 'icon',
    label: 'Icons',
    tagline: 'Library and stroke',
    icon: SmileIcon,
    groups: [
      {
        controls: [
          ctl({
            id: 'icon-library',
            label: 'Icon library',
            description: 'New — the family icons are drawn from.',
            binding: 'stub',
            Widget: () => {
              const [v, set] = useToken(T.ICON_LIBRARY_VAR, 'Lucide')
              return (
                <SelectWidget
                  value={v}
                  onChange={set}
                  options={[
                    'Lucide',
                    'Phosphor',
                    'Radix',
                    'Tabler',
                    'Heroicons',
                  ]}
                  ariaLabel="Icon library"
                />
              )
            },
          }),
          ctl({
            id: 'icon-stroke',
            label: 'Stroke width',
            binding: 'stub',
            Widget: sliderToken(T.ICON_STROKE_VAR, '2', {
              min: 1,
              max: 2.5,
              step: 0.25,
              format: pxFmt,
              aria: 'Icon stroke',
            }),
          }),
          ctl({
            id: 'icon-scale',
            label: 'Icon scale',
            description: 'New — icon size relative to text.',
            binding: 'stub',
            Widget: sliderToken(T.ICON_SCALE_VAR, '1', {
              min: 0.85,
              max: 1.25,
              step: 0.05,
              format: xFmt,
              aria: 'Icon scale',
            }),
          }),
        ],
      },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    tagline: 'Per-component anatomy',
    icon: BoxSelectIcon,
    groups: [
      {
        controls: [
          ctl({
            id: 'button-anatomy',
            label: 'Button',
            binding: 'live',
            block: true,
            Widget: () => <ComponentAnatomyWidget name="button" />,
          }),
          ctl({
            id: 'input-anatomy',
            label: 'Input',
            binding: 'live',
            block: true,
            Widget: () => <ComponentAnatomyWidget name="input" />,
          }),
          ctl({
            id: 'card-anatomy',
            label: 'Card',
            binding: 'live',
            block: true,
            Widget: () => <ComponentAnatomyWidget name="card" />,
          }),
        ],
      },
    ],
  },
  {
    id: 'mode',
    label: 'Modes',
    tagline: 'Light, dark and voice',
    icon: MoonIcon,
    groups: [
      {
        controls: [
          ctl({
            id: 'default-mode',
            label: 'Default mode',
            description: 'Which mode the exported system boots in.',
            binding: 'stub',
            Widget: DefaultModeWidget,
          }),
        ],
      },
    ],
  },
  {
    id: 'content',
    label: 'Voice',
    tagline: 'Copy conventions',
    icon: MessageSquareIcon,
    groups: [
      {
        controls: [
          ctl({
            id: 'label-casing',
            label: 'Label casing',
            description:
              'New — Title Case vs. sentence case across the exported copy.',
            binding: 'stub',
            Widget: LabelCasingWidget,
          }),
        ],
      },
    ],
  },
]

export const DOMAIN_BY_ID = new Map(STUDIO_DOMAINS.map((d) => [d.id, d]))

/** Flat count of live vs. total controls — drives the honesty legend. */
export function controlStats() {
  const all = STUDIO_DOMAINS.flatMap((d) => d.groups.flatMap((g) => g.controls))
  const live = all.filter((c) => c.binding === 'live').length
  return { live, total: all.length }
}
