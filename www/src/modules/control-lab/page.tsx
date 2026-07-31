'use client'

/* Control Lab — a canvas of panel explorations (Figma-style frames), all
   driven by ONE shared state so the same design system renders through two
   different chromes: grouped list, card shell. Local state only, nothing
   wired into the real /create panel (see roadmap: builder prototypes stay
   scratch until a direction is picked). */

import { useState } from 'react'
import {
  FeatherIcon,
  HexagonIcon,
  MonitorIcon,
  MoonIcon,
  SearchIcon,
  ShapesIcon,
  ShuffleIcon,
  SunIcon,
} from 'lucide-react'
import { DisclosureGroup } from 'react-aria-components'

import { DEFAULT_BODY_FAMILY } from '@/lib/fonts'
import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'

import {
  ActionRow,
  ColorPickerRow,
  ComponentRow,
  ControlGroup,
  FontPickerRow,
  GroupCaption,
  MiniSegmented,
  MiniSwitch,
  ParamRow,
  SectionHeader,
  SegmentedRow,
  SelectRow,
  SliderRow,
  StepperRow,
  SwitchRow,
} from './rows'
import type { StyleGridOption } from './rows'

/* --------------------------------- Options -------------------------------- */

const THEME_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'vibrant', label: 'Vibrant' },
]

const SCHEME_OPTIONS = [
  { value: 'light', label: <SunIcon />, ariaLabel: 'Light' },
  { value: 'dark', label: <MoonIcon />, ariaLabel: 'Dark' },
  { value: 'auto', label: <MonitorIcon />, ariaLabel: 'System' },
]

const ICON_LIBRARY_OPTIONS = [
  { value: 'lucide', label: 'Lucide', icon: <FeatherIcon /> },
  { value: 'phosphor', label: 'Phosphor', icon: <ShapesIcon /> },
  { value: 'hugeicons', label: 'Hugeicons', icon: <HexagonIcon /> },
]

const DENSITY_OPTIONS = [
  { value: 'compact', label: 'Compact' },
  { value: 'default', label: 'Default' },
  { value: 'comfortable', label: 'Cozy' },
]

/* Mini specimens: hardcoded looks are fine here — the card demos a named
   style, it doesn't ship anywhere. */
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

function MiniCard({ className }: { className: string }) {
  return <span className={`h-9 w-16 rounded-md ${className}`} />
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
  {
    id: 'quiet',
    label: 'Quiet',
    preview: <MiniButton className="text-fg" />,
  },
]

const INPUT_STYLES: StyleGridOption[] = [
  {
    id: 'outline',
    label: 'Outline',
    preview: <MiniInput className="rounded-lg border border-border-field" />,
  },
  {
    id: 'filled',
    label: 'Filled',
    preview: <MiniInput className="rounded-lg bg-neutral" />,
  },
  {
    id: 'underline',
    label: 'Underline',
    preview: <MiniInput className="border-b border-border-field" />,
  },
]

const CARD_STYLES: StyleGridOption[] = [
  { id: 'flat', label: 'Flat', preview: <MiniCard className="bg-muted" /> },
  {
    id: 'outline',
    label: 'Outline',
    preview: <MiniCard className="border border-border" />,
  },
  {
    id: 'elevated',
    label: 'Elevated',
    preview: (
      <MiniCard className="bg-muted shadow-[0_6px_16px_rgb(0_0_0/0.45)]" />
    ),
  },
]

const RADIUS_PARAM_OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: 'sharp', label: 'Sharp' },
  { value: 'round', label: 'Round' },
  { value: 'pill', label: 'Pill' },
]

const HOVER_PARAM_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'dim', label: 'Dim' },
  { value: 'lift', label: 'Lift' },
]

const ACCENT_POOL = ['#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#10B981']

/* ---------------------------------- State ---------------------------------- */

const DEFAULTS = {
  theme: 'default',
  accent: '#3B82F6',
  scheme: 'auto',
  font: DEFAULT_BODY_FAMILY,
  baseSize: 16,
  icons: 'lucide',
  spacing: 0.5,
  radius: 0.65,
  density: 'default',
  animations: true,
  buttonStyle: 'solid',
  buttonRadius: 'auto',
  buttonHover: 'dim',
  buttonShadow: false,
  inputStyle: 'outline',
  inputRadius: 'auto',
  inputFocusRing: true,
  cardStyle: 'outline',
  cardRadius: 'auto',
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

const COMPONENT_KEYS: (keyof LabState)[] = [
  'buttonStyle',
  'buttonRadius',
  'buttonHover',
  'buttonShadow',
  'inputStyle',
  'inputRadius',
  'inputFocusRing',
  'cardStyle',
  'cardRadius',
]

/* ------------------------- Groups (rows, no headers) ----------------------- */

function PresetGroup({ lab }: { lab: Lab }) {
  return (
    <ControlGroup>
      <SelectRow
        label="Theme"
        value={lab.state.theme}
        onChange={lab.set('theme')}
        options={THEME_OPTIONS}
      />
    </ControlGroup>
  )
}

function ColorsGroup({ lab, caption }: { lab: Lab; caption?: boolean }) {
  return (
    <>
      <ControlGroup>
        <ColorPickerRow
          label="Accent"
          value={lab.state.accent}
          onChange={lab.set('accent')}
        />
        <SegmentedRow
          label="Scheme"
          value={lab.state.scheme}
          onChange={lab.set('scheme')}
          options={SCHEME_OPTIONS}
        />
      </ControlGroup>
      {caption && (
        <GroupCaption>
          Grays are tinted toward your accent. Pure gray and per-palette seeds
          live in fine-tune.
        </GroupCaption>
      )}
    </>
  )
}

function TypographyGroup({ lab }: { lab: Lab }) {
  return (
    <ControlGroup>
      <FontPickerRow
        label="Font"
        categories={['sans-serif', 'serif', 'display', 'mono']}
        selectedKey={lab.state.font}
        onChange={lab.set('font')}
      />
      <StepperRow
        label="Base size"
        value={lab.state.baseSize}
        onChange={lab.set('baseSize')}
        minValue={12}
        maxValue={20}
        unit="px"
      />
    </ControlGroup>
  )
}

function IconsGroup({ lab }: { lab: Lab }) {
  return (
    <ControlGroup>
      <SelectRow
        label="Library"
        value={lab.state.icons}
        onChange={lab.set('icons')}
        options={ICON_LIBRARY_OPTIONS}
      />
    </ControlGroup>
  )
}

function LayoutRows({ lab }: { lab: Lab }) {
  return (
    <div className="flex flex-col gap-1.5">
      <SliderRow
        label="Spacing"
        value={lab.state.spacing}
        onChange={lab.set('spacing')}
      />
      {/* Self-demo: the row's own corners round with the value. */}
      <SliderRow
        label="Radius"
        value={lab.state.radius}
        onChange={lab.set('radius')}
        trackStyle={{ borderRadius: `${4 + lab.state.radius * 18}px` }}
      />
      <SegmentedRow
        label="Density"
        value={lab.state.density}
        onChange={lab.set('density')}
        options={DENSITY_OPTIONS}
      />
      <SwitchRow
        label="Animations"
        value={lab.state.animations}
        onChange={lab.set('animations')}
      />
    </div>
  )
}

function ComponentsGroup({ lab, caption }: { lab: Lab; caption?: boolean }) {
  return (
    <>
      <DisclosureGroup className="flex flex-col gap-1.5">
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
          <ParamRow label="Shadow">
            <MiniSwitch
              ariaLabel="Button shadow"
              value={lab.state.buttonShadow}
              onChange={lab.set('buttonShadow')}
            />
          </ParamRow>
        </ComponentRow>
        <ComponentRow
          name="Input"
          value={lab.state.inputStyle}
          onChange={lab.set('inputStyle')}
          options={INPUT_STYLES}
          columns={3}
        >
          <ParamRow label="Radius">
            <MiniSegmented
              ariaLabel="Input radius"
              value={lab.state.inputRadius}
              onChange={lab.set('inputRadius')}
              options={RADIUS_PARAM_OPTIONS}
            />
          </ParamRow>
          <ParamRow label="Focus ring">
            <MiniSwitch
              ariaLabel="Input focus ring"
              value={lab.state.inputFocusRing}
              onChange={lab.set('inputFocusRing')}
            />
          </ParamRow>
        </ComponentRow>
        <ComponentRow
          name="Card"
          value={lab.state.cardStyle}
          onChange={lab.set('cardStyle')}
          options={CARD_STYLES}
          columns={3}
        >
          <ParamRow label="Radius">
            <MiniSegmented
              ariaLabel="Card radius"
              value={lab.state.cardRadius}
              onChange={lab.set('cardRadius')}
              options={RADIUS_PARAM_OPTIONS}
            />
          </ParamRow>
        </ComponentRow>
      </DisclosureGroup>
      {caption && (
        <GroupCaption>
          Styles apply to the whole synced group — restyling Button also
          restyles ToggleButton.
        </GroupCaption>
      )}
    </>
  )
}

/* --------------------------------- Frames ---------------------------------- */

function Frame({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="flex w-[340px] shrink-0 flex-col gap-2">
      <span className="text-[11px] font-medium tracking-wider text-fg-muted uppercase">
        {label}
      </span>
      <div
        className={cn(
          'h-[620px] overflow-hidden rounded-2xl border border-border/40',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}

/** The baseline: every section inline, grouped-list style. */
function GroupedFrame({ lab }: { lab: Lab }) {
  return (
    <Frame label="Grouped list">
      <div className="flex h-full flex-col gap-1.5 overflow-y-auto p-3 *:shrink-0">
        <SectionHeader label="Preset" {...lab.section(['theme'])} />
        <PresetGroup lab={lab} />
        <SectionHeader label="Colors" {...lab.section(['accent', 'scheme'])} />
        <ColorsGroup lab={lab} caption />
        <SectionHeader
          label="Typography"
          {...lab.section(['font', 'baseSize'])}
        />
        <TypographyGroup lab={lab} />
        <SectionHeader label="Icons" {...lab.section(['icons'])} />
        <IconsGroup lab={lab} />
        <SectionHeader
          label="Layout"
          {...lab.section(['spacing', 'radius', 'density', 'animations'])}
        />
        <LayoutRows lab={lab} />
        <SectionHeader label="Components" {...lab.section(COMPONENT_KEYS)} />
        <ComponentsGroup lab={lab} caption />
      </div>
    </Frame>
  )
}

/** The panel as a product surface: named header, scroll body, export footer. */
function CardFrame({
  lab,
  onRandomize,
  onResetAll,
}: {
  lab: Lab
  onRandomize: () => void
  onResetAll: () => void
}) {
  return (
    <Frame label="In card" className="flex flex-col border-border/60 bg-card">
      <header className="flex h-11 shrink-0 items-center justify-between border-b border-border/40 pr-1.5 pl-4">
        <span className="truncate text-[0.8125rem] font-semibold text-fg">
          Acme design system
        </span>
        <span className="flex shrink-0 items-center">
          <Button size="sm" variant="quiet" isIconOnly aria-label="Shuffle">
            <ShuffleIcon />
          </Button>
          <Button size="sm" variant="quiet" isIconOnly aria-label="Search">
            <SearchIcon />
          </Button>
        </span>
      </header>
      <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto p-3 *:shrink-0">
        <SectionHeader label="Colors" {...lab.section(['accent', 'scheme'])} />
        <ColorsGroup lab={lab} />
        <SectionHeader
          label="Typography"
          {...lab.section(['font', 'baseSize'])}
        />
        <TypographyGroup lab={lab} />
        <SectionHeader label="Components" {...lab.section(COMPONENT_KEYS)} />
        <ComponentsGroup lab={lab} />
        <div className="mt-3 flex flex-col gap-1.5">
          <ControlGroup>
            <ActionRow label="Randomize" onPress={onRandomize} />
            <ActionRow
              label="Reset everything"
              destructive
              onPress={onResetAll}
            />
          </ControlGroup>
          <GroupCaption>
            Resetting returns every axis to the theme default.
          </GroupCaption>
        </div>
      </div>
      <footer className="shrink-0 border-t border-border/40 p-3">
        <Button variant="primary" size="sm" className="w-full">
          Export
        </Button>
      </footer>
    </Frame>
  )
}

/* ---------------------------------- Page ----------------------------------- */

export function ControlLab() {
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

  const randomize = () =>
    setState((prev) => ({
      ...prev,
      accent:
        ACCENT_POOL[Math.floor(Math.random() * ACCENT_POOL.length)] ??
        prev.accent,
      buttonStyle:
        BUTTON_STYLES[Math.floor(Math.random() * BUTTON_STYLES.length)]?.id ??
        prev.buttonStyle,
    }))

  return (
    <div className="flex min-h-svh flex-col gap-8 px-8 py-12">
      <div className="flex max-w-lg flex-col gap-1.5">
        <h1 className="text-lg font-semibold text-fg">Control Lab</h1>
        <p className="text-sm text-fg-muted">
          Panel explorations for /create — one shared design-system state
          rendered through two chromes. Edit in any frame; the other follows.
        </p>
      </div>

      <div className="flex items-start gap-8 overflow-x-auto pb-8">
        <GroupedFrame lab={lab} />
        <CardFrame
          lab={lab}
          onRandomize={randomize}
          onResetAll={() => setState(DEFAULTS)}
        />
      </div>
    </div>
  )
}
