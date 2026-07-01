'use client'

import {
  ChevronDownIcon,
  LayersIcon,
  type LucideIcon,
  MousePointer2Icon,
  RulerIcon,
  ShapesIcon,
  SmileIcon,
  TypeIcon,
  ZapIcon,
} from 'lucide-react'

import * as appIcons from '@/registry/__generated__/icons'
import { monoFonts, sansSerifFonts, serifFonts } from '@/registry/base/fonts'
import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { Command } from '@/registry/ui/command'
import { Input } from '@/registry/ui/input'
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { SearchField } from '@/registry/ui/search-field'
import { Select, SelectValue } from '@/registry/ui/select'
import { Switch } from '@/registry/ui/switch'

import {
  CURSOR_DISABLED_VAR,
  CURSOR_INTERACTIVE_VAR,
  DEFAULT_CURSOR_DISABLED,
  DEFAULT_CURSOR_INTERACTIVE,
} from '../../cursor'
import { DEFAULT_RADIUS_FACTOR, RADIUS_FACTOR_VAR } from '../../layout'
import { useDesignSystem } from '../../preset'
import type { Density } from '../../preset'
import {
  BACKDROP_BLUR_VAR,
  BORDER_WIDTH_VAR,
  DEFAULT_MODE_VAR,
  FOCUS_RING_WIDTH_VAR,
  FONT_BODY_VAR,
  FONT_HEADING_VAR,
  ICON_LIBRARY_VAR,
  ICON_STROKE_VAR,
  LETTER_SPACING_VAR,
  MOTION_DURATION_VAR,
  MOTION_ENABLED_VAR,
  REDUCED_MOTION_VAR,
  SHADOW_INTENSITY_VAR,
  SPACING_SCALE_VAR,
  STYLE_FAMILY_VAR,
  TRANSLUCENT_VAR,
  TYPE_BASE_VAR,
  TYPE_SCALE_VAR,
} from '../tokens'
import {
  Field,
  GroupLabel,
  LiveDot,
  Panel,
  Segmented,
  ValueSlider,
  WorkspaceHeader,
} from '../ui'

/* -------------------------------- helpers -------------------------------- */

function useToken(name: string, fallback: string) {
  const { designSystem, setToken } = useDesignSystem()
  const value = designSystem.tokens[name] ?? fallback
  return [value, (v: string) => setToken(name, v)] as const
}

function useNumToken(name: string, fallback: number) {
  const { designSystem, setToken } = useDesignSystem()
  const raw = designSystem.tokens[name]
  const value = raw != null ? Number.parseFloat(raw) || fallback : fallback
  return [value, (v: number) => setToken(name, String(v))] as const
}

function PreviewSurface({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <GroupLabel>{label}</GroupLabel>
      <div className="flex min-h-24 items-center justify-center rounded-lg border bg-neutral/30 p-4">
        {children}
      </div>
    </div>
  )
}

/* ------------------------------ Typography ------------------------------- */

// Sans first (the common default lives here, e.g. Geist), then serif and mono.
const FONT_GROUPS = [
  { label: 'Sans Serif', fonts: sansSerifFonts },
  { label: 'Serif', fonts: serifFonts },
  { label: 'Mono', fonts: monoFonts },
] as const

function FontSelect({
  varName,
  ariaLabel,
}: {
  varName: string
  ariaLabel: string
}) {
  const [value, set] = useToken(varName, 'Geist')
  return (
    <Select
      className="w-full"
      selectedKey={value}
      onSelectionChange={(k) => set(k as string)}
      aria-label={ariaLabel}
    >
      <Button size="sm" className="w-full justify-between">
        <SelectValue className="truncate" />
        <ChevronDownIcon data-icon-end="" />
      </Button>
      <Popover className="max-h-72">
        <Command>
          <SearchField
            aria-label="Search fonts"
            autoFocus
            className="w-full p-2"
          >
            <Input className="w-full" />
          </SearchField>
          <ListBox>
            {FONT_GROUPS.map((group) => (
              <ListBoxSection key={group.label}>
                <ListBoxSectionHeader>{group.label}</ListBoxSectionHeader>
                {group.fonts.map((f) => (
                  <ListBoxItem key={f} id={f}>
                    {f}
                  </ListBoxItem>
                ))}
              </ListBoxSection>
            ))}
          </ListBox>
        </Command>
      </Popover>
    </Select>
  )
}

export function TypographyWorkspace() {
  const [heading] = useToken(FONT_HEADING_VAR, 'Geist')
  const [body] = useToken(FONT_BODY_VAR, 'Geist')
  const [scale, setScale] = useNumToken(TYPE_SCALE_VAR, 1.25)
  const [base, setBase] = useNumToken(TYPE_BASE_VAR, 16)
  const [tracking, setTracking] = useNumToken(LETTER_SPACING_VAR, 0)

  return (
    <div className="flex flex-col gap-5">
      <WorkspaceHeader
        icon={TypeIcon}
        title="Typography"
        description="Pick the fonts and the modular scale every text style is built from."
      />
      <Panel>
        <Field
          label={<LabelWithDot text="Display font" live />}
          anchor="heading-font"
        >
          <FontSelect varName={FONT_HEADING_VAR} ariaLabel="Display font" />
        </Field>
        <Field
          label={<LabelWithDot text="Body font" live />}
          anchor="body-font"
        >
          <FontSelect varName={FONT_BODY_VAR} ariaLabel="Body font" />
        </Field>
      </Panel>
      <Field anchor="type-scale">
        <ValueSlider
          label={<LabelWithDot text="Scale ratio" live={false} />}
          ariaLabel="Type scale ratio"
          value={scale}
          min={1.1}
          max={1.5}
          step={0.01}
          format={(v) => v.toFixed(3)}
          onChange={setScale}
        />
      </Field>
      <Field anchor="base-size">
        <ValueSlider
          label={<LabelWithDot text="Base size" live />}
          ariaLabel="Base size"
          value={base}
          min={13}
          max={18}
          step={1}
          format={(v) => `${v}px`}
          onChange={setBase}
        />
      </Field>
      <Field anchor="letter-spacing">
        <ValueSlider
          label={<LabelWithDot text="Letter spacing" live />}
          ariaLabel="Letter spacing"
          value={tracking}
          min={-0.05}
          max={0.1}
          step={0.005}
          format={(v) => `${v.toFixed(3)}em`}
          onChange={setTracking}
        />
      </Field>
      <PreviewSurface label="Specimen">
        <div
          className="flex flex-col gap-1.5"
          style={{ letterSpacing: `${tracking}em` }}
        >
          <span
            style={{ fontFamily: heading, fontSize: base * scale * scale }}
            className="leading-none font-semibold"
          >
            Ag
          </span>
          <span
            style={{ fontFamily: body, fontSize: base }}
            className="text-fg-muted"
          >
            The quick brown fox.
          </span>
        </div>
      </PreviewSurface>
    </div>
  )
}

/* -------------------------------- Shape ---------------------------------- */

export function ShapeWorkspace() {
  const [radius, setRadius] = useNumToken(
    RADIUS_FACTOR_VAR,
    Number.parseFloat(DEFAULT_RADIUS_FACTOR),
  )
  const [border, setBorder] = useNumToken(BORDER_WIDTH_VAR, 1)
  return (
    <div className="flex flex-col gap-5">
      <WorkspaceHeader
        icon={ShapesIcon}
        title="Shape"
        description="Corner rounding and border weight — the silhouette of every surface."
      />
      <Field anchor="radius-factor">
        <ValueSlider
          label={<LabelWithDot text="Radius factor" live />}
          ariaLabel="Radius factor"
          value={radius}
          min={0}
          max={2}
          step={0.05}
          format={(v) => `${v.toFixed(2)}×`}
          onChange={setRadius}
        />
      </Field>
      <Field anchor="border-width">
        <ValueSlider
          label={<LabelWithDot text="Border width" live />}
          ariaLabel="Border width"
          value={border}
          min={0}
          max={3}
          step={0.5}
          format={(v) => `${v}px`}
          onChange={setBorder}
        />
      </Field>
      <PreviewSurface label="Preview">
        <div
          className="size-16 bg-primary/15"
          style={{
            borderRadius: `calc(0.75rem * ${radius})`,
            border: `${border}px solid var(--color-primary)`,
          }}
        />
      </PreviewSurface>
    </div>
  )
}

/* ------------------------------- Spacing --------------------------------- */

export function SpacingWorkspace() {
  const { designSystem, setDensity } = useDesignSystem()
  const [scale, setScale] = useNumToken(SPACING_SCALE_VAR, 1)
  const gap =
    designSystem.density === 'compact'
      ? 4
      : designSystem.density === 'default'
        ? 8
        : 14
  return (
    <div className="flex flex-col gap-5">
      <WorkspaceHeader
        icon={RulerIcon}
        title="Spacing & density"
        description="The rhythm of the system — control heights, gaps and padding at once."
      />
      <Field label={<LabelWithDot text="Density" live />} anchor="density">
        <Segmented<Density>
          ariaLabel="Density"
          value={designSystem.density}
          onChange={setDensity}
          options={[
            { value: 'compact', label: 'Compact' },
            { value: 'default', label: 'Default' },
            { value: 'comfortable', label: 'Cozy' },
          ]}
        />
      </Field>
      <Field anchor="spacing-scale">
        <ValueSlider
          label={<LabelWithDot text="Spacing scale" live={false} />}
          ariaLabel="Spacing scale"
          value={scale}
          min={0.75}
          max={1.5}
          step={0.05}
          format={(v) => `${v.toFixed(2)}×`}
          onChange={setScale}
        />
      </Field>
      <PreviewSurface label="Rhythm">
        <div className="flex w-full flex-col" style={{ gap }}>
          {[80, 60, 70].map((w, i) => (
            <div
              key={i}
              className="h-2.5 rounded-full bg-fg-muted/40"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      </PreviewSurface>
    </div>
  )
}

/* ------------------------------- Surface --------------------------------- */

const STYLE_FAMILIES = [
  { value: 'flat', label: 'Flat' },
  { value: 'soft', label: 'Soft' },
  { value: 'depth', label: '3D' },
  { value: 'glass', label: 'Glass' },
] as const

export function SurfaceWorkspace() {
  const [family, setFamily] = useToken(STYLE_FAMILY_VAR, 'soft')
  const [shadow, setShadow] = useNumToken(SHADOW_INTENSITY_VAR, 0.5)
  const [blur, setBlur] = useNumToken(BACKDROP_BLUR_VAR, 0)
  const [translucent, setTranslucent] = useToken(TRANSLUCENT_VAR, 'false')
  return (
    <div className="flex flex-col gap-5">
      <WorkspaceHeader
        icon={LayersIcon}
        title="Surface & elevation"
        description="The big re-skin — how cards, menus and overlays sit above the page."
      />
      <Field
        label={<LabelWithDot text="Style family" live />}
        anchor="style-family"
      >
        <div className="grid grid-cols-4 gap-1.5">
          {STYLE_FAMILIES.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFamily(f.value)}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-md border p-2 text-[11px] focus-reset transition-colors focus-visible:focus-ring',
                family === f.value
                  ? 'border-primary bg-primary/5 text-fg'
                  : 'text-fg-muted hover:bg-neutral',
              )}
            >
              <StyleGlyph kind={f.value} />
              {f.label}
            </button>
          ))}
        </div>
      </Field>
      <Field anchor="shadow-intensity">
        <ValueSlider
          label={<LabelWithDot text="Shadow intensity" live />}
          ariaLabel="Shadow intensity"
          value={shadow}
          min={0}
          max={1}
          step={0.05}
          format={(v) => `${Math.round(v * 100)}%`}
          onChange={setShadow}
        />
      </Field>
      <Field anchor="backdrop-blur">
        <ValueSlider
          label={<LabelWithDot text="Backdrop blur" live />}
          ariaLabel="Backdrop blur"
          value={blur}
          min={0}
          max={24}
          step={1}
          format={(v) => `${v}px`}
          onChange={setBlur}
        />
      </Field>
      <ToggleRow
        label="Translucent menus & popovers"
        hint="Frost overlays so the page shows through."
        live={false}
        value={translucent === 'true'}
        onChange={(v) => setTranslucent(String(v))}
      />
    </div>
  )
}

function StyleGlyph({ kind }: { kind: string }) {
  const base = 'size-6 rounded-md bg-card'
  if (kind === 'flat') return <span className={cn(base, 'border')} />
  if (kind === 'soft') return <span className={cn(base, 'border shadow-md')} />
  if (kind === 'depth')
    return <span className={cn(base, 'border shadow-lg shadow-fg-muted/40')} />
  return (
    <span
      className={cn(base, 'border border-white/30 bg-card/40 backdrop-blur')}
    />
  )
}

/* -------------------------------- Motion --------------------------------- */

export function MotionWorkspace() {
  const [duration, setDuration] = useNumToken(MOTION_DURATION_VAR, 150)
  const [enabled, setEnabled] = useToken(MOTION_ENABLED_VAR, 'true')
  const [reduced, setReduced] = useToken(REDUCED_MOTION_VAR, 'true')
  return (
    <div className="flex flex-col gap-5">
      <WorkspaceHeader
        icon={ZapIcon}
        title="Motion"
        description="How quickly the interface responds — and whether it animates at all."
      />
      <Field anchor="duration">
        <ValueSlider
          label={<LabelWithDot text="Duration scale" live />}
          ariaLabel="Duration scale"
          value={duration}
          min={0}
          max={400}
          step={10}
          format={(v) => `${v}ms`}
          onChange={setDuration}
        />
      </Field>
      <ToggleRow
        label="Animations"
        hint="Global switch for every transition."
        live
        value={enabled === 'true'}
        onChange={(v) => setEnabled(String(v))}
      />
      <ToggleRow
        label="Respect reduced-motion"
        hint="Honor the visitor's OS motion preference."
        live={false}
        value={reduced === 'true'}
        onChange={(v) => setReduced(String(v))}
      />
    </div>
  )
}

/* --------------------------------- Icons --------------------------------- */

const ICON_LIBRARIES = [
  { value: 'lucide', label: 'Lucide' },
  { value: 'remix', label: 'Remix' },
  { value: 'tabler', label: 'Tabler' },
  { value: 'hugeicons', label: 'Huge' },
]

export function IconsWorkspace() {
  const [library, setLibrary] = useToken(ICON_LIBRARY_VAR, 'lucide')
  const [stroke, setStroke] = useNumToken(ICON_STROKE_VAR, 2)
  const sample = Object.entries(appIcons)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 12)
  return (
    <div className="flex flex-col gap-5">
      <WorkspaceHeader
        icon={SmileIcon}
        title="Iconography"
        description="The icon set and stroke weight used across the system."
      />
      <Field
        label={<LabelWithDot text="Icon library" live={false} />}
        anchor="icon-library"
      >
        <Segmented
          ariaLabel="Icon library"
          value={library}
          onChange={setLibrary}
          options={ICON_LIBRARIES}
        />
      </Field>
      <Field anchor="icon-stroke">
        <ValueSlider
          label={<LabelWithDot text="Stroke width" live={false} />}
          ariaLabel="Icon stroke"
          value={stroke}
          min={1}
          max={2.5}
          step={0.25}
          format={(v) => `${v}px`}
          onChange={setStroke}
        />
      </Field>
      <PreviewSurface label="Sample">
        <div
          className="grid grid-cols-6 gap-3 text-fg-muted [&_svg]:size-5"
          style={{ strokeWidth: stroke }}
        >
          {sample.map(([name, Icon]) => (
            <Icon key={name} />
          ))}
        </div>
      </PreviewSurface>
    </div>
  )
}

/* ----------------------------- Interaction ------------------------------- */

const CURSORS = [
  'default',
  'pointer',
  'not-allowed',
  'wait',
  'progress',
  'text',
  'grab',
  'help',
]

function CursorSelect({
  varName,
  fallback,
  ariaLabel,
}: {
  varName: string
  fallback: string
  ariaLabel: string
}) {
  const [value, set] = useToken(varName, fallback)
  return (
    <Select
      className="w-full"
      selectedKey={value}
      onSelectionChange={(k) => set(k as string)}
      aria-label={ariaLabel}
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

export function InteractionWorkspace() {
  const [ring, setRing] = useNumToken(FOCUS_RING_WIDTH_VAR, 2)
  const [mode, setMode] = useToken(DEFAULT_MODE_VAR, 'system')
  return (
    <div className="flex flex-col gap-5">
      <WorkspaceHeader
        icon={MousePointer2Icon}
        title="Interaction"
        description="Cursors, focus rings and the mode the exported system boots in."
      />
      <Panel>
        <Field
          label={<LabelWithDot text="Interactive cursor" live />}
          anchor="cursor-interactive"
        >
          <CursorSelect
            varName={CURSOR_INTERACTIVE_VAR}
            fallback={DEFAULT_CURSOR_INTERACTIVE}
            ariaLabel="Interactive cursor"
          />
        </Field>
        <Field
          label={<LabelWithDot text="Disabled cursor" live />}
          anchor="cursor-disabled"
        >
          <CursorSelect
            varName={CURSOR_DISABLED_VAR}
            fallback={DEFAULT_CURSOR_DISABLED}
            ariaLabel="Disabled cursor"
          />
        </Field>
      </Panel>
      <Field anchor="focus-ring-width">
        <ValueSlider
          label={<LabelWithDot text="Focus ring width" live={false} />}
          ariaLabel="Focus ring width"
          value={ring}
          min={0}
          max={4}
          step={1}
          format={(v) => `${v}px`}
          onChange={setRing}
        />
      </Field>
      <Field
        label={<LabelWithDot text="Default mode" live={false} />}
        anchor="default-mode"
        hint="Which mode the exported system starts in."
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

/* ------------------------------ tiny atoms ------------------------------- */

function LabelWithDot({ text, live }: { text: string; live: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      {text}
      <LiveDot live={live} />
    </span>
  )
}

function ToggleRow({
  label,
  hint,
  value,
  onChange,
  live,
}: {
  label: string
  hint?: string
  value: boolean
  onChange: (v: boolean) => void
  live: boolean
}) {
  return (
    <label className="flex items-start justify-between gap-3">
      <span className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1.5 text-xs font-medium">
          {label}
          <LiveDot live={live} />
        </span>
        {hint && (
          <span className="text-xs leading-snug text-fg-muted/80">{hint}</span>
        )}
      </span>
      <Switch isSelected={value} onChange={onChange} aria-label={label} />
    </label>
  )
}

export const FOUNDATION_ICONS: Record<string, LucideIcon> = {
  typography: TypeIcon,
  shape: ShapesIcon,
  spacing: RulerIcon,
  surface: LayersIcon,
  motion: ZapIcon,
  icons: SmileIcon,
  interaction: MousePointer2Icon,
}
