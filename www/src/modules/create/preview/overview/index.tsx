import { type ReactNode, use, useMemo } from 'react'

import { STEPS, type Theme } from '@dotui/colors'

import {
  DEFAULT_BODY_FAMILY,
  DEFAULT_MONO_FAMILY,
  familyFromStack,
  FONT_HEADING_VAR,
  FONT_MONO_VAR,
  FONT_SANS_VAR,
} from '@/lib/fonts'
import { resolveColorConfigCached } from '@/lib/resolve-color'
import * as icons from '@/registry/__generated__/icons'
import {
  BoxIcon,
  LayersIcon,
  MousePointer2Icon,
  PaletteIcon,
  RulerIcon,
  Settings2Icon,
  ShapesIcon,
  SmileIcon,
  SparklesIcon,
  TypeIcon,
} from '@/registry/icons'
import { IconLibraryContext } from '@/registry/icons/create-icon'
import { iconLibraries } from '@/registry/icons/icon-map'
import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG, PALETTE_ORDER } from '@/registry/theme'
// Live component atoms — reuse the real demos so the gallery always mirrors the
// shipped components (and their live params / density / radius), never a stale copy.
import AvatarDemo from '@/registry/ui/avatar/demos/group'
import { Badge } from '@/registry/ui/badge'
import { Button } from '@/registry/ui/button'
import CheckboxDemo from '@/registry/ui/checkbox/demos/basic'
import { Kbd } from '@/registry/ui/kbd'
import RadioGroupDemo from '@/registry/ui/radio-group/demos/default'
import SelectDemo from '@/registry/ui/select/demos/basic'
import SliderDemo from '@/registry/ui/slider/demos/default'
import SwitchDemo from '@/registry/ui/switch/demos/basic'
import TabsDemo from '@/registry/ui/tabs/demos/basic'
import { LoginForm } from '@/components/showcase/login-form'
import { Notifications } from '@/components/showcase/notifications'
import { Payment } from '@/components/showcase/payment'
import { ContrastReadout } from '@/modules/create/colors/contrast'
import {
  CURSOR_DISABLED_VAR,
  CURSOR_INTERACTIVE_VAR,
  DEFAULT_CURSOR_DISABLED,
  DEFAULT_CURSOR_INTERACTIVE,
} from '@/modules/create/cursor'
import {
  DEFAULT_RADIUS_FACTOR,
  RADIUS_FACTOR_VAR,
} from '@/modules/create/layout'
import { sendInspect, useIsEmbeddedPreview } from '@/modules/create/preset'
import type { DesignSystem } from '@/modules/create/preset'

/* ---------------------------------------------------------------------------
 * The preset overview — a style guide the way a senior designer would present a
 * brand system: an editorial spec sheet walking through every axis of the live
 * design system (color, type, icons, shape, density, elevation, components).
 *
 * Rendered inside the /create preview iframe under `DesignSystemProvider`, so
 * every swatch, ramp and component below is the live, edited system — themed by
 * CSS variables that flip with light / dark and update on every edit.
 * ------------------------------------------------------------------------- */

const DENSITY_LABEL: Record<string, string> = {
  compact: 'Compact',
  default: 'Default',
  comfortable: 'Comfortable',
}

const DENSITY_DESCRIPTION: Record<string, string> = {
  compact: 'Tight control heights and padding for dense, information-rich UIs.',
  default: 'Balanced spacing — the everyday baseline.',
  comfortable:
    'Generous padding and breathing room for a relaxed, spacious feel.',
}

/** A descriptive word for a `--radius-factor` multiplier (1 = builder default). */
function radiusLabel(factor: number): string {
  if (Number.isNaN(factor)) return 'Default'
  if (factor === 0) return 'Square'
  if (factor <= 0.5) return 'Sharp'
  if (factor < 1) return 'Tight'
  if (factor === 1) return 'Default'
  if (factor >= 2) return 'Pill'
  return 'Rounded'
}

/** Parse `#rrggbb` into HSL so the brand seed can be given a human name + tone. */
function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m?.[1]) return null
  const int = Number.parseInt(m[1], 16)
  const r = ((int >> 16) & 255) / 255
  const g = ((int >> 8) & 255) / 255
  const b = (int & 255) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  let h = 0
  let s = 0
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return { h: h * 360, s, l }
}

const HUE_NAMES: { max: number; name: string }[] = [
  { max: 15, name: 'Crimson' },
  { max: 45, name: 'Amber' },
  { max: 70, name: 'Gold' },
  { max: 100, name: 'Lime' },
  { max: 160, name: 'Emerald' },
  { max: 195, name: 'Teal' },
  { max: 255, name: 'Cobalt' },
  { max: 290, name: 'Indigo' },
  { max: 330, name: 'Violet' },
  { max: 360, name: 'Rose' },
]

/** A friendly editorial name for the brand seed — the headline of the cover. */
function describeAccent(hex: string): string {
  const hsl = hexToHsl(hex)
  if (!hsl) return 'Signature'
  if (hsl.s < 0.12) return hsl.l < 0.5 ? 'Graphite' : 'Monochrome'
  return HUE_NAMES.find((r) => hsl.h < r.max)?.name ?? 'Signature'
}

/* ------------------------------- Primitives ------------------------------- */

function SectionHeader({
  index,
  icon: Icon,
  title,
  description,
  panelId,
}: {
  index: string
  icon: typeof PaletteIcon
  title: string
  description: string
  panelId?: string
}) {
  const embedded = useIsEmbeddedPreview()
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-fg-muted">
        <Icon className="size-4" />
        <span className="font-mono text-xs tracking-widest uppercase">
          {index} — {title}
        </span>
        {/* Embedded only: hop to this chapter's controls in the /create panel. */}
        {embedded && panelId && (
          <button
            type="button"
            onClick={() => sendInspect(panelId)}
            className="ml-auto flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs opacity-0 transition-opacity group-hover/section:opacity-100 hover:bg-neutral hover:text-fg focus-visible:opacity-100"
          >
            <Settings2Icon className="size-3" />
            Adjust
          </button>
        )}
      </div>
      <p className="max-w-prose text-pretty text-fg-muted">{description}</p>
    </div>
  )
}

function Label({ children }: { children: ReactNode }) {
  return (
    <span className="text-[10px] font-medium tracking-widest text-fg-muted uppercase">
      {children}
    </span>
  )
}

/* --------------------------------- Cover ---------------------------------- */

function Cover({
  name,
  seeds,
  specs,
}: {
  name: string
  seeds: { accent: string; neutral?: string }
  specs: { label: string; value: string }[]
}) {
  return (
    <header className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
      <div className="flex flex-col gap-5">
        <span className="font-mono text-xs tracking-[0.3em] text-fg-muted uppercase">
          Design system
        </span>
        <h1 className="font-heading text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
          {name}
        </h1>
        <p className="max-w-md text-pretty text-fg-muted">
          A complete design language — color, type, shape and components — built
          live in dotUI. Every value below is your system, themed in real time.
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {specs.map((s) => (
            <Badge
              key={s.label}
              variant="neutral"
              appearance="subtle"
              size="lg"
            >
              <span className="text-fg-muted">{s.label}</span>
              <span className="font-medium text-fg">{s.value}</span>
            </Badge>
          ))}
        </div>
      </div>

      {/* Brand panel — the accent as a confident color field over its own ramp. */}
      <div className="overflow-hidden rounded-2xl border shadow-sm">
        <div
          className="flex aspect-[16/10] flex-col justify-between p-5"
          style={{
            background: 'var(--accent-700)',
            color: 'var(--on-accent-700)',
          }}
        >
          <span className="text-xs font-medium tracking-widest uppercase opacity-80">
            Brand
          </span>
          <span className="font-mono text-lg font-medium uppercase">
            {seeds.accent}
          </span>
        </div>
        <div className="flex">
          {['300', '400', '500', '600', '700', '800', '900'].map((step) => (
            <div
              key={step}
              className="h-8 flex-1"
              style={{ background: `var(--accent-${step})` }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between gap-2 border-t bg-bg px-4 py-3">
          <div className="flex items-center gap-2">
            <span
              className="size-5 rounded-full border"
              style={{ background: 'var(--neutral-500)' }}
            />
            <span className="text-sm text-fg-muted">Neutral base</span>
          </div>
          <span className="font-mono text-xs text-fg-muted uppercase">
            {seeds.neutral ?? 'Auto'}
          </span>
        </div>
      </div>
    </header>
  )
}

/* --------------------------------- Color ---------------------------------- */

function RampRow({
  palette,
  steps,
  seed,
}: {
  palette: string
  steps: string[]
  seed?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium capitalize">{palette}</span>
        {seed ? (
          <span className="font-mono text-xs text-fg-muted uppercase">
            {seed}
          </span>
        ) : null}
      </div>
      <div className="overflow-hidden rounded-lg border">
        <div className="flex">
          {steps.map((step) => (
            <div
              key={step}
              className="h-11 flex-1"
              style={{ background: `var(--${palette}-${step})` }}
              title={`--${palette}-${step}`}
            />
          ))}
        </div>
        <div className="flex border-t bg-bg">
          {steps.map((step) => (
            <span
              key={step}
              className="flex-1 py-1 text-center font-mono text-[9px] text-fg-muted tabular-nums"
            >
              {step}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

const SEMANTIC_SURFACES: { token: string; label: string }[] = [
  { token: '--color-bg', label: 'Background' },
  { token: '--color-muted', label: 'Muted' },
  { token: '--color-field', label: 'Field' },
  { token: '--color-primary', label: 'Primary' },
  { token: '--color-accent', label: 'Accent' },
  { token: '--color-inverse', label: 'Inverse' },
]

const SEMANTIC_STATUS: { token: string; label: string }[] = [
  { token: '--color-success', label: 'Success' },
  { token: '--color-warning', label: 'Warning' },
  { token: '--color-danger', label: 'Danger' },
  { token: '--color-info', label: 'Info' },
]

function TokenSwatch({ token, label }: { token: string; label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="h-14 rounded-lg border"
        style={{ background: `var(${token})` }}
      />
      <div className="flex flex-col">
        <span className="text-xs font-medium">{label}</span>
        <span className="font-mono text-[10px] text-fg-muted">{token}</span>
      </div>
    </div>
  )
}

function ColorSection({ resolved }: { resolved: Theme }) {
  const steps = [...STEPS]
  const bigRamps = ['neutral', 'accent']
  const statusRamps = PALETTE_ORDER.filter(
    (p) => !bigRamps.includes(p) && resolved.light.scales[p],
  )
  return (
    <div className="flex flex-col gap-10">
      {/* Foundational ramps */}
      <div className="grid gap-6 lg:grid-cols-2">
        {bigRamps.map((p) =>
          resolved.light.scales[p] ? (
            <RampRow key={p} palette={p} steps={steps} />
          ) : null,
        )}
      </div>

      <div className="flex flex-col gap-4">
        <Label>Status palettes</Label>
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          {statusRamps.map((p) => (
            <RampRow key={p} palette={p} steps={steps} />
          ))}
        </div>
      </div>

      {/* Semantic tokens + contrast */}
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-4">
          <Label>Semantic tokens</Label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {SEMANTIC_SURFACES.map((t) => (
              <TokenSwatch key={t.token} {...t} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {SEMANTIC_STATUS.map((t) => (
              <TokenSwatch key={t.token} {...t} />
            ))}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <ContrastReadout report={resolved.report} />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------- Typography ------------------------------- */

const TYPE_SCALE: { label: string; className: string; size: string }[] = [
  {
    label: 'Display',
    className: 'font-heading text-5xl font-semibold tracking-tight',
    size: '48',
  },
  {
    label: 'Title',
    className: 'font-heading text-3xl font-semibold tracking-tight',
    size: '30',
  },
  {
    label: 'Heading',
    className: 'font-heading text-xl font-semibold',
    size: '20',
  },
  { label: 'Body', className: 'text-base', size: '16' },
  { label: 'Small', className: 'text-sm text-fg-muted', size: '14' },
  {
    label: 'Caption',
    className: 'text-xs tracking-wide text-fg-muted uppercase',
    size: '12',
  },
]

const WEIGHTS: { label: string; className: string }[] = [
  { label: 'Regular', className: 'font-normal' },
  { label: 'Medium', className: 'font-medium' },
  { label: 'Semibold', className: 'font-semibold' },
  { label: 'Bold', className: 'font-bold' },
]

function TypographySection({
  heading,
  body,
  mono,
}: {
  heading: string
  body: string
  mono: string
}) {
  const families = [
    {
      label: 'Heading — display & titles',
      name: heading,
      sample: 'font-heading',
    },
    { label: 'Body — interface text', name: body, sample: 'font-sans' },
    { label: 'Mono — code & numerics', name: mono, sample: 'font-mono' },
  ]
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {families.map((f) => (
          <div
            key={f.label}
            className="flex items-end justify-between gap-2 rounded-xl border bg-card p-5"
          >
            <div className="flex min-w-0 flex-col gap-1">
              <Label>{f.label}</Label>
              <span className="truncate text-xl font-medium">{f.name}</span>
            </div>
            <span
              className={`${f.sample} text-5xl leading-none tracking-tight`}
            >
              Ag
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col divide-y rounded-xl border">
        {TYPE_SCALE.map((t) => (
          <div key={t.label} className="flex items-center gap-4 px-5 py-4">
            <div className="flex w-24 shrink-0 flex-col">
              <span className="text-xs font-medium">{t.label}</span>
              <span className="font-mono text-[10px] text-fg-muted tabular-nums">
                {t.size}px
              </span>
            </div>
            <p className={cn('min-w-0 truncate', t.className)}>
              The quick brown fox
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border bg-card p-5">
          <Label>Paragraph</Label>
          <p className="mt-3 text-pretty text-fg-muted">
            A design system is a shared language. Consistent color, type,
            spacing and motion let a product feel like one thing made by one
            team — reducing the thousands of small decisions down to a set of
            considered defaults, so every screen reads as unmistakably yours.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <Label>Weights</Label>
          <div className="mt-3 flex flex-col gap-1.5">
            {WEIGHTS.map((w) => (
              <div
                key={w.label}
                className="flex items-baseline justify-between"
              >
                <span className={cn('text-lg', w.className)}>Ag</span>
                <span className="text-xs text-fg-muted">{w.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* --------------------------------- Icons ---------------------------------- */

const ICON_ENTRIES = Object.entries(icons)
  .sort(([a], [b]) => a.localeCompare(b))
  .slice(0, 60)

function IconSection() {
  const library = use(IconLibraryContext)
  const libraryLabel =
    iconLibraries.find((lib) => lib.name === library)?.label ?? 'Lucide icons'
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge appearance="subtle">{libraryLabel}</Badge>
        <span className="text-sm text-fg-muted">
          A consistent 24px icon family — {Object.keys(icons).length} in the
          curated set.
        </span>
      </div>
      <div className="grid grid-cols-6 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-10 lg:grid-cols-12">
        {ICON_ENTRIES.map(([name, Icon]) => {
          const IconComponent = Icon as React.ComponentType<{
            className?: string
          }>
          return (
            <div
              key={name}
              title={name}
              className="flex aspect-square items-center justify-center bg-bg text-fg-muted transition-colors hover:text-fg"
            >
              <IconComponent className="size-5" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* --------------------------------- Shape ---------------------------------- */

const RADII: { token: string; className: string }[] = [
  { token: 'sm', className: 'rounded-sm' },
  { token: 'md', className: 'rounded-md' },
  { token: 'lg', className: 'rounded-lg' },
  { token: 'xl', className: 'rounded-xl' },
  { token: '2xl', className: 'rounded-2xl' },
  { token: '3xl', className: 'rounded-3xl' },
]

function ShapeSection({
  radiusFactor,
  radiusText,
}: {
  radiusFactor: number
  radiusText: string
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold tracking-tight tabular-nums">
            {radiusFactor.toFixed(2)}×
          </span>
          <span className="text-fg-muted">radius factor</span>
        </div>
        <Badge variant="accent" appearance="subtle" size="lg">
          {radiusText}
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {RADII.map((r) => (
          <div key={r.token} className="flex flex-col items-center gap-2">
            <div
              className={cn(
                'flex aspect-square w-full items-center justify-center border-2 border-border-control bg-card',
                r.className,
              )}
            />
            <span className="font-mono text-[10px] text-fg-muted">
              radius-{r.token}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------ Density / Space --------------------------- */

const SPACING_STEPS = [
  { label: '1', px: '4', className: 'h-1' },
  { label: '2', px: '8', className: 'h-2' },
  { label: '3', px: '12', className: 'h-3' },
  { label: '4', px: '16', className: 'h-4' },
  { label: '6', px: '24', className: 'h-6' },
  { label: '8', px: '32', className: 'h-8' },
]

function DensitySection({ density }: { density: string }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-semibold tracking-tight">
            {DENSITY_LABEL[density] ?? density}
          </span>
          <Badge appearance="subtle" size="lg">
            density
          </Badge>
        </div>
        <p className="max-w-sm text-pretty text-fg-muted">
          {DENSITY_DESCRIPTION[density]}
        </p>
        {/* Live proof — these controls adopt the density above automatically. */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-5">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg" variant="primary">
            Large
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-5">
        <Label>Spacing scale</Label>
        <div className="flex items-end gap-3">
          {SPACING_STEPS.map((s) => (
            <div
              key={s.label}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div
                className={cn('w-full rounded-sm bg-primary', s.className)}
              />
              <span className="font-mono text-[10px] text-fg-muted tabular-nums">
                {s.px}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------- Elevation -------------------------------- */

const SURFACE_LAYERS: { token: string; label: string }[] = [
  { token: '--color-bg', label: 'Base' },
  { token: '--color-card', label: 'Card' },
  { token: '--color-muted', label: 'Muted' },
  { token: '--color-inverse', label: 'Inverse' },
]

const SHADOWS: { className: string; label: string }[] = [
  { className: 'shadow-xs', label: 'xs' },
  { className: 'shadow-sm', label: 'sm' },
  { className: 'shadow-md', label: 'md' },
  { className: 'shadow-lg', label: 'lg' },
]

function ElevationSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Label>Surfaces</Label>
        <div className="grid grid-cols-2 gap-4">
          {SURFACE_LAYERS.map((s) => (
            <div
              key={s.token}
              className="flex h-24 items-end rounded-xl border p-3"
              style={{ background: `var(${s.token})` }}
            >
              <span
                className="text-xs font-medium"
                style={{
                  color:
                    s.token === '--color-inverse'
                      ? 'var(--color-fg-inverse)'
                      : 'var(--color-fg)',
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Label>Elevation</Label>
        <div className="grid grid-cols-2 gap-4">
          {SHADOWS.map((s) => (
            <div
              key={s.label}
              className={cn(
                'flex h-24 items-end rounded-xl border bg-card p-3',
                s.className,
              )}
            >
              <span className="font-mono text-xs text-fg-muted">
                shadow-{s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------- Components -------------------------------- */

function Atom({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-5">
      <Label>{title}</Label>
      <div className="flex flex-1 flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

function ComponentsSection() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Atom title="Buttons">
          <Button variant="primary">Primary</Button>
          <Button>Default</Button>
          <Button variant="quiet">Quiet</Button>
          <Button variant="danger">Danger</Button>
        </Atom>
        <Atom title="Badges">
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </Atom>
        <Atom title="Selection">
          <div className="flex flex-col gap-3">
            <SwitchDemo />
            <CheckboxDemo />
          </div>
        </Atom>
        <Atom title="Radio group">
          <RadioGroupDemo />
        </Atom>
        <Atom title="Select">
          <SelectDemo />
        </Atom>
        <Atom title="Slider">
          <div className="w-full">
            <SliderDemo />
          </div>
        </Atom>
        <Atom title="Tabs">
          <div className="w-full">
            <TabsDemo />
          </div>
        </Atom>
        <Atom title="Avatars">
          <AvatarDemo />
        </Atom>
        <Atom title="Keyboard">
          <div className="flex items-center gap-1">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </div>
        </Atom>
      </div>

      {/* Real-world compositions — the system under load. */}
      <div className="flex flex-col gap-4">
        <Label>In context</Label>
        <div className="grid items-start gap-4 lg:grid-cols-3">
          <LoginForm className="max-w-none" />
          <Notifications />
          <Payment />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------ Interaction ------------------------------- */

function InteractionSection({
  interactive,
  disabled,
}: {
  interactive: string
  disabled: string
}) {
  const items = [
    { label: 'Interactive', value: interactive },
    { label: 'Disabled', value: disabled },
  ]
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((it) => (
        <div
          key={it.label}
          className="flex items-center justify-between gap-4 rounded-xl border bg-card p-5"
        >
          <div className="flex flex-col gap-1">
            <Label>{it.label} cursor</Label>
            <span className="font-mono text-sm">{it.value}</span>
          </div>
          <div
            className="flex size-12 items-center justify-center rounded-lg border bg-bg text-fg-muted"
            style={{ cursor: it.value }}
          >
            <MousePointer2Icon className="size-5" />
          </div>
        </div>
      ))}
    </div>
  )
}

/* --------------------------------- Shell ---------------------------------- */

function Section({
  index,
  icon,
  title,
  description,
  panelId,
  children,
}: {
  index: string
  icon: typeof PaletteIcon
  title: string
  description: string
  /** The /create panel chapter these values are edited in (embedded inspect). */
  panelId?: string
  children: ReactNode
}) {
  return (
    <section className="group/section flex flex-col gap-8 border-t border-border/60 py-14 first:border-t-0 first:pt-0 sm:py-16">
      <SectionHeader
        index={index}
        icon={icon}
        title={title}
        description={description}
        panelId={panelId}
      />
      {children}
    </section>
  )
}

export function PresetOverview({
  designSystem,
}: {
  designSystem: DesignSystem
}) {
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const seeds = config.seeds

  // Fall back defensively so a bad decoded preset can't blank the overview.
  const resolved = useMemo(() => {
    try {
      return resolveColorConfigCached(config)
    } catch {
      return resolveColorConfigCached(DEFAULT_COLOR_CONFIG)
    }
  }, [config])

  const radiusFactorRaw =
    designSystem.tokens[RADIUS_FACTOR_VAR] ?? DEFAULT_RADIUS_FACTOR
  const radiusFactor = Number.parseFloat(radiusFactorRaw)
  const numericRadius = Number.isFinite(radiusFactor) ? radiusFactor : 1

  const cursorInteractive =
    designSystem.tokens[CURSOR_INTERACTIVE_VAR] ?? DEFAULT_CURSOR_INTERACTIVE
  const cursorDisabled =
    designSystem.tokens[CURSOR_DISABLED_VAR] ?? DEFAULT_CURSOR_DISABLED

  const name = describeAccent(seeds.accent)

  const bodyFamily = designSystem.tokens[FONT_SANS_VAR]
    ? familyFromStack(designSystem.tokens[FONT_SANS_VAR])
    : DEFAULT_BODY_FAMILY
  const headingFamily = designSystem.tokens[FONT_HEADING_VAR]
    ? familyFromStack(designSystem.tokens[FONT_HEADING_VAR])
    : bodyFamily
  const monoFamily = designSystem.tokens[FONT_MONO_VAR]
    ? familyFromStack(designSystem.tokens[FONT_MONO_VAR])
    : DEFAULT_MONO_FAMILY

  const specs = [
    {
      label: 'Primary',
      value: config.primary === 'accent' ? 'Accent' : 'Neutral',
    },
    {
      label: 'Density',
      value: DENSITY_LABEL[designSystem.density] ?? 'Default',
    },
    { label: 'Radius', value: radiusLabel(numericRadius) },
    {
      label: 'Type',
      value:
        headingFamily === bodyFamily
          ? bodyFamily
          : `${headingFamily} · ${bodyFamily}`,
    },
    { label: 'Icons', value: 'Lucide' },
  ]

  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:px-8 sm:py-14">
        <Cover name={name} seeds={seeds} specs={specs} />

        <Section
          index="01"
          panelId="color"
          icon={PaletteIcon}
          title="Color"
          description="Every palette is generated from a handful of seeds into perceptually even ramps, then mapped onto a semantic vocabulary that flips cleanly between light and dark."
        >
          <ColorSection resolved={resolved} />
        </Section>

        <Section
          index="02"
          panelId="typography"
          icon={TypeIcon}
          title="Typography"
          description="A heading voice for display and titles, a body face for interface text, and a matched monospace for code and numerics."
        >
          <TypographySection
            heading={headingFamily}
            body={bodyFamily}
            mono={monoFamily}
          />
        </Section>

        <Section
          index="03"
          panelId="icons"
          icon={SmileIcon}
          title="Iconography"
          description="A single, consistent icon family keeps the interface legible at every size."
        >
          <IconSection />
        </Section>

        <Section
          index="04"
          panelId="shape"
          icon={ShapesIcon}
          title="Shape"
          description="A single radius factor scales the whole corner-radius ramp at once, setting the softness of the entire system."
        >
          <ShapeSection
            radiusFactor={numericRadius}
            radiusText={radiusLabel(numericRadius)}
          />
        </Section>

        <Section
          index="05"
          panelId="shape"
          icon={RulerIcon}
          title="Density & spacing"
          description="Density sets control heights and padding across every component; the spacing scale keeps rhythm consistent."
        >
          <DensitySection density={designSystem.density} />
        </Section>

        <Section
          index="06"
          panelId="details"
          icon={LayersIcon}
          title="Surfaces & elevation"
          description="Layered surface tokens and a restrained shadow ramp give depth without noise."
        >
          <ElevationSection />
        </Section>

        <Section
          index="07"
          panelId="components"
          icon={BoxIcon}
          title="Components"
          description="The system under load — the same tokens, resolved across real components and compositions."
        >
          <ComponentsSection />
        </Section>

        <Section
          index="08"
          panelId="details"
          icon={MousePointer2Icon}
          title="Interaction"
          description="Cursors signal what's actionable and what isn't."
        >
          <InteractionSection
            interactive={cursorInteractive}
            disabled={cursorDisabled}
          />
        </Section>

        <footer className="flex items-center justify-between gap-4 border-t border-border/60 pt-8 pb-2 text-fg-muted">
          <div className="flex items-center gap-2">
            <SparklesIcon className="size-4" />
            <span className="text-sm">Built with dotUI</span>
          </div>
          <span className="font-mono text-xs tracking-widest uppercase">
            {name} · {DENSITY_LABEL[designSystem.density] ?? 'Default'}
          </span>
        </footer>
      </div>
    </div>
  )
}
