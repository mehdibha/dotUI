'use client'

import { useMemo, useState } from 'react'
import { ChevronDownIcon, PlayIcon } from 'lucide-react'
import { motion } from 'motion/react'

import * as icons from '@/registry/__generated__/icons'
import { monoFonts, sansSerifFonts, serifFonts } from '@/registry/base/fonts'
import {
  DEFAULT_COLOR_CONFIG,
  PALETTE_ORDER,
  resolveColorConfig,
} from '@/registry/theme'
import type { PaletteName } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { ColorPicker } from '@/registry/ui/color-picker'
import { ColorSwatch } from '@/registry/ui/color-swatch'
import { Command } from '@/registry/ui/command'
import { DialogContent } from '@/registry/ui/dialog'
import {
  Description,
  FieldContent,
  FieldGroup,
  Label,
} from '@/registry/ui/field'
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
import { Tab, TabList, TabPanel, Tabs } from '@/registry/ui/tabs'

import { useDesignSystem } from '../preset'
import type { Density } from '../preset'
import { Field, Segmented, SummaryValue, ValueSlider } from './primitives'
import {
  BACKDROP_BLUR_VAR,
  BORDER_WIDTH_VAR,
  CURSOR_DISABLED_VAR,
  CURSOR_INTERACTIVE_VAR,
  DEFAULT_CURSOR_DISABLED,
  DEFAULT_CURSOR_INTERACTIVE,
  DEFAULT_MODE_VAR,
  DEFAULT_RADIUS_FACTOR,
  ELEVATION_STYLE_VAR,
  FOCUS_RING_WIDTH_VAR,
  FONT_BODY_VAR,
  FONT_HEADING_VAR,
  ICON_LIBRARY_VAR,
  ICON_STROKE_VAR,
  MOTION_DURATION_VAR,
  MOTION_ENABLED_VAR,
  RADIUS_FACTOR_VAR,
  REDUCED_MOTION_VAR,
  SHADOW_INTENSITY_VAR,
  TRANSLUCENT_VAR,
  TYPE_BASE_VAR,
  TYPE_SCALE_VAR,
  useToken,
} from './tokens'

/* ============================== Typography ============================== */

function FontSelect({
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
      aria-label="Font"
    >
      <Button size="sm" className="w-full justify-between">
        <SelectValue className="truncate" />
        <ChevronDownIcon data-icon-end="" />
      </Button>
      <Popover>
        <Command>
          <SearchField
            autoFocus
            aria-label="Search fonts"
            className="w-full p-2"
          >
            <Input className="w-full" />
          </SearchField>
          <ListBox>
            <ListBoxSection>
              <ListBoxSectionHeader>Sans</ListBoxSectionHeader>
              {sansSerifFonts.map((f) => (
                <ListBoxItem key={f} id={f}>
                  {f}
                </ListBoxItem>
              ))}
            </ListBoxSection>
            <ListBoxSection>
              <ListBoxSectionHeader>Serif</ListBoxSectionHeader>
              {serifFonts.map((f) => (
                <ListBoxItem key={f} id={f}>
                  {f}
                </ListBoxItem>
              ))}
            </ListBoxSection>
            <ListBoxSection>
              <ListBoxSectionHeader>Mono</ListBoxSectionHeader>
              {monoFonts.map((f) => (
                <ListBoxItem key={f} id={f}>
                  {f}
                </ListBoxItem>
              ))}
            </ListBoxSection>
          </ListBox>
        </Command>
      </Popover>
    </Select>
  )
}

export function TypographySummary() {
  const [heading] = useToken(FONT_HEADING_VAR, 'Geist')
  const [body] = useToken(FONT_BODY_VAR, 'Geist')
  return (
    <SummaryValue>
      {heading === body ? heading : `${heading} · ${body}`}
    </SummaryValue>
  )
}

export function TypographyAxis() {
  const [mode, setMode] = useState<'simple' | 'advanced'>('simple')
  const [scale, setScale] = useToken(TYPE_SCALE_VAR, '1.2')
  const [base, setBase] = useToken(TYPE_BASE_VAR, '16')
  return (
    <Tabs
      selectedKey={mode}
      onSelectionChange={(k) => setMode(k as typeof mode)}
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
        <Field label="Display font" binding="stub">
          <FontSelect varName={FONT_HEADING_VAR} fallback="Geist" />
        </Field>
        <Field label="Body font" binding="stub">
          <FontSelect varName={FONT_BODY_VAR} fallback="Geist" />
        </Field>
      </TabPanel>
      <TabPanel id="advanced" className="mt-4 flex flex-col gap-4">
        <Field label="Display font" binding="stub">
          <FontSelect varName={FONT_HEADING_VAR} fallback="Geist" />
        </Field>
        <Field label="Body font" binding="stub">
          <FontSelect varName={FONT_BODY_VAR} fallback="Geist" />
        </Field>
        <Field label="Scale ratio" binding="stub">
          <ValueSlider
            ariaLabel="Type scale"
            value={Number.parseFloat(scale) || 1.2}
            min={1.067}
            max={1.414}
            step={0.009}
            format={(v) => v.toFixed(3)}
            onChange={(v) => setScale(String(v))}
          />
        </Field>
        <Field label="Base size" binding="stub">
          <ValueSlider
            ariaLabel="Base size"
            value={Number.parseFloat(base) || 16}
            min={13}
            max={18}
            step={1}
            format={(v) => `${v}px`}
            onChange={(v) => setBase(String(v))}
          />
        </Field>
        {/* Live specimen ladder */}
        <div className="flex flex-col gap-1 rounded-lg border bg-bg p-3">
          {[2.25, 1.5, 1].map((rem) => (
            <p
              key={rem}
              className="truncate font-medium text-fg"
              style={{ fontSize: `${rem}rem`, lineHeight: 1.1 }}
            >
              The quick brown fox
            </p>
          ))}
        </div>
      </TabPanel>
    </Tabs>
  )
}

/* ============================== Iconography ============================= */

const ICON_LIBRARIES = [
  { value: 'lucide', label: 'Lucide' },
  { value: 'remix', label: 'Remix' },
  { value: 'tabler', label: 'Tabler' },
  { value: 'hugeicons', label: 'Huge Icons' },
]

export function IconographySummary() {
  const [lib] = useToken(ICON_LIBRARY_VAR, 'lucide')
  return (
    <SummaryValue className="capitalize">
      {ICON_LIBRARIES.find((l) => l.value === lib)?.label ?? lib}
    </SummaryValue>
  )
}

export function IconographyAxis() {
  const [lib, setLib] = useToken(ICON_LIBRARY_VAR, 'lucide')
  const [stroke, setStroke] = useToken(ICON_STROKE_VAR, '2')
  const sample = Object.entries(icons)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 14)
  return (
    <div className="flex flex-col gap-4">
      <Field label="Icon library" binding="stub">
        <Select
          className="w-full"
          selectedKey={lib}
          onSelectionChange={(k) => setLib(k as string)}
          aria-label="Icon library"
        >
          <Button size="sm" className="w-full justify-between">
            <SelectValue />
            <ChevronDownIcon data-icon-end="" />
          </Button>
          <Popover>
            <ListBox>
              {ICON_LIBRARIES.map((l) => (
                <ListBoxItem key={l.value} id={l.value}>
                  {l.label}
                </ListBoxItem>
              ))}
            </ListBox>
          </Popover>
        </Select>
      </Field>
      <Field label="Stroke width" binding="stub">
        <ValueSlider
          ariaLabel="Stroke width"
          value={Number.parseFloat(stroke) || 2}
          min={1}
          max={2.5}
          step={0.25}
          format={(v) => `${v}px`}
          onChange={(v) => setStroke(String(v))}
        />
      </Field>
      <div
        className="flex flex-wrap items-center gap-3 rounded-lg border bg-bg p-3 text-fg-muted [&_svg]:size-5"
        style={{ strokeWidth: Number.parseFloat(stroke) || 2 }}
      >
        {sample.map(([name, Icon]) => (
          <Icon key={name} />
        ))}
      </div>
    </div>
  )
}

/* ================================ Density =============================== */

const DENSITY_OPTIONS: { id: Density; label: string; description: string }[] = [
  {
    id: 'compact',
    label: 'Compact',
    description: 'Tight spacing for dense UIs',
  },
  {
    id: 'default',
    label: 'Default',
    description: 'Balanced, comfortable spacing',
  },
  {
    id: 'comfortable',
    label: 'Comfortable',
    description: 'Generous breathing room',
  },
]

export function DensityMark({ density }: { density: Density }) {
  const gap = density === 'compact' ? 2 : density === 'default' ? 4 : 6
  return (
    <span
      className="flex flex-col items-end"
      style={{ gap: `${gap}px` }}
      aria-hidden
    >
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-[2px] w-4 rounded-full bg-fg-muted" />
      ))}
    </span>
  )
}

export function DensitySummary() {
  const { designSystem } = useDesignSystem()
  return (
    <>
      <SummaryValue className="capitalize">{designSystem.density}</SummaryValue>
      <DensityMark density={designSystem.density} />
    </>
  )
}

export function DensityAxis() {
  const { designSystem, setDensity } = useDesignSystem()
  return (
    <RadioGroup
      value={designSystem.density}
      onChange={(v) => setDensity(v as Density)}
      aria-label="Density"
    >
      <FieldGroup>
        {DENSITY_OPTIONS.map((opt) => (
          <Radio key={opt.id} value={opt.id}>
            <RadioControl>
              <RadioIndicator />
              <FieldContent>
                <Label>{opt.label}</Label>
                <Description>{opt.description}</Description>
              </FieldContent>
            </RadioControl>
          </Radio>
        ))}
      </FieldGroup>
    </RadioGroup>
  )
}

/* ================================ Radius =============================== */

export function RadiusSummary() {
  const [value] = useToken(RADIUS_FACTOR_VAR, DEFAULT_RADIUS_FACTOR)
  const num = Number.parseFloat(value) || 1
  return (
    <>
      <SummaryValue>{num.toFixed(2)}×</SummaryValue>
      <span
        className="size-3.5 border border-fg-muted"
        style={{ borderRadius: `calc(0.4rem * ${num})` }}
        aria-hidden
      />
    </>
  )
}

export function RadiusAxis() {
  const [value, set] = useToken(RADIUS_FACTOR_VAR, DEFAULT_RADIUS_FACTOR)
  const num = Number.parseFloat(value) || 1
  return (
    <Field label="Radius factor" binding="live">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <ValueSlider
            ariaLabel="Radius factor"
            value={num}
            min={0}
            max={2}
            step={0.05}
            format={(v) => `${v.toFixed(2)}×`}
            onChange={(v) => set(String(v))}
          />
        </div>
        <span
          className="size-9 shrink-0 border bg-neutral"
          style={{ borderRadius: `calc(0.6rem * ${num})` }}
          aria-hidden
        />
      </div>
    </Field>
  )
}

/* ================================ Borders ============================== */

export function BordersSummary() {
  const [value] = useToken(BORDER_WIDTH_VAR, '1')
  return <SummaryValue>{value}px</SummaryValue>
}

export function BordersAxis() {
  const [value, set] = useToken(BORDER_WIDTH_VAR, '1')
  return (
    <Field label="Border width" binding="stub">
      <ValueSlider
        ariaLabel="Border width"
        value={Number.parseFloat(value) || 1}
        min={0}
        max={3}
        step={0.5}
        format={(v) => `${v}px`}
        onChange={(v) => set(String(v))}
      />
    </Field>
  )
}

/* =============================== Elevation ============================= */

const STYLE_FAMILIES = [
  { value: 'flat', label: 'Flat' },
  { value: 'soft', label: 'Soft' },
  { value: 'depth', label: '3D' },
  { value: 'glass', label: 'Glass' },
] as const

export function ElevationSummary() {
  const [style] = useToken(ELEVATION_STYLE_VAR, 'soft')
  return (
    <SummaryValue className="capitalize">
      {STYLE_FAMILIES.find((s) => s.value === style)?.label ?? style}
    </SummaryValue>
  )
}

export function ElevationAxis() {
  const [mode, setMode] = useState<'simple' | 'advanced'>('simple')
  const [style, setStyle] = useToken(ELEVATION_STYLE_VAR, 'soft')
  const [shadow, setShadow] = useToken(SHADOW_INTENSITY_VAR, '0.5')
  const [blur, setBlur] = useToken(BACKDROP_BLUR_VAR, '0')
  const [translucent, setTranslucent] = useToken(TRANSLUCENT_VAR, 'false')
  return (
    <Tabs
      selectedKey={mode}
      onSelectionChange={(k) => setMode(k as typeof mode)}
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
        <Field label="Style family" binding="stub">
          <Segmented
            ariaLabel="Style family"
            value={style}
            onChange={setStyle}
            options={STYLE_FAMILIES.map((s) => ({
              value: s.value,
              label: s.label,
            }))}
          />
        </Field>
        <Field label="Shadow intensity" binding="stub">
          <ValueSlider
            ariaLabel="Shadow intensity"
            value={Number.parseFloat(shadow) || 0.5}
            min={0}
            max={1}
            step={0.05}
            format={(v) => `${Math.round(v * 100)}%`}
            onChange={(v) => setShadow(String(v))}
          />
        </Field>
      </TabPanel>
      <TabPanel id="advanced" className="mt-4 flex flex-col gap-4">
        <Field label="Backdrop blur" binding="stub">
          <ValueSlider
            ariaLabel="Backdrop blur"
            value={Number.parseFloat(blur) || 0}
            min={0}
            max={24}
            step={1}
            format={(v) => `${v}px`}
            onChange={(v) => setBlur(String(v))}
          />
        </Field>
        <label className="flex items-center justify-between gap-2 text-xs text-fg-muted">
          <span className="flex flex-col">
            <span className="font-medium text-fg">Translucent surfaces</span>
            <span>Frost menus, popovers & overlays as one switch.</span>
          </span>
          <Switch
            isSelected={translucent === 'true'}
            onChange={(s) => setTranslucent(String(s))}
            aria-label="Translucent surfaces"
          />
        </label>
      </TabPanel>
    </Tabs>
  )
}

/* ================================ Motion ============================== */

export function MotionSummary() {
  const [enabled] = useToken(MOTION_ENABLED_VAR, 'true')
  return <SummaryValue>{enabled === 'false' ? 'Off' : 'On'}</SummaryValue>
}

export function MotionAxis() {
  const [mode, setMode] = useState<'simple' | 'advanced'>('simple')
  const [enabled, setEnabled] = useToken(MOTION_ENABLED_VAR, 'true')
  const [reduced, setReduced] = useToken(REDUCED_MOTION_VAR, 'true')
  const [duration, setDuration] = useToken(MOTION_DURATION_VAR, '150')
  const [playKey, setPlayKey] = useState(0)
  return (
    <Tabs
      selectedKey={mode}
      onSelectionChange={(k) => setMode(k as typeof mode)}
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
        <label className="flex items-center justify-between gap-2 text-xs text-fg-muted">
          <span className="font-medium text-fg">Animations</span>
          <Switch
            isSelected={enabled !== 'false'}
            onChange={(s) => setEnabled(String(s))}
            aria-label="Animations"
          />
        </label>
      </TabPanel>
      <TabPanel id="advanced" className="mt-4 flex flex-col gap-4">
        <Field label="Duration" binding="stub">
          <ValueSlider
            ariaLabel="Duration"
            value={Number.parseFloat(duration) || 150}
            min={0}
            max={400}
            step={10}
            format={(v) => `${v}ms`}
            onChange={(v) => setDuration(String(v))}
          />
        </Field>
        <label className="flex items-center justify-between gap-2 text-xs text-fg-muted">
          <span className="font-medium text-fg">Respect reduced-motion</span>
          <Switch
            isSelected={reduced !== 'false'}
            onChange={(s) => setReduced(String(s))}
            aria-label="Respect reduced motion"
          />
        </label>
        <Button size="sm" onPress={() => setPlayKey((k) => k + 1)}>
          <PlayIcon data-icon-start="" />
          Play sample
        </Button>
        <div className="grid place-items-center rounded-lg border bg-bg p-4">
          <motion.span
            key={playKey}
            initial={{ scale: 0.6, opacity: 0.3 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: (Number.parseFloat(duration) || 150) / 1000,
              ease: [0.32, 0.72, 0, 1],
            }}
            className="size-8 rounded-md bg-primary"
            aria-hidden
          />
        </div>
      </TabPanel>
    </Tabs>
  )
}

/* ============================= Interaction ============================ */

const CURSORS = [
  'default',
  'pointer',
  'not-allowed',
  'wait',
  'help',
  'crosshair',
  'text',
  'move',
  'grab',
  'progress',
]

function CursorSelect({
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
        <SelectValue className="capitalize" />
        <ChevronDownIcon data-icon-end="" />
      </Button>
      <Popover>
        <ListBox>
          {CURSORS.map((c) => (
            <ListBoxItem key={c} id={c} className="capitalize">
              {c}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  )
}

export function InteractionSummary() {
  const [cursor] = useToken(CURSOR_INTERACTIVE_VAR, DEFAULT_CURSOR_INTERACTIVE)
  return <SummaryValue className="capitalize">{cursor}</SummaryValue>
}

export function InteractionAxis() {
  const [focus, setFocus] = useToken(FOCUS_RING_WIDTH_VAR, '2')
  return (
    <div className="flex flex-col gap-4">
      <Field label="Interactive cursor" binding="live">
        <CursorSelect
          varName={CURSOR_INTERACTIVE_VAR}
          fallback={DEFAULT_CURSOR_INTERACTIVE}
        />
      </Field>
      <Field label="Disabled cursor" binding="live">
        <CursorSelect
          varName={CURSOR_DISABLED_VAR}
          fallback={DEFAULT_CURSOR_DISABLED}
        />
      </Field>
      <Field label="Focus ring width" binding="stub">
        <ValueSlider
          ariaLabel="Focus ring width"
          value={Number.parseFloat(focus) || 2}
          min={0}
          max={4}
          step={1}
          format={(v) => `${v}px`}
          onChange={(v) => setFocus(String(v))}
        />
      </Field>
    </div>
  )
}

/* ============================== Appearance ============================ */

export function AppearanceSummary() {
  const [mode] = useToken(DEFAULT_MODE_VAR, 'system')
  return <SummaryValue className="capitalize">{mode}</SummaryValue>
}

export function AppearanceAxis() {
  const [mode, set] = useToken(DEFAULT_MODE_VAR, 'system')
  return (
    <Field
      label="Default mode"
      binding="stub"
      hint="Which colour mode the exported system boots in."
    >
      <Segmented
        ariaLabel="Default mode"
        value={mode}
        onChange={set}
        options={[
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
          { value: 'system', label: 'Auto' },
        ]}
      />
    </Field>
  )
}

/* ====================== Exposed palette foundations ==================== */

/** One editable ramp foundation, shown only when "Expose palettes" is on. */
export function PaletteFoundationAxis({ palette }: { palette: PaletteName }) {
  const { designSystem, setToken } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const resolved = useMemo(() => resolveColorConfig(config), [config])
  const ramp = resolved.light[palette]
  if (!ramp) return null
  const entries = Object.entries(ramp)
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-fg-muted">
        Override any step of the {palette} ramp. Each is a foundation token
        other tokens build on.
      </p>
      <div className="grid grid-cols-6 gap-1.5">
        {entries.map(([step, val]) => (
          <ColorPicker
            key={step}
            value={val}
            onChange={(c) =>
              setToken(`--${palette}-${step}`, c.toString('hex'))
            }
          >
            <Button
              isIconOnly
              size="sm"
              aria-label={`${palette} ${step}`}
              className="size-full p-0"
              style={{ backgroundColor: val }}
            >
              <span className="sr-only">{step}</span>
            </Button>
            <Popover>
              <DialogContent className="flex w-52 flex-col gap-2">
                <span className="font-mono text-[11px] text-fg-muted">
                  --{palette}-{step}
                </span>
                <ColorSwatch />
              </DialogContent>
            </Popover>
          </ColorPicker>
        ))}
      </div>
    </div>
  )
}

export function paletteSummary(palette: PaletteName) {
  return function PaletteSummary() {
    const { designSystem } = useDesignSystem()
    const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
    const resolved = useMemo(() => resolveColorConfig(config), [config])
    const ramp = resolved.light[palette]
    const stops = ramp ? Object.values(ramp) : []
    return (
      <span
        className="h-3 w-20 overflow-hidden rounded-full ring-1 ring-black/5 ring-inset"
        style={{
          background:
            stops.length > 0
              ? `linear-gradient(to right, ${stops.join(',')})`
              : undefined,
        }}
        aria-hidden
      />
    )
  }
}

export const EXPOSED_PALETTES: PaletteName[] = [...PALETTE_ORDER]
