'use client'

import type { ComponentType } from 'react'
import {
  AccessibilityIcon,
  BoxSelectIcon,
  ChevronDownIcon,
  ImageIcon,
  LayersIcon,
  type LucideIcon,
  MousePointer2Icon,
  PaletteIcon,
  RulerIcon,
  ShapesIcon,
  SmileIcon,
  TypeIcon,
  ZapIcon,
} from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { Select, SelectValue } from '@/registry/ui/select'
import { Switch } from '@/registry/ui/switch'

import { ComponentDetailView } from '../components'
import {
  CURSOR_DISABLED_VAR,
  CURSOR_INTERACTIVE_VAR,
  DEFAULT_CURSOR_DISABLED,
  DEFAULT_CURSOR_INTERACTIVE,
} from '../cursor'
import { DEFAULT_RADIUS_FACTOR, RADIUS_FACTOR_VAR } from '../layout'
import { Segmented, ValueSlider } from '../panel/primitives'
import { useDesignSystem } from '../preset'
import {
  AlgorithmWidget,
  ColorEngineWidget,
  GrayStrategyWidget,
  SeedField,
  StatusColorsWidget,
} from './color-widgets'
import {
  BackgroundTextureWidget,
  BrandLogoWidget,
  ColorblindSafeWidget,
  ContrastTargetWidget,
  EasingWidget,
  FONT_BODY_VAR,
  FONT_HEADING_VAR,
  FontPairingWidget,
  FontWeightWidget,
  HoverEffectWidget,
  LineHeightWidget,
  PressScaleWidget,
  ShadowTintWidget,
  TapTargetWidget,
  TrackingWidget,
  TranslucentSurfacesWidget,
} from './controls'

/* ----------------------------------------------------------------------------
 * The Studio inspector schema.
 *
 * `live` controls drive the preview through the real token channel; `planned`
 * controls write a forward-looking CSS var the preview has no consumer for yet
 * (surfaced honestly in the inspector). The shape is intentionally flatter than
 * the lab's tri-axis schema — Studio has one opinionated layout, not five.
 * -------------------------------------------------------------------------- */

export type Binding = 'live' | 'planned'

export interface StudioControl {
  id: string
  label: string
  description?: string
  binding: Binding
  /** Widget owns its full layout (no inline label row). */
  block?: boolean
  Widget: ComponentType
}

export interface StudioSection {
  id: string
  label: string
  icon: LucideIcon
  tagline: string
  controls: StudioControl[]
}

/* --------------------------- Small token widgets ------------------------- */

function useToken(name: string, fallback: string) {
  const { designSystem, setToken } = useDesignSystem()
  const value = designSystem.tokens[name] ?? fallback
  return [value, (v: string) => setToken(name, v)] as const
}

function SelectToken({
  value,
  onChange,
  options,
  capitalize,
}: {
  value: string
  onChange: (v: string) => void
  options: ReadonlyArray<{ id: string; label: string }>
  capitalize?: boolean
}) {
  return (
    <Select
      className="w-full"
      selectedKey={value}
      onSelectionChange={(k) => onChange(k as string)}
      aria-label="Option"
    >
      <Button size="sm" className="w-full justify-between">
        <SelectValue
          className={capitalize ? 'truncate capitalize' : 'truncate'}
        />
        <ChevronDownIcon data-icon-end="" />
      </Button>
      <Popover>
        <ListBox>
          {options.map((o) => (
            <ListBoxItem
              key={o.id}
              id={o.id}
              className={capitalize ? 'capitalize' : undefined}
            >
              {o.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  )
}

/* live core */
function RadiusWidget() {
  const [value, set] = useToken(RADIUS_FACTOR_VAR, DEFAULT_RADIUS_FACTOR)
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
    <SelectToken
      value={value}
      onChange={set}
      options={CURSORS.map((c) => ({ id: c, label: c }))}
    />
  )
}

/* planned stubs */
function BorderWidthWidget() {
  const [value, set] = useToken('--ds-border-width', '1')
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
function SpacingScaleWidget() {
  const [value, set] = useToken('--ds-spacing-scale', '1')
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
function StyleFamilyWidget() {
  const [value, set] = useToken('--ds-elevation-style', 'soft')
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
  const [value, set] = useToken('--ds-shadow-intensity', '0.5')
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
  const [value, set] = useToken('--ds-backdrop-blur', '0')
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
function DurationWidget() {
  const [value, set] = useToken('--ds-motion-duration', '150')
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
function FocusRingWidthWidget() {
  const [value, set] = useToken('--ds-focus-ring-width', '2')
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
function TypeScaleWidget() {
  const [value, set] = useToken('--ds-type-scale', '1.25')
  return (
    <ValueSlider
      ariaLabel="Scale ratio"
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
  const [value, set] = useToken('--ds-type-base', '16')
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
function DisplayFontWidget() {
  const { designSystem, setToken } = useDesignSystem()
  const value = designSystem.tokens[FONT_HEADING_VAR] ?? 'Geist'
  return (
    <SelectToken
      value={value}
      onChange={(v) => setToken(FONT_HEADING_VAR, v)}
      options={FONTS}
    />
  )
}
function BodyFontWidget() {
  const { designSystem, setToken } = useDesignSystem()
  const value = designSystem.tokens[FONT_BODY_VAR] ?? 'Geist'
  return (
    <SelectToken
      value={value}
      onChange={(v) => setToken(FONT_BODY_VAR, v)}
      options={FONTS}
    />
  )
}
const FONTS = ['Geist', 'Inter', 'Satoshi', 'Söhne', 'Lora', 'Mono'].map(
  (f) => ({ id: f, label: f }),
)

function IconLibraryWidget() {
  const [value, set] = useToken('--ds-icon-library', 'lucide')
  return (
    <SelectToken
      value={value}
      onChange={set}
      capitalize
      options={[
        { id: 'lucide', label: 'Lucide' },
        { id: 'remix', label: 'Remix' },
        { id: 'tabler', label: 'Tabler' },
        { id: 'hugeicons', label: 'Hugeicons' },
      ]}
    />
  )
}
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

function ComponentAnatomy({ name }: { name: string }) {
  const { designSystem, setComponentParam } = useDesignSystem()
  return (
    <ComponentDetailView
      componentName={name}
      selectedParams={designSystem.componentParams[name] ?? {}}
      onParamChange={(param, value) => setComponentParam(name, param, value)}
    />
  )
}

/* -------------------------------- Schema -------------------------------- */

export const STUDIO_SECTIONS: StudioSection[] = [
  {
    id: 'color',
    label: 'Color',
    icon: PaletteIcon,
    tagline: 'Seeds, ramps & contrast',
    controls: [
      {
        id: 'brand-color',
        label: 'Brand color',
        description: 'The one real color — drives every accent ramp.',
        binding: 'live',
        Widget: () => <SeedField seed="accent" />,
      },
      {
        id: 'base-color',
        label: 'Base / gray',
        description: 'Neutral seed the whole surface system derives from.',
        binding: 'live',
        Widget: () => <SeedField seed="neutral" />,
      },
      {
        id: 'gray-strategy',
        label: 'Gray strategy',
        description: 'Pure neutrals, or grays tinted toward the brand.',
        binding: 'live',
        Widget: GrayStrategyWidget,
      },
      {
        id: 'algorithm',
        label: 'Generation algorithm',
        description: 'How seeds expand into tonal ramps.',
        binding: 'live',
        Widget: AlgorithmWidget,
      },
      {
        id: 'status-colors',
        label: 'Status families',
        binding: 'live',
        block: true,
        Widget: StatusColorsWidget,
      },
      {
        id: 'color-engine',
        label: 'Ramps & contrast',
        binding: 'live',
        block: true,
        Widget: ColorEngineWidget,
      },
    ],
  },
  {
    id: 'typography',
    label: 'Typography',
    icon: TypeIcon,
    tagline: 'Pairing, scale & rhythm',
    controls: [
      {
        id: 'font-pairing',
        label: 'Font pairing',
        binding: 'planned',
        block: true,
        Widget: FontPairingWidget,
      },
      {
        id: 'display-font',
        label: 'Display font',
        binding: 'planned',
        Widget: DisplayFontWidget,
      },
      {
        id: 'body-font',
        label: 'Body font',
        binding: 'planned',
        Widget: BodyFontWidget,
      },
      {
        id: 'type-scale',
        label: 'Scale ratio',
        description: 'Modular scale between type steps.',
        binding: 'planned',
        Widget: TypeScaleWidget,
      },
      {
        id: 'base-size',
        label: 'Base size',
        binding: 'planned',
        Widget: BaseSizeWidget,
      },
      {
        id: 'font-weight',
        label: 'Base weight',
        binding: 'planned',
        Widget: FontWeightWidget,
      },
      {
        id: 'tracking',
        label: 'Letter spacing',
        binding: 'planned',
        Widget: TrackingWidget,
      },
      {
        id: 'line-height',
        label: 'Line height',
        binding: 'planned',
        Widget: LineHeightWidget,
      },
    ],
  },
  {
    id: 'icons',
    label: 'Icons',
    icon: SmileIcon,
    tagline: 'Library & stroke',
    controls: [
      {
        id: 'icon-library',
        label: 'Icon library',
        binding: 'planned',
        Widget: IconLibraryWidget,
      },
      {
        id: 'icon-stroke',
        label: 'Stroke width',
        binding: 'planned',
        Widget: IconStrokeWidget,
      },
    ],
  },
  {
    id: 'shape',
    label: 'Shape',
    icon: ShapesIcon,
    tagline: 'Corners & borders',
    controls: [
      {
        id: 'radius-factor',
        label: 'Radius factor',
        description: 'Scales the whole corner-radius scale at once.',
        binding: 'live',
        Widget: RadiusWidget,
      },
      {
        id: 'border-width',
        label: 'Border width',
        binding: 'planned',
        Widget: BorderWidthWidget,
      },
    ],
  },
  {
    id: 'spacing',
    label: 'Spacing',
    icon: RulerIcon,
    tagline: 'Density & scale',
    controls: [
      {
        id: 'density',
        label: 'Density',
        description: 'Global control heights, gaps and padding.',
        binding: 'live',
        Widget: DensityWidget,
      },
      {
        id: 'spacing-scale',
        label: 'Spacing scale',
        binding: 'planned',
        Widget: SpacingScaleWidget,
      },
    ],
  },
  {
    id: 'depth',
    label: 'Depth',
    icon: LayersIcon,
    tagline: 'Elevation & surfaces',
    controls: [
      {
        id: 'style-family',
        label: 'Style family',
        description: 'The big re-skin: flat, soft, 3D or glass.',
        binding: 'planned',
        Widget: StyleFamilyWidget,
      },
      {
        id: 'shadow-intensity',
        label: 'Shadow intensity',
        binding: 'planned',
        Widget: ShadowIntensityWidget,
      },
      {
        id: 'shadow-tint',
        label: 'Shadow tint',
        binding: 'planned',
        Widget: ShadowTintWidget,
      },
      {
        id: 'backdrop-blur',
        label: 'Backdrop blur',
        description: 'Frost behind overlays and menus.',
        binding: 'planned',
        Widget: BackdropBlurWidget,
      },
      {
        id: 'translucent',
        label: 'Translucent surfaces',
        description: 'Menus and popovers blur what is behind them.',
        binding: 'planned',
        Widget: TranslucentSurfacesWidget,
      },
      {
        id: 'bg-texture',
        label: 'Background texture',
        binding: 'planned',
        block: true,
        Widget: BackgroundTextureWidget,
      },
    ],
  },
  {
    id: 'motion',
    label: 'Motion',
    icon: ZapIcon,
    tagline: 'Timing & feedback',
    controls: [
      {
        id: 'duration',
        label: 'Duration scale',
        description: 'Baseline transition speed.',
        binding: 'planned',
        Widget: DurationWidget,
      },
      {
        id: 'easing',
        label: 'Easing curve',
        binding: 'planned',
        Widget: EasingWidget,
      },
      {
        id: 'hover-effect',
        label: 'Hover effect',
        binding: 'planned',
        Widget: HoverEffectWidget,
      },
      {
        id: 'press-scale',
        label: 'Press feedback',
        description: 'How far controls scale on press.',
        binding: 'planned',
        Widget: PressScaleWidget,
      },
      {
        id: 'animations',
        label: 'Animations',
        description: 'Global on/off for all transitions.',
        binding: 'planned',
        Widget: () => (
          <BoolToken varName="--ds-motion-enabled" fallback="true" />
        ),
      },
    ],
  },
  {
    id: 'interaction',
    label: 'Interaction',
    icon: MousePointer2Icon,
    tagline: 'Cursors & focus',
    controls: [
      {
        id: 'cursor-interactive',
        label: 'Interactive cursor',
        description: 'Pointer on actionable elements.',
        binding: 'live',
        Widget: () => (
          <CursorWidget
            varName={CURSOR_INTERACTIVE_VAR}
            fallback={DEFAULT_CURSOR_INTERACTIVE}
          />
        ),
      },
      {
        id: 'cursor-disabled',
        label: 'Disabled cursor',
        binding: 'live',
        Widget: () => (
          <CursorWidget
            varName={CURSOR_DISABLED_VAR}
            fallback={DEFAULT_CURSOR_DISABLED}
          />
        ),
      },
      {
        id: 'focus-ring',
        label: 'Focus ring width',
        description: 'Keyboard focus outline thickness.',
        binding: 'planned',
        Widget: FocusRingWidthWidget,
      },
    ],
  },
  {
    id: 'a11y',
    label: 'Accessibility',
    icon: AccessibilityIcon,
    tagline: 'Targets & safety',
    controls: [
      {
        id: 'contrast-target',
        label: 'Contrast target',
        description: 'Minimum WCAG ratio ramps must clear.',
        binding: 'planned',
        Widget: ContrastTargetWidget,
      },
      {
        id: 'colorblind-safe',
        label: 'Color-blind safe',
        description: 'Bias status hues for deuteranopia.',
        binding: 'planned',
        Widget: ColorblindSafeWidget,
      },
      {
        id: 'tap-target',
        label: 'Min tap target',
        binding: 'planned',
        Widget: TapTargetWidget,
      },
      {
        id: 'reduced-motion',
        label: 'Respect reduced-motion',
        binding: 'planned',
        Widget: () => (
          <BoolToken varName="--ds-reduced-motion" fallback="true" />
        ),
      },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    icon: BoxSelectIcon,
    tagline: 'Per-component anatomy',
    controls: [
      {
        id: 'button',
        label: 'Button',
        binding: 'live',
        block: true,
        Widget: () => <ComponentAnatomy name="button" />,
      },
      {
        id: 'input',
        label: 'Input',
        binding: 'live',
        block: true,
        Widget: () => <ComponentAnatomy name="input" />,
      },
      {
        id: 'card',
        label: 'Card',
        binding: 'live',
        block: true,
        Widget: () => <ComponentAnatomy name="card" />,
      },
    ],
  },
  {
    id: 'brand',
    label: 'Brand',
    icon: ImageIcon,
    tagline: 'Logo & defaults',
    controls: [
      {
        id: 'brand-logo',
        label: 'Brand logo',
        binding: 'planned',
        block: true,
        Widget: BrandLogoWidget,
      },
      {
        id: 'default-mode',
        label: 'Default mode',
        description: 'Which mode the exported system boots in.',
        binding: 'planned',
        Widget: DefaultModeWidget,
      },
    ],
  },
]
