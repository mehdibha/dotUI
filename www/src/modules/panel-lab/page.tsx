'use client'

/* Panel Lab — the entire /create control panel, recreated in the control-lab
   row language as one coherent surface. Derived from the real builder schema
   (panel/schema.tsx + registry params), reorganized for UX: disclosure rows
   with live summaries instead of clutter, a visual shadow family instead of
   raw text fields, searchable category clusters instead of a flat A–Z
   component list. Design only: local state, nothing wired into /create. */

import { useState } from 'react'
import {
  BellIcon,
  CalendarIcon,
  CameraIcon,
  CloudIcon,
  FolderIcon,
  HeartIcon,
  HomeIcon,
  LoaderCircleIcon,
  LoaderIcon,
  LockIcon,
  MailIcon,
  Redo2Icon,
  SearchIcon,
  SettingsIcon,
  ShuffleIcon,
  StarIcon,
  Undo2Icon,
  UserIcon,
} from 'lucide-react'
import { DisclosureGroup } from 'react-aria-components'

import { DEFAULT_BODY_FAMILY, DEFAULT_MONO_FAMILY } from '@/lib/fonts'
import { Button } from '@/registry/ui/button'
import {
  ColorPickerRow,
  ComponentRow,
  ControlGroup,
  FontPickerRow,
  GroupCaption,
  MiniSegmented,
  ParamRow,
  SectionHeader,
  SegmentedRow,
  SelectRow,
  SliderRow,
  StyleGridRow,
} from '@/modules/control-lab/rows'
import type {
  SegmentedRowOption,
  StyleGridOption,
} from '@/modules/control-lab/rows'

import {
  ClusterHeader,
  DetailRow,
  FilterRow,
  MiniColorRow,
  RampStrip,
  SwatchDots,
  TypeSpecimen,
} from './patterns'

/* --------------------------------- Options -------------------------------- */

const GRAY_TINT_OPTIONS = [
  { value: 'pure', label: 'Pure' },
  { value: 'tinted', label: 'Tinted' },
]

const PRIMARY_OPTIONS = [
  { value: 'neutral', label: 'Neutral' },
  { value: 'accent', label: 'Accent' },
]

const CONTRAST_OPTIONS: SegmentedRowOption[] = [
  { value: 'low', label: 'Low' },
  { value: 'default', label: 'Default' },
  { value: 'high', label: 'High' },
]

const CHROMA_OPTIONS: SegmentedRowOption[] = [
  { value: 'muted', label: 'Muted' },
  { value: 'default', label: 'Default' },
  { value: 'vivid', label: 'Vivid' },
]

const ICON_LIBRARY_OPTIONS = [
  { value: 'lucide', label: 'Lucide' },
  { value: 'phosphor', label: 'Phosphor' },
  { value: 'tabler', label: 'Tabler' },
  { value: 'remix', label: 'Remix' },
]

const ICON_WEIGHT_OPTIONS = [
  { value: 'thin', label: 'Thin' },
  { value: 'light', label: 'Light' },
  { value: 'regular', label: 'Regular' },
  { value: 'bold', label: 'Bold' },
  { value: 'fill', label: 'Fill' },
  { value: 'duotone', label: 'Duotone' },
]

const DENSITY_OPTIONS = [
  { value: 'compact', label: 'Compact' },
  { value: 'default', label: 'Default' },
  { value: 'comfortable', label: 'Cozy' },
]

const CURSOR_OPTIONS = [
  'default',
  'pointer',
  'not-allowed',
  'wait',
  'progress',
  'text',
  'grab',
].map((c) => ({ value: c, label: c }))

/* Shadow family presets — one decision that sets the overlay, card and control
   shadows together, previewed as actual shadowed tiles. */
function ShadowTile({ boxShadow }: { boxShadow?: string }) {
  return (
    <span
      className="h-9 w-14 rounded-md bg-highlight"
      style={boxShadow ? { boxShadow } : undefined}
    />
  )
}

const SHADOW_OPTIONS: StyleGridOption[] = [
  { id: 'none', label: 'None', preview: <ShadowTile /> },
  {
    id: 'crisp',
    label: 'Crisp',
    preview: <ShadowTile boxShadow="0 1px 2px rgb(0 0 0 / 0.5)" />,
  },
  {
    id: 'soft',
    label: 'Soft',
    preview: <ShadowTile boxShadow="0 6px 16px -4px rgb(0 0 0 / 0.5)" />,
  },
  {
    id: 'floating',
    label: 'Floating',
    preview: <ShadowTile boxShadow="0 14px 32px -6px rgb(0 0 0 / 0.65)" />,
  },
]

/* Mini specimens for the component style grids. */
function MiniButton({ className }: { className: string }) {
  return (
    <span
      className={`flex h-7 items-center rounded-full px-3.5 text-xs font-medium ${className}`}
    >
      Button
    </span>
  )
}

function MiniInput({ className }: { className: string }) {
  return (
    <span
      className={`flex h-7 w-24 items-center px-2.5 text-xs text-fg-muted ${className}`}
    >
      Value
    </span>
  )
}

const BUTTON_STYLES: StyleGridOption[] = [
  {
    id: 'solid',
    label: 'Solid',
    preview: <MiniButton className="bg-primary text-fg-on-primary" />,
  },
  {
    id: 'soft',
    label: 'Soft',
    preview: <MiniButton className="bg-neutral text-fg-on-neutral" />,
  },
  {
    id: 'outline',
    label: 'Outline',
    preview: <MiniButton className="border border-border-field text-fg" />,
  },
  { id: 'quiet', label: 'Quiet', preview: <MiniButton className="text-fg" /> },
]

/* Real enum: outline | line | filled-line-bottom | filled (input/meta.ts). */
const INPUT_STYLES: StyleGridOption[] = [
  {
    id: 'outline',
    label: 'Outline',
    preview: <MiniInput className="rounded-lg border border-border-field" />,
  },
  {
    id: 'line',
    label: 'Line',
    preview: <MiniInput className="border-b border-border-field" />,
  },
  {
    id: 'filled-line-bottom',
    label: 'Filled line',
    preview: (
      <MiniInput className="rounded-t-lg border-b border-border-field bg-neutral" />
    ),
  },
  {
    id: 'filled',
    label: 'Filled',
    preview: <MiniInput className="rounded-lg bg-neutral" />,
  },
]

/* Real enum: default | tasnim (card/meta.ts). */
const CARD_STYLES: StyleGridOption[] = [
  {
    id: 'default',
    label: 'Default',
    preview: <span className="h-9 w-16 rounded-md border border-border" />,
  },
  {
    id: 'tasnim',
    label: 'Tasnim',
    preview: (
      <span className="h-9 w-16 rounded-md bg-muted shadow-[0_6px_16px_rgb(0_0_0/0.45)]" />
    ),
  },
]

/* Real enum: spinner | ring (loader/meta.ts). */
const LOADER_STYLES: StyleGridOption[] = [
  {
    id: 'spinner',
    label: 'Spinner',
    preview: <LoaderIcon className="size-5 text-fg-muted" />,
  },
  {
    id: 'ring',
    label: 'Ring',
    preview: <LoaderCircleIcon className="size-5 text-fg-muted" />,
  },
]

const RADIUS_PARAM_OPTIONS: SegmentedRowOption[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'sharp', label: 'Sharp' },
  { value: 'round', label: 'Round' },
  { value: 'pill', label: 'Pill' },
]

const HOVER_PARAM_OPTIONS: SegmentedRowOption[] = [
  { value: 'none', label: 'None' },
  { value: 'dim', label: 'Dim' },
  { value: 'lift', label: 'Lift' },
]

const TOKEN_RADIUS_OPTIONS: SegmentedRowOption[] = [
  { value: 'sharp', label: 'Sharp' },
  { value: 'sm', label: 'Sm' },
  { value: 'md', label: 'Md' },
  { value: 'lg', label: 'Lg' },
]

const BLUR_OPTIONS: SegmentedRowOption[] = [
  { value: 'none', label: 'None' },
  { value: 'sm', label: 'Sm' },
  { value: 'md', label: 'Md' },
]

const BACKDROP_OPTIONS: SegmentedRowOption[] = [
  { value: '20', label: '20%' },
  { value: '40', label: '40%' },
  { value: '60', label: '60%' },
]

const ACCENT_POOL = [
  '#635BFF',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#F97316',
  '#10B981',
]

function labelOf(
  options: { value: string; label: React.ReactNode }[],
  value: string,
): React.ReactNode {
  return options.find((o) => o.value === value)?.label ?? value
}

/* ---------------------------------- State ---------------------------------- */

const DEFAULTS = {
  // Color — seeds, strategy, semantics, engine knobs (panel/schema.tsx)
  brand: '#635BFF',
  gray: '#8B8D98',
  grayTint: 'tinted',
  primary: 'neutral',
  success: '#1A9338',
  warning: '#E79D13',
  danger: '#DC3E42',
  info: '#0072F5',
  selection: '#0072F5',
  contrast: 'default',
  chroma: 'default',
  // Typography
  headingFont: DEFAULT_BODY_FAMILY,
  bodyFont: DEFAULT_BODY_FAMILY,
  monoFont: DEFAULT_MONO_FAMILY,
  // Icons
  iconLibrary: 'lucide',
  iconStroke: 2,
  iconWeight: 'regular',
  // Shape
  radius: 1,
  density: 'default',
  // Effects
  shadows: 'soft',
  cursorInteractive: 'default',
  cursorDisabled: 'not-allowed',
  // Components (real registry params where they exist)
  buttonStyle: 'solid',
  buttonRadius: 'auto',
  buttonHover: 'dim',
  inputStyle: 'outline',
  checkboxRadius: 'sm',
  cardStyle: 'default',
  badgeRadius: 'md',
  modalStyle: 'default',
  modalBlur: 'sm',
  modalBackdrop: '40',
  modalRadius: 'lg',
  tooltipSurface: 'default',
  tooltipRadius: 'sm',
  menuHighlight: 'subtle',
  loaderStyle: 'spinner',
}

type LabState = typeof DEFAULTS

interface Lab {
  state: LabState
  set: <K extends keyof LabState>(key: K) => (value: LabState[K]) => void
  section: (keys: (keyof LabState)[]) => {
    modified: boolean
    onReset: () => void
  }
}

const COLOR_KEYS: (keyof LabState)[] = [
  'brand',
  'gray',
  'grayTint',
  'primary',
  'success',
  'warning',
  'danger',
  'info',
  'selection',
  'contrast',
  'chroma',
]
const TYPE_KEYS: (keyof LabState)[] = ['headingFont', 'bodyFont', 'monoFont']
const ICON_KEYS: (keyof LabState)[] = [
  'iconLibrary',
  'iconStroke',
  'iconWeight',
]
const SHAPE_KEYS: (keyof LabState)[] = ['radius', 'density']
const EFFECT_KEYS: (keyof LabState)[] = [
  'shadows',
  'cursorInteractive',
  'cursorDisabled',
]
const COMPONENT_KEYS: (keyof LabState)[] = [
  'buttonStyle',
  'buttonRadius',
  'buttonHover',
  'inputStyle',
  'checkboxRadius',
  'cardStyle',
  'badgeRadius',
  'modalStyle',
  'modalBlur',
  'modalBackdrop',
  'modalRadius',
  'tooltipSurface',
  'tooltipRadius',
  'menuHighlight',
  'loaderStyle',
]

/* --------------------------------- Sections -------------------------------- */

function ColorSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  const semanticModified = (
    ['success', 'warning', 'danger', 'info', 'selection'] as const
  ).some((k) => state[k] !== DEFAULTS[k])
  const engineModified =
    state.contrast !== DEFAULTS.contrast || state.chroma !== DEFAULTS.chroma
  return (
    <>
      <SectionHeader label="Color" {...lab.section(COLOR_KEYS)} />
      <RampStrip seeds={[state.brand, state.gray]} />
      <ControlGroup>
        <ColorPickerRow
          label="Brand"
          value={state.brand}
          onChange={set('brand')}
        />
        <ColorPickerRow
          label="Gray"
          value={state.gray}
          onChange={set('gray')}
        />
        <SegmentedRow
          label="Gray tint"
          value={state.grayTint}
          onChange={set('grayTint')}
          options={GRAY_TINT_OPTIONS}
        />
        <SegmentedRow
          label="Primary"
          value={state.primary}
          onChange={set('primary')}
          options={PRIMARY_OPTIONS}
        />
      </ControlGroup>
      <GroupCaption>
        Two seeds generate every ramp. Primary picks which one solid buttons
        wear.
      </GroupCaption>
      <DetailRow
        label="Semantic colors"
        summary={
          <SwatchDots
            colors={[state.success, state.warning, state.danger, state.info]}
          />
        }
      >
        <MiniColorRow
          label="Success"
          value={state.success}
          onChange={set('success')}
        />
        <MiniColorRow
          label="Warning"
          value={state.warning}
          onChange={set('warning')}
        />
        <MiniColorRow
          label="Danger"
          value={state.danger}
          onChange={set('danger')}
        />
        <MiniColorRow label="Info" value={state.info} onChange={set('info')} />
        <MiniColorRow
          label="Selection"
          value={state.selection}
          onChange={set('selection')}
        />
      </DetailRow>
      <DetailRow
        label="Fine-tune"
        summary={engineModified || semanticModified ? 'Custom' : 'Default'}
      >
        <ParamRow label="Contrast">
          <MiniSegmented
            ariaLabel="Contrast"
            value={state.contrast}
            onChange={set('contrast')}
            options={CONTRAST_OPTIONS}
          />
        </ParamRow>
        <ParamRow label="Chroma">
          <MiniSegmented
            ariaLabel="Chroma"
            value={state.chroma}
            onChange={set('chroma')}
            options={CHROMA_OPTIONS}
          />
        </ParamRow>
        <div className="px-2 pt-1.5 pb-2">
          <RampStrip
            seeds={[
              state.brand,
              state.gray,
              state.success,
              state.warning,
              state.danger,
              state.info,
            ]}
          />
        </div>
      </DetailRow>
    </>
  )
}

function TypographySection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <SectionHeader label="Typography" {...lab.section(TYPE_KEYS)} />
      <TypeSpecimen heading={state.headingFont} body={state.bodyFont} />
      <ControlGroup>
        <FontPickerRow
          label="Heading"
          categories={['sans-serif', 'serif', 'display', 'handwriting']}
          selectedKey={state.headingFont}
          onChange={set('headingFont')}
        />
        <FontPickerRow
          label="Body"
          categories={['sans-serif', 'serif']}
          selectedKey={state.bodyFont}
          onChange={set('bodyFont')}
        />
        <FontPickerRow
          label="Mono"
          categories={['mono']}
          selectedKey={state.monoFont}
          onChange={set('monoFont')}
        />
      </ControlGroup>
    </>
  )
}

const STRIP_ICONS = [
  HomeIcon,
  SearchIcon,
  HeartIcon,
  StarIcon,
  BellIcon,
  MailIcon,
  CalendarIcon,
  SettingsIcon,
  UserIcon,
  FolderIcon,
  CameraIcon,
  CloudIcon,
  LockIcon,
]

/** Live strip of the icon set at the chosen stroke — the section's specimen. */
function IconStrip({ stroke }: { stroke: number }) {
  return (
    <div
      data-row=""
      className="flex h-11 w-full items-center gap-3 overflow-hidden rounded-xl bg-muted [mask-image:linear-gradient(to_right,black_75%,transparent)] px-4 text-fg-muted"
    >
      {STRIP_ICONS.map((Icon, i) => (
        <Icon key={i} className="size-4 shrink-0" strokeWidth={stroke} />
      ))}
    </div>
  )
}

function IconsSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <SectionHeader label="Icons" {...lab.section(ICON_KEYS)} />
      <ControlGroup>
        <IconStrip stroke={state.iconStroke} />
        <SelectRow
          label="Library"
          value={state.iconLibrary}
          onChange={set('iconLibrary')}
          options={ICON_LIBRARY_OPTIONS}
        />
        <SliderRow
          label="Stroke"
          value={state.iconStroke}
          onChange={set('iconStroke')}
          minValue={1}
          maxValue={3}
          step={0.25}
          format={(v) => v.toFixed(2)}
        />
        {state.iconLibrary === 'phosphor' && (
          <SelectRow
            label="Weight"
            value={state.iconWeight}
            onChange={set('iconWeight')}
            options={ICON_WEIGHT_OPTIONS}
          />
        )}
      </ControlGroup>
    </>
  )
}

function ShapeSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <SectionHeader label="Shape" {...lab.section(SHAPE_KEYS)} />
      <div className="flex flex-col gap-1.5">
        {/* Self-demo: the row's own corners round with the value. */}
        <SliderRow
          label="Radius"
          value={state.radius}
          onChange={set('radius')}
          minValue={0}
          maxValue={2}
          step={0.05}
          format={(v) => `${v.toFixed(2)}×`}
          trackStyle={{ borderRadius: `${4 + state.radius * 10}px` }}
        />
        <SegmentedRow
          label="Density"
          value={state.density}
          onChange={set('density')}
          options={DENSITY_OPTIONS}
        />
      </div>
    </>
  )
}

function EffectsSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <SectionHeader label="Effects" {...lab.section(EFFECT_KEYS)} />
      <StyleGridRow
        label="Shadows"
        value={state.shadows}
        onChange={set('shadows')}
        options={SHADOW_OPTIONS}
        columns={4}
      />
      <GroupCaption>
        One family sets the card, control and overlay shadows together.
      </GroupCaption>
      <ControlGroup>
        <SelectRow
          label="Cursor"
          value={state.cursorInteractive}
          onChange={set('cursorInteractive')}
          options={CURSOR_OPTIONS}
        />
        <SelectRow
          label="Disabled cursor"
          value={state.cursorDisabled}
          onChange={set('cursorDisabled')}
          options={CURSOR_OPTIONS}
        />
      </ControlGroup>
    </>
  )
}

/* ------------------------------- Components -------------------------------- */

interface ComponentEntry {
  name: string
  render: (lab: Lab) => React.ReactNode
}

interface Cluster {
  label: string
  caption?: string
  items: ComponentEntry[]
}

const CLUSTERS: Cluster[] = [
  {
    label: 'Buttons',
    caption: 'Styles apply to the synced group — Toggle Button follows Button.',
    items: [
      {
        name: 'Button',
        render: (lab) => (
          <ComponentRow
            name="Button"
            value={lab.state.buttonStyle}
            onChange={lab.set('buttonStyle')}
            options={BUTTON_STYLES}
          >
            <ParamRow label="Radius">
              <MiniSegmented
                ariaLabel="Button radius"
                value={lab.state.buttonRadius}
                onChange={lab.set('buttonRadius')}
                options={RADIUS_PARAM_OPTIONS}
              />
            </ParamRow>
            <ParamRow label="Hover">
              <MiniSegmented
                ariaLabel="Button hover effect"
                value={lab.state.buttonHover}
                onChange={lab.set('buttonHover')}
                options={HOVER_PARAM_OPTIONS}
              />
            </ParamRow>
          </ComponentRow>
        ),
      },
    ],
  },
  {
    label: 'Forms',
    items: [
      {
        name: 'Input',
        render: (lab) => (
          <ComponentRow
            name="Input"
            value={lab.state.inputStyle}
            onChange={lab.set('inputStyle')}
            options={INPUT_STYLES}
          />
        ),
      },
      {
        name: 'Checkbox',
        render: (lab) => (
          <DetailRow
            id="Checkbox"
            label="Checkbox"
            summary={labelOf(TOKEN_RADIUS_OPTIONS, lab.state.checkboxRadius)}
          >
            <ParamRow label="Radius">
              <MiniSegmented
                ariaLabel="Checkbox radius"
                value={lab.state.checkboxRadius}
                onChange={lab.set('checkboxRadius')}
                options={TOKEN_RADIUS_OPTIONS}
              />
            </ParamRow>
          </DetailRow>
        ),
      },
    ],
  },
  {
    label: 'Surfaces',
    items: [
      {
        name: 'Card',
        render: (lab) => (
          <ComponentRow
            name="Card"
            value={lab.state.cardStyle}
            onChange={lab.set('cardStyle')}
            options={CARD_STYLES}
          />
        ),
      },
      {
        name: 'Badge',
        render: (lab) => (
          <DetailRow
            id="Badge"
            label="Badge"
            summary={labelOf(TOKEN_RADIUS_OPTIONS, lab.state.badgeRadius)}
          >
            <ParamRow label="Radius">
              <MiniSegmented
                ariaLabel="Badge radius"
                value={lab.state.badgeRadius}
                onChange={lab.set('badgeRadius')}
                options={TOKEN_RADIUS_OPTIONS}
              />
            </ParamRow>
          </DetailRow>
        ),
      },
    ],
  },
  {
    label: 'Overlays',
    items: [
      {
        name: 'Modal',
        render: (lab) => (
          <DetailRow
            id="Modal"
            label="Modal"
            summary={lab.state.modalStyle === 'default' ? 'Default' : 'Muted'}
          >
            <ParamRow label="Style">
              <MiniSegmented
                ariaLabel="Modal style"
                value={lab.state.modalStyle}
                onChange={lab.set('modalStyle')}
                options={[
                  { value: 'default', label: 'Default' },
                  { value: 'muted-footer', label: 'Muted footer' },
                ]}
              />
            </ParamRow>
            <ParamRow label="Backdrop blur">
              <MiniSegmented
                ariaLabel="Modal backdrop blur"
                value={lab.state.modalBlur}
                onChange={lab.set('modalBlur')}
                options={BLUR_OPTIONS}
              />
            </ParamRow>
            <ParamRow label="Backdrop opacity">
              <MiniSegmented
                ariaLabel="Modal backdrop opacity"
                value={lab.state.modalBackdrop}
                onChange={lab.set('modalBackdrop')}
                options={BACKDROP_OPTIONS}
              />
            </ParamRow>
            <ParamRow label="Radius">
              <MiniSegmented
                ariaLabel="Modal radius"
                value={lab.state.modalRadius}
                onChange={lab.set('modalRadius')}
                options={TOKEN_RADIUS_OPTIONS}
              />
            </ParamRow>
          </DetailRow>
        ),
      },
      {
        name: 'Tooltip',
        render: (lab) => (
          <DetailRow
            id="Tooltip"
            label="Tooltip"
            summary={
              lab.state.tooltipSurface === 'default' ? 'Default' : 'Translucid'
            }
          >
            <ParamRow label="Surface">
              <MiniSegmented
                ariaLabel="Tooltip surface"
                value={lab.state.tooltipSurface}
                onChange={lab.set('tooltipSurface')}
                options={[
                  { value: 'default', label: 'Default' },
                  { value: 'translucid', label: 'Translucid' },
                ]}
              />
            </ParamRow>
            <ParamRow label="Radius">
              <MiniSegmented
                ariaLabel="Tooltip radius"
                value={lab.state.tooltipRadius}
                onChange={lab.set('tooltipRadius')}
                options={TOKEN_RADIUS_OPTIONS}
              />
            </ParamRow>
          </DetailRow>
        ),
      },
    ],
  },
  {
    label: 'Menus & lists',
    items: [
      {
        name: 'Menu',
        render: (lab) => (
          <DetailRow
            id="Menu"
            label="Menu"
            summary={lab.state.menuHighlight === 'subtle' ? 'Subtle' : 'Accent'}
          >
            <ParamRow label="Highlight">
              <MiniSegmented
                ariaLabel="Menu highlight"
                value={lab.state.menuHighlight}
                onChange={lab.set('menuHighlight')}
                options={[
                  { value: 'subtle', label: 'Subtle' },
                  { value: 'accent', label: 'Accent' },
                ]}
              />
            </ParamRow>
          </DetailRow>
        ),
      },
    ],
  },
  {
    label: 'Feedback',
    items: [
      {
        name: 'Loader',
        render: (lab) => (
          <ComponentRow
            name="Loader"
            value={lab.state.loaderStyle}
            onChange={lab.set('loaderStyle')}
            options={LOADER_STYLES}
          />
        ),
      },
    ],
  },
]

function ComponentsSection({ lab }: { lab: Lab }) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const clusters = CLUSTERS.map((cluster) => ({
    ...cluster,
    items: cluster.items.filter((item) => item.name.toLowerCase().includes(q)),
  })).filter((cluster) => cluster.items.length > 0)

  return (
    <>
      <SectionHeader label="Components" {...lab.section(COMPONENT_KEYS)} />
      <FilterRow
        value={query}
        onChange={setQuery}
        placeholder="Filter components..."
      />
      <DisclosureGroup className="flex flex-col gap-1.5">
        {clusters.map((cluster) => (
          <div key={cluster.label} className="flex flex-col gap-1.5">
            <ClusterHeader label={cluster.label} />
            {cluster.items.map((item) => (
              <div key={item.name}>{item.render(lab)}</div>
            ))}
            {cluster.caption && <GroupCaption>{cluster.caption}</GroupCaption>}
          </div>
        ))}
        {clusters.length === 0 && (
          <p className="px-4 py-6 text-center text-xs text-fg-muted">
            No components match “{query}”.
          </p>
        )}
      </DisclosureGroup>
      <GroupCaption>
        A representative slice — the real panel lists every component with
        styles, in these clusters.
      </GroupCaption>
    </>
  )
}

/* ---------------------------------- Panel ----------------------------------- */

function Panel({
  lab,
  onShuffle,
  anyModified,
}: {
  lab: Lab
  onShuffle: () => void
  anyModified: boolean
}) {
  return (
    <div className="flex h-[min(780px,calc(100svh-160px))] w-[360px] shrink-0 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card">
      <header className="flex h-11 shrink-0 items-center justify-between border-b border-border/40 pr-1.5 pl-4">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-[0.8125rem] font-semibold text-fg">
            Acme design system
          </span>
          {anyModified && (
            <span
              aria-label="Unsaved changes"
              className="size-1.5 shrink-0 rounded-full bg-fg-muted"
            />
          )}
        </span>
        <span className="flex shrink-0 items-center">
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            aria-label="Shuffle"
            onPress={onShuffle}
          >
            <ShuffleIcon />
          </Button>
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            isDisabled
            aria-label="Undo"
          >
            <Undo2Icon />
          </Button>
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            isDisabled
            aria-label="Redo"
          >
            <Redo2Icon />
          </Button>
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            aria-label="Search controls"
          >
            <SearchIcon />
          </Button>
        </span>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto p-3 *:shrink-0">
        <ColorSection lab={lab} />
        <TypographySection lab={lab} />
        <IconsSection lab={lab} />
        <ShapeSection lab={lab} />
        <EffectsSection lab={lab} />
        <ComponentsSection lab={lab} />
      </div>

      <footer className="flex shrink-0 gap-2 border-t border-border/40 p-3">
        <Button size="sm" className="flex-1">
          Save
        </Button>
        <Button variant="primary" size="sm" className="flex-1">
          Export
        </Button>
      </footer>
    </div>
  )
}

/* ---------------------------------- Page ----------------------------------- */

const DESIGN_NOTES = [
  'Semantic colors and engine fine-tune fold into disclosure rows with live summaries — the section reads at a glance, edits on demand.',
  'Shadows are one visual family decision, previewed as shadowed tiles — not three raw box-shadow text fields.',
  'Components are searchable category clusters with a single-expand accordion, not a flat A–Z list of 24.',
  'Params-only components (Checkbox, Modal, Menu…) share the same DetailRow pattern as the color disclosures.',
  'Every section header tracks drift from the defaults and offers reset; the panel header carries the dirty dot.',
  'Specimens everywhere: ramps react to seeds, the type row is set in its own face, the radius slider rounds itself.',
]

export function PanelLab() {
  const [state, setState] = useState<LabState>(DEFAULTS)

  const set =
    <K extends keyof LabState>(key: K) =>
    (value: LabState[K]) =>
      setState((prev) => ({ ...prev, [key]: value }))

  const section = (keys: (keyof LabState)[]) => ({
    modified: keys.some((key) => state[key] !== DEFAULTS[key]),
    onReset: () =>
      setState((prev) => ({
        ...prev,
        ...(Object.fromEntries(
          keys.map((key) => [key, DEFAULTS[key]]),
        ) as Partial<LabState>),
      })),
  })

  const lab: Lab = { state, set, section }

  const anyModified = (Object.keys(DEFAULTS) as (keyof LabState)[]).some(
    (key) => state[key] !== DEFAULTS[key],
  )

  const shuffle = () =>
    setState((prev) => ({
      ...prev,
      brand:
        ACCENT_POOL[Math.floor(Math.random() * ACCENT_POOL.length)] ??
        prev.brand,
      buttonStyle:
        BUTTON_STYLES[Math.floor(Math.random() * BUTTON_STYLES.length)]?.id ??
        prev.buttonStyle,
    }))

  return (
    <div className="flex min-h-svh flex-col gap-8 px-8 py-12">
      <div className="flex max-w-lg flex-col gap-1.5">
        <h1 className="text-lg font-semibold text-fg">Panel Lab</h1>
        <p className="text-sm text-fg-muted">
          The entire /create control panel, recreated in the control-lab row
          language. Same schema as the real builder — reorganized for UX.
        </p>
      </div>

      <div className="flex items-start gap-10">
        <Panel lab={lab} onShuffle={shuffle} anyModified={anyModified} />
        <div className="flex w-72 shrink-0 flex-col gap-3 pt-1">
          <span className="text-[11px] font-medium tracking-wider text-fg-muted uppercase">
            Design notes
          </span>
          <ul className="flex flex-col gap-2.5">
            {DESIGN_NOTES.map((note, i) => (
              <li key={i} className="text-xs/relaxed text-pretty text-fg-muted">
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
