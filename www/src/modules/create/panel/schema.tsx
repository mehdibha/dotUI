'use client'

import { useMemo } from 'react'
import {
  BoxSelectIcon,
  ChevronDownIcon,
  type LucideIcon,
  GaugeIcon,
  LayersIcon,
  MousePointer2Icon,
  MoonIcon,
  PaletteIcon,
  RulerIcon,
  ShapesIcon,
  SmileIcon,
  SparklesIcon,
  TypeIcon,
  ZapIcon,
} from 'lucide-react'

import { STEPS } from '@dotui/colors'

import {
  DEFAULT_COLOR_CONFIG,
  DEFAULT_STATUS_SEEDS,
  PALETTE_ORDER,
  resolveColorConfig,
} from '@/registry/theme'
import type { PaletteSeeds } from '@/registry/theme'
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

import { ContrastReadout } from '../colors/contrast'
import { ColorFineTuneControls } from '../colors/knobs'
import { ComponentDetailView } from '../components'
import {
  CURSOR_DISABLED_VAR,
  CURSOR_INTERACTIVE_VAR,
  DEFAULT_CURSOR_DISABLED,
  DEFAULT_CURSOR_INTERACTIVE,
} from '../cursor'
import { DEFAULT_RADIUS_FACTOR, RADIUS_FACTOR_VAR } from '../layout'
import { useDesignSystem } from '../preset'
import { Segmented, ValueSlider } from './primitives'
import type { Control, Section } from './types'

/* ----------------------------------------------------------------------------
 * Token helpers
 *
 * Every control writes into the existing DesignSystem state. Real ones map to
 * tokens the preview already consumes (color, radius, density, cursor, params);
 * "stub" ones still write a CSS var through the same channel — harmless if no
 * component reads it yet, and instantly live the moment one does.
 * -------------------------------------------------------------------------- */

function useToken(name: string, fallback: string) {
  const { designSystem, setToken } = useDesignSystem()
  const value = designSystem.tokens[name] ?? fallback
  const set = (v: string) => setToken(name, v)
  return [value, set] as const
}

/* invented stub-token names (preview has no consumer yet) */
const BORDER_WIDTH_VAR = '--ds-border-width'
const ELEVATION_STYLE_VAR = '--ds-elevation-style'
const SHADOW_INTENSITY_VAR = '--ds-shadow-intensity'
const BACKDROP_BLUR_VAR = '--ds-backdrop-blur'
const MOTION_DURATION_VAR = '--ds-motion-duration'
const MOTION_ENABLED_VAR = '--ds-motion-enabled'
const FOCUS_RING_WIDTH_VAR = '--ds-focus-ring-width'
const TYPE_SCALE_VAR = '--ds-type-scale'
const TYPE_BASE_VAR = '--ds-type-base'
const SPACING_SCALE_VAR = '--ds-spacing-scale'

/* ------------------------------- Color ---------------------------------- */

/** Picker fallbacks for seeds the default config leaves absent (engine-derived). */
const SEED_FALLBACKS: Record<keyof PaletteSeeds, string> = {
  accent: DEFAULT_COLOR_CONFIG.seeds.accent,
  neutral: '#808080',
  ...DEFAULT_STATUS_SEEDS,
}

/** A color seed swatch+picker bound to one palette seed of the live recipe. */
export function SeedField({ seed }: { seed: keyof PaletteSeeds }) {
  const { designSystem, setColorSeed } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const value = config.seeds[seed] ?? SEED_FALLBACKS[seed]
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

/** Fine-tune axes + contrast readout + generated ramps — the deep color engine. */
function ColorEngineWidget() {
  const { designSystem } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const theme = useMemo(() => resolveColorConfig(config), [config])
  return (
    <div className="flex flex-col gap-4">
      <ColorFineTuneControls seedDelta={theme.report.seedDelta.accent} />
      <ContrastReadout report={theme.report} />
      <div className="flex flex-col gap-1">
        {PALETTE_ORDER.map((palette) => {
          const scale = theme.light.scales[palette]
          if (!scale) return null
          return (
            <div
              key={palette}
              className="flex overflow-hidden rounded"
              title={palette}
            >
              {STEPS.map((step) => (
                <div
                  key={step}
                  className="h-4 flex-1"
                  style={{ backgroundColor: scale[step] }}
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

function GrayStrategyWidget() {
  // Maps to the engine's neutralTint axis: 0 is pure gray, default whisper-tints
  // the neutral toward the brand hue.
  const { designSystem, setColorAxis } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  return (
    <Segmented
      ariaLabel="Gray strategy"
      value={config.neutralTint === 0 ? 'pure' : 'tinted'}
      onChange={(v) =>
        setColorAxis('neutralTint', v === 'pure' ? 0 : undefined)
      }
      options={[
        { value: 'pure', label: 'Pure' },
        { value: 'tinted', label: 'Brand-tinted' },
      ]}
    />
  )
}

function PrimarySourceWidget() {
  const { designSystem, setColorPrimary } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  return (
    <Segmented
      ariaLabel="Primary color"
      value={config.primary ?? 'neutral'}
      onChange={(v) => setColorPrimary(v === 'accent' ? 'accent' : undefined)}
      options={[
        { value: 'neutral', label: 'Neutral' },
        { value: 'accent', label: 'Accent' },
      ]}
    />
  )
}

/* ------------------------------- Shape ---------------------------------- */

function RadiusFactorWidget() {
  const [value, set] = useToken(RADIUS_FACTOR_VAR, DEFAULT_RADIUS_FACTOR)
  const num = Number.parseFloat(value) || 1
  return (
    <ValueSlider
      ariaLabel="Radius factor"
      value={num}
      min={0}
      max={2}
      step={0.05}
      format={(v) => `${v.toFixed(2)}×`}
      onChange={(v) => set(String(v))}
    />
  )
}

function BorderWidthWidget() {
  const [value, set] = useToken(BORDER_WIDTH_VAR, '1')
  return (
    <ValueSlider
      ariaLabel="Border width"
      value={Number.parseFloat(value) || 1}
      min={0}
      max={3}
      step={0.5}
      format={(v) => `${v}px`}
      onChange={(v) => set(String(v))}
    />
  )
}

/* ------------------------------ Spacing --------------------------------- */

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

function SpacingScaleWidget() {
  const [value, set] = useToken(SPACING_SCALE_VAR, '1')
  return (
    <ValueSlider
      ariaLabel="Spacing scale"
      value={Number.parseFloat(value) || 1}
      min={0.75}
      max={1.5}
      step={0.05}
      format={(v) => `${v.toFixed(2)}×`}
      onChange={(v) => set(String(v))}
    />
  )
}

/* ----------------------------- Typography ------------------------------- */

const FONTS = ['Geist', 'Inter', 'Satoshi', 'Söhne', 'IBM Plex Sans', 'Mono']

function FontWidget({ varName }: { varName: string }) {
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
        <ListBox>
          {FONTS.map((f) => (
            <ListBoxItem key={f} id={f}>
              {f}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  )
}

function TypeScaleWidget() {
  const [value, set] = useToken(TYPE_SCALE_VAR, '1.25')
  return (
    <ValueSlider
      ariaLabel="Type scale ratio"
      value={Number.parseFloat(value) || 1.25}
      min={1.1}
      max={1.5}
      step={0.01}
      format={(v) => v.toFixed(3)}
      onChange={(v) => set(String(v))}
    />
  )
}

function BaseSizeWidget() {
  const [value, set] = useToken(TYPE_BASE_VAR, '16')
  return (
    <ValueSlider
      ariaLabel="Base size"
      value={Number.parseFloat(value) || 16}
      min={13}
      max={18}
      step={1}
      format={(v) => `${v}px`}
      onChange={(v) => set(String(v))}
    />
  )
}

/* ------------------------------ Elevation ------------------------------- */

function StyleFamilyWidget() {
  const [value, set] = useToken(ELEVATION_STYLE_VAR, 'soft')
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

function ShadowIntensityWidget() {
  const [value, set] = useToken(SHADOW_INTENSITY_VAR, '0.5')
  return (
    <ValueSlider
      ariaLabel="Shadow intensity"
      value={Number.parseFloat(value) || 0.5}
      min={0}
      max={1}
      step={0.05}
      format={(v) => `${Math.round(v * 100)}%`}
      onChange={(v) => set(String(v))}
    />
  )
}

function BackdropBlurWidget() {
  const [value, set] = useToken(BACKDROP_BLUR_VAR, '0')
  return (
    <ValueSlider
      ariaLabel="Backdrop blur"
      value={Number.parseFloat(value) || 0}
      min={0}
      max={24}
      step={1}
      format={(v) => `${v}px`}
      onChange={(v) => set(String(v))}
    />
  )
}

/* ------------------------------- Motion --------------------------------- */

function DurationWidget() {
  const [value, set] = useToken(MOTION_DURATION_VAR, '150')
  return (
    <ValueSlider
      ariaLabel="Duration scale"
      value={Number.parseFloat(value) || 150}
      min={0}
      max={400}
      step={10}
      format={(v) => `${v}ms`}
      onChange={(v) => set(String(v))}
    />
  )
}

function BoolToken({
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

/* ---------------------------- Interaction ------------------------------- */

const CURSORS = [
  'default',
  'pointer',
  'not-allowed',
  'wait',
  'progress',
  'text',
  'grab',
]

function CursorWidget({
  varName,
  fallback,
}: {
  varName: string
  fallback: string
}) {
  const [value, set] = useToken(varName, fallback)
  return (
    <Select
      className="w-full"
      selectedKey={value}
      onSelectionChange={(k) => set(k as string)}
      aria-label="Cursor"
    >
      <Button size="sm" className="w-full justify-between">
        <SelectValue className="truncate" />
        <ChevronDownIcon data-icon-end="" />
      </Button>
      <Popover>
        <ListBox>
          {CURSORS.map((c) => (
            <ListBoxItem key={c} id={c}>
              {c}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  )
}

function FocusRingWidthWidget() {
  const [value, set] = useToken(FOCUS_RING_WIDTH_VAR, '2')
  return (
    <ValueSlider
      ariaLabel="Focus ring width"
      value={Number.parseFloat(value) || 2}
      min={0}
      max={4}
      step={1}
      format={(v) => `${v}px`}
      onChange={(v) => set(String(v))}
    />
  )
}

/* ----------------------------- Components -------------------------------- */

/** Reuses the real, live per-component param editor for one component. */
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

/* -------------------------------- Icons --------------------------------- */

function IconStrokeWidget() {
  const [value, set] = useToken('--ds-icon-stroke', '2')
  return (
    <ValueSlider
      ariaLabel="Icon stroke"
      value={Number.parseFloat(value) || 2}
      min={1}
      max={2.5}
      step={0.25}
      format={(v) => `${v}px`}
      onChange={(v) => set(String(v))}
    />
  )
}

/* --------------------------------- Mode --------------------------------- */

function DefaultModeWidget() {
  const [value, set] = useToken('--ds-default-mode', 'system')
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

/* ----------------------------------------------------------------------------
 * The schema — every atomic control, tagged on all three axes.
 * -------------------------------------------------------------------------- */

const c = (control: Control): Control => control

export const SECTIONS: Section[] = [
  {
    id: 'color',
    label: 'Color',
    domain: 'color',
    icon: PaletteIcon,
    controls: [
      c({
        id: 'brand-color',
        label: 'Brand color',
        description: 'The one real color on screen — drives accent ramps.',
        domain: 'color',
        tier: 'primitive',
        tempo: 'macro',
        binding: 'live',
        keywords: ['accent', 'primary', 'hue'],
        Widget: () => <SeedField seed="accent" />,
      }),
      c({
        id: 'base-color',
        label: 'Base / gray',
        description: 'Neutral seed the whole surface system derives from.',
        domain: 'color',
        tier: 'primitive',
        tempo: 'macro',
        binding: 'live',
        keywords: ['neutral', 'gray', 'grey'],
        Widget: () => <SeedField seed="neutral" />,
      }),
      c({
        id: 'gray-strategy',
        label: 'Gray strategy',
        description: 'Pure neutrals or grays tinted toward the brand.',
        domain: 'color',
        tier: 'semantic',
        tempo: 'macro',
        binding: 'live',
        Widget: GrayStrategyWidget,
      }),
      c({
        id: 'primary-color',
        label: 'Primary color',
        description: 'Black & white actions, or the brand accent.',
        domain: 'color',
        tier: 'semantic',
        tempo: 'macro',
        binding: 'live',
        keywords: ['primary', 'button', 'brand'],
        Widget: PrimarySourceWidget,
      }),
      c({
        id: 'status-colors',
        label: 'Status families',
        description: 'Success, warning, danger, info seeds.',
        domain: 'color',
        tier: 'semantic',
        tempo: 'micro',
        binding: 'live',
        block: true,
        Widget: StatusColorsWidget,
      }),
      c({
        id: 'color-engine',
        label: 'Ramps & contrast',
        description: 'Engine axes, contrast readout, generated scales.',
        domain: 'color',
        tier: 'primitive',
        tempo: 'micro',
        binding: 'live',
        block: true,
        Widget: ColorEngineWidget,
      }),
    ],
  },
  {
    id: 'typography',
    label: 'Typography',
    domain: 'typography',
    icon: TypeIcon,
    controls: [
      c({
        id: 'heading-font',
        label: 'Display font',
        description: 'Headings and large type.',
        domain: 'typography',
        tier: 'primitive',
        tempo: 'macro',
        binding: 'stub',
        Widget: () => <FontWidget varName="--ds-font-heading" />,
      }),
      c({
        id: 'body-font',
        label: 'Body font',
        domain: 'typography',
        tier: 'primitive',
        tempo: 'macro',
        binding: 'stub',
        Widget: () => <FontWidget varName="--ds-font-body" />,
      }),
      c({
        id: 'type-scale',
        label: 'Scale ratio',
        description: 'Modular scale between type steps.',
        domain: 'typography',
        tier: 'primitive',
        tempo: 'micro',
        binding: 'stub',
        Widget: TypeScaleWidget,
      }),
      c({
        id: 'base-size',
        label: 'Base size',
        domain: 'typography',
        tier: 'primitive',
        tempo: 'micro',
        binding: 'stub',
        Widget: BaseSizeWidget,
      }),
    ],
  },
  {
    id: 'shape',
    label: 'Shape',
    domain: 'shape',
    icon: ShapesIcon,
    controls: [
      c({
        id: 'radius-factor',
        label: 'Radius factor',
        description: 'Scales the whole corner-radius scale at once.',
        domain: 'shape',
        tier: 'primitive',
        tempo: 'macro',
        binding: 'live',
        keywords: ['corner', 'rounding'],
        Widget: RadiusFactorWidget,
      }),
      c({
        id: 'border-width',
        label: 'Border width',
        domain: 'shape',
        tier: 'primitive',
        tempo: 'micro',
        binding: 'stub',
        Widget: BorderWidthWidget,
      }),
    ],
  },
  {
    id: 'spacing',
    label: 'Spacing & density',
    domain: 'spacing',
    icon: RulerIcon,
    controls: [
      c({
        id: 'density',
        label: 'Density',
        description: 'Global control heights, gaps and padding.',
        domain: 'spacing',
        tier: 'primitive',
        tempo: 'macro',
        binding: 'live',
        keywords: ['compact', 'comfortable', 'scale'],
        Widget: DensityWidget,
      }),
      c({
        id: 'spacing-scale',
        label: 'Spacing scale',
        domain: 'spacing',
        tier: 'primitive',
        tempo: 'micro',
        binding: 'stub',
        Widget: SpacingScaleWidget,
      }),
    ],
  },
  {
    id: 'elevation',
    label: 'Elevation & depth',
    domain: 'elevation',
    icon: LayersIcon,
    controls: [
      c({
        id: 'style-family',
        label: 'Style family',
        description: 'The big re-skin: flat, soft, 3D or glass.',
        domain: 'elevation',
        tier: 'semantic',
        tempo: 'macro',
        binding: 'stub',
        keywords: ['flat', 'glass', 'neumorphism', 'skeuomorphic'],
        Widget: StyleFamilyWidget,
      }),
      c({
        id: 'shadow-intensity',
        label: 'Shadow intensity',
        domain: 'elevation',
        tier: 'primitive',
        tempo: 'micro',
        binding: 'stub',
        Widget: ShadowIntensityWidget,
      }),
      c({
        id: 'backdrop-blur',
        label: 'Backdrop blur',
        description: 'Frost behind overlays and menus.',
        domain: 'elevation',
        tier: 'primitive',
        tempo: 'micro',
        binding: 'stub',
        Widget: BackdropBlurWidget,
      }),
    ],
  },
  {
    id: 'motion',
    label: 'Motion',
    domain: 'motion',
    icon: ZapIcon,
    controls: [
      c({
        id: 'duration',
        label: 'Duration scale',
        description: 'Baseline transition speed.',
        domain: 'motion',
        tier: 'primitive',
        tempo: 'macro',
        binding: 'stub',
        Widget: DurationWidget,
      }),
      c({
        id: 'reduced-motion',
        label: 'Respect reduced-motion',
        domain: 'motion',
        tier: 'semantic',
        tempo: 'micro',
        binding: 'stub',
        Widget: () => (
          <BoolToken varName="--ds-reduced-motion" fallback="true" />
        ),
      }),
      c({
        id: 'motion-enabled',
        label: 'Animations',
        description: 'Global on/off for all transitions.',
        domain: 'motion',
        tier: 'semantic',
        tempo: 'micro',
        binding: 'stub',
        Widget: () => (
          <BoolToken varName={MOTION_ENABLED_VAR} fallback="true" />
        ),
      }),
    ],
  },
  {
    id: 'interaction',
    label: 'Interaction',
    domain: 'interaction',
    icon: MousePointer2Icon,
    controls: [
      c({
        id: 'cursor-interactive',
        label: 'Interactive cursor',
        description: 'Pointer on actionable elements.',
        domain: 'interaction',
        tier: 'semantic',
        tempo: 'micro',
        binding: 'live',
        Widget: () => (
          <CursorWidget
            varName={CURSOR_INTERACTIVE_VAR}
            fallback={DEFAULT_CURSOR_INTERACTIVE}
          />
        ),
      }),
      c({
        id: 'cursor-disabled',
        label: 'Disabled cursor',
        domain: 'interaction',
        tier: 'semantic',
        tempo: 'micro',
        binding: 'live',
        Widget: () => (
          <CursorWidget
            varName={CURSOR_DISABLED_VAR}
            fallback={DEFAULT_CURSOR_DISABLED}
          />
        ),
      }),
      c({
        id: 'focus-ring-width',
        label: 'Focus ring width',
        description: 'Keyboard focus outline thickness.',
        domain: 'interaction',
        tier: 'semantic',
        tempo: 'micro',
        binding: 'stub',
        Widget: FocusRingWidthWidget,
      }),
    ],
  },
  {
    id: 'components',
    label: 'Component anatomy',
    domain: 'component',
    icon: BoxSelectIcon,
    controls: [
      c({
        id: 'button-anatomy',
        label: 'Button',
        description: 'Style family, radius and the params buttons differ on.',
        domain: 'component',
        tier: 'component',
        tempo: 'micro',
        binding: 'live',
        block: true,
        Widget: () => <ComponentAnatomyWidget name="button" />,
      }),
      c({
        id: 'input-anatomy',
        label: 'Input',
        domain: 'component',
        tier: 'component',
        tempo: 'micro',
        binding: 'live',
        block: true,
        Widget: () => <ComponentAnatomyWidget name="input" />,
      }),
      c({
        id: 'card-anatomy',
        label: 'Card',
        domain: 'component',
        tier: 'component',
        tempo: 'micro',
        binding: 'live',
        block: true,
        Widget: () => <ComponentAnatomyWidget name="card" />,
      }),
    ],
  },
  {
    id: 'icons',
    label: 'Icons',
    domain: 'icon',
    icon: SmileIcon,
    controls: [
      c({
        id: 'icon-stroke',
        label: 'Stroke width',
        domain: 'icon',
        tier: 'primitive',
        tempo: 'micro',
        binding: 'stub',
        Widget: IconStrokeWidget,
      }),
    ],
  },
  {
    id: 'mode',
    label: 'Modes',
    domain: 'mode',
    icon: MoonIcon,
    controls: [
      c({
        id: 'default-mode',
        label: 'Default mode',
        description: 'Which mode the exported system boots in.',
        domain: 'mode',
        tier: 'semantic',
        tempo: 'micro',
        binding: 'stub',
        Widget: DefaultModeWidget,
      }),
    ],
  },
]

/* ----------------------------------------------------------------------------
 * Derived views — the lab re-groups the SAME controls without touching them.
 * -------------------------------------------------------------------------- */

export const ALL_CONTROLS: Control[] = SECTIONS.flatMap((s) => s.controls)

const TIER_META: Record<string, { label: string; icon: LucideIcon }> = {
  primitive: { label: 'Primitives', icon: PaletteIcon },
  semantic: { label: 'Semantic', icon: ShapesIcon },
  component: { label: 'Components', icon: BoxSelectIcon },
}
const TEMPO_META: Record<string, { label: string; icon: LucideIcon }> = {
  macro: { label: 'Macros', icon: SparklesIcon },
  micro: { label: 'Fine controls', icon: GaugeIcon },
}

function regroup(
  key: 'tier' | 'tempo',
  order: string[],
  meta: Record<string, { label: string; icon: LucideIcon }>,
): Section[] {
  return order
    .flatMap((bucket) => {
      const m = meta[bucket]
      if (!m) return []
      return [
        {
          id: bucket,
          label: m.label,
          domain: 'color' as const,
          icon: m.icon,
          controls: ALL_CONTROLS.filter((ctrl) => ctrl[key] === bucket),
        },
      ]
    })
    .filter((s) => s.controls.length > 0)
}

/** Sections for the active grouping. Domain is the authored order; the others derive. */
export function sectionsFor(grouping: 'domain' | 'tier' | 'tempo'): Section[] {
  if (grouping === 'tier') {
    return regroup('tier', ['primitive', 'semantic', 'component'], TIER_META)
  }
  if (grouping === 'tempo') {
    return regroup('tempo', ['macro', 'micro'], TEMPO_META)
  }
  return SECTIONS
}
