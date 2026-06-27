'use client'

import { type ReactElement, useMemo, useState } from 'react'
import { MousePointer2Icon, RotateCcwIcon } from 'lucide-react'

import { toHex } from '@dotui/colors'

import * as generatedIcons from '@/registry/__generated__/icons'
import { cn } from '@/registry/lib/utils'
import {
  DEFAULT_COLOR_CONFIG,
  PALETTE_ORDER,
  resolveColorConfig,
} from '@/registry/theme'
import { Button } from '@/registry/ui/button'

import { useDesignSystem } from '../preset'
import { useStudio } from './nav'
import {
  Group,
  Hint,
  type Option,
  OptionCard,
  PreviewFrame,
  ScreenHeader,
  SeedSwatch,
  Segmented,
  SelectField,
  SliderField,
  SwitchRow,
} from './primitives'

/* ------------------------------------------------------------------ *
 * Foundation screens (everything but color + components).
 *
 * Headline axes (radius, density, cursor, charts) drive the live preview
 * through real tokens. New axes (typography scale, elevation, motion,
 * icon weight) are wired to local UI state — the experience is complete;
 * the preview consumers land next.
 * ------------------------------------------------------------------ */

const RADIUS_FACTOR_VAR = '--radius-factor'
const CURSOR_INTERACTIVE_VAR = '--cursor-interactive'
const CURSOR_DISABLED_VAR = '--cursor-disabled'

/* ============================ Typography ============================ */

const FONTS: ReadonlyArray<Option<string>> = [
  { id: 'geist', label: 'Geist' },
  { id: 'inter', label: 'Inter' },
  { id: 'general-sans', label: 'General Sans' },
  { id: 'satoshi', label: 'Satoshi' },
  { id: 'instrument', label: 'Instrument Sans' },
  { id: 'plus-jakarta', label: 'Plus Jakarta Sans' },
  { id: 'dm-sans', label: 'DM Sans' },
  { id: 'space-grotesk', label: 'Space Grotesk' },
  { id: 'fraunces', label: 'Fraunces' },
  { id: 'newsreader', label: 'Newsreader' },
  { id: 'geist-mono', label: 'Geist Mono' },
  { id: 'jetbrains-mono', label: 'JetBrains Mono' },
]

const TYPE_SCALES: ReadonlyArray<Option<string>> = [
  { id: '1.125', label: 'Minor second · 1.125' },
  { id: '1.2', label: 'Minor third · 1.200' },
  { id: '1.25', label: 'Major third · 1.250' },
  { id: '1.333', label: 'Perfect fourth · 1.333' },
  { id: '1.414', label: 'Augmented fourth · 1.414' },
]

const WEIGHTS: ReadonlyArray<Option<string>> = [
  { id: '400', label: 'Regular' },
  { id: '500', label: 'Medium' },
  { id: '600', label: 'Semibold' },
  { id: '700', label: 'Bold' },
]

export function TypographyScreen() {
  const { pop } = useStudio()
  const [heading, setHeading] = useState('geist')
  const [body, setBody] = useState('geist')
  const [mono, setMono] = useState('geist-mono')
  const [scale, setScale] = useState('1.25')
  const [headingWeight, setHeadingWeight] = useState('600')
  const [bodyWeight, setBodyWeight] = useState('400')
  const [tracking, setTracking] = useState(0)

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title="Typography" onBack={pop} />

      <PreviewFrame className="flex-col items-start gap-2 p-5">
        <p
          className="font-heading text-2xl leading-tight tracking-tight"
          style={{
            fontWeight: Number(headingWeight),
            letterSpacing: `${tracking}em`,
          }}
        >
          Ship your brand
        </p>
        <p className="font-body text-sm text-fg-muted">
          A complete type system, paired and scaled for you.
        </p>
      </PreviewFrame>

      <Group label="Typefaces">
        <SelectField
          label="Heading"
          value={heading}
          onChange={setHeading}
          options={FONTS}
        />
        <SelectField
          label="Body"
          value={body}
          onChange={setBody}
          options={FONTS}
        />
        <SelectField
          label="Mono"
          value={mono}
          onChange={setMono}
          options={FONTS}
        />
      </Group>

      <Group label="Scale & rhythm">
        <SelectField
          label="Type scale"
          value={scale}
          onChange={setScale}
          options={TYPE_SCALES}
        />
        <SliderField
          label="Letter spacing"
          value={tracking}
          minValue={-0.05}
          maxValue={0.1}
          step={0.005}
          onChange={setTracking}
          format={(v) => `${v >= 0 ? '+' : ''}${(v * 100).toFixed(1)}%`}
        />
      </Group>

      <Group label="Weights">
        <SelectField
          label="Heading weight"
          value={headingWeight}
          onChange={setHeadingWeight}
          options={WEIGHTS}
        />
        <SelectField
          label="Body weight"
          value={bodyWeight}
          onChange={setBodyWeight}
          options={WEIGHTS}
        />
      </Group>
    </div>
  )
}

/* ============================== Shape =============================== */

const RADIUS_STEPS: ReadonlyArray<{ label: string; rem: number }> = [
  { label: 'none', rem: 0 },
  { label: 'sm', rem: 0.25 },
  { label: 'md', rem: 0.5 },
  { label: 'lg', rem: 0.75 },
  { label: 'xl', rem: 1 },
  { label: 'full', rem: 2 },
]

export function ShapeScreen() {
  const { pop } = useStudio()
  const { designSystem, setToken } = useDesignSystem()
  const raw = designSystem.tokens[RADIUS_FACTOR_VAR] ?? '1'
  const factor = Number.parseFloat(raw)
  const f = Number.isFinite(factor) ? factor : 1

  const personality = f <= 0.05 ? 'sharp' : f >= 1.8 ? 'pill' : 'rounded'

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title="Shape & radius" onBack={pop} />

      <PreviewFrame>
        <div
          className="size-12 border-2 border-primary"
          style={{ borderRadius: `calc(0.75rem * ${f})` }}
        />
        <Button style={{ borderRadius: `calc(0.5rem * ${f})` }}>Button</Button>
        <div
          className="size-12 bg-primary"
          style={{ borderRadius: `calc(0.75rem * ${f})` }}
        />
      </PreviewFrame>

      <Segmented
        label="Personality"
        value={personality}
        onChange={(p) =>
          setToken(
            RADIUS_FACTOR_VAR,
            p === 'sharp' ? '0' : p === 'pill' ? '2' : '1',
          )
        }
        options={[
          { id: 'sharp', label: 'Sharp' },
          { id: 'rounded', label: 'Rounded' },
          { id: 'pill', label: 'Pill' },
        ]}
      />

      <SliderField
        label="Radius scale"
        value={f}
        minValue={0}
        maxValue={2}
        step={0.05}
        onChange={(v) => setToken(RADIUS_FACTOR_VAR, String(v))}
        format={(v) => `${v.toFixed(2)}×`}
        hint="Multiplies every radius token across the system."
      />

      <Group label="Radius ramp">
        <div className="flex items-end justify-between gap-2">
          {RADIUS_STEPS.map((step) => (
            <div
              key={step.label}
              className="flex flex-1 flex-col items-center gap-1.5"
            >
              <div
                className="h-9 w-full bg-muted"
                style={{ borderRadius: `${step.rem * f}rem` }}
              />
              <span className="text-[9px] text-fg-muted">{step.label}</span>
            </div>
          ))}
        </div>
      </Group>
    </div>
  )
}

/* ============================= Density ============================= */

export function DensityScreen() {
  const { pop } = useStudio()
  const { designSystem, setDensity } = useDesignSystem()
  const density = designSystem.density
  const [spacing, setSpacing] = useState(1)

  const gap = density === 'compact' ? 6 : density === 'default' ? 10 : 16
  const pad = density === 'compact' ? 8 : density === 'default' ? 12 : 18

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title="Spacing & density" onBack={pop} />

      <PreviewFrame className="items-stretch">
        <div className="flex flex-1 flex-col" style={{ gap }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-md border bg-bg"
              style={{ padding: pad }}
            >
              <div className="size-2 rounded-full bg-primary" />
              <div className="h-1.5 flex-1 rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </PreviewFrame>

      <Segmented
        label="Density"
        value={density}
        onChange={setDensity}
        options={[
          { id: 'compact', label: 'Compact' },
          { id: 'default', label: 'Default' },
          { id: 'comfortable', label: 'Comfy' },
        ]}
      />

      <SliderField
        label="Spacing scale"
        value={spacing}
        minValue={0.75}
        maxValue={1.5}
        step={0.05}
        onChange={setSpacing}
        format={(v) => `${v.toFixed(2)}×`}
        hint="Stretches or tightens the spacing ramp globally."
      />
    </div>
  )
}

/* ============================ Elevation ============================ */

const ELEVATION_STYLES = [
  { id: 'flat', label: 'Flat', desc: 'Borders, no shadow' },
  { id: 'soft', label: 'Soft', desc: 'Gentle ambient depth' },
  { id: 'crisp', label: 'Crisp', desc: 'Tight, defined shadow' },
  { id: 'layered', label: 'Layered', desc: 'Stacked, lifted' },
] as const

type ElevationStyle = (typeof ELEVATION_STYLES)[number]['id']

function shadowFor(
  style: ElevationStyle,
  strength: number,
  level: number,
): string {
  const a = strength * (0.06 + level * 0.05)
  switch (style) {
    case 'flat':
      return 'none'
    case 'soft':
      return `0 ${2 + level * 4}px ${8 + level * 10}px rgba(0,0,0,${a})`
    case 'crisp':
      return `0 ${1 + level}px ${2 + level * 2}px rgba(0,0,0,${a * 1.6})`
    case 'layered':
      return `0 1px 2px rgba(0,0,0,${a}), 0 ${4 + level * 4}px ${
        10 + level * 8
      }px rgba(0,0,0,${a})`
    default:
      return 'none'
  }
}

export function ElevationScreen() {
  const { pop } = useStudio()
  const [style, setStyle] = useState<ElevationStyle>('soft')
  const [strength, setStrength] = useState(1)
  const [tint, setTint] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title="Elevation" onBack={pop} />

      <PreviewFrame className="gap-4 bg-muted/60">
        {[0, 1, 2].map((level) => (
          <div
            key={level}
            className={cn(
              'flex size-14 items-center justify-center rounded-lg bg-bg text-xs text-fg-muted',
              style === 'flat' && 'border',
            )}
            style={{ boxShadow: shadowFor(style, strength, level) }}
          >
            {level + 1}
          </div>
        ))}
      </PreviewFrame>

      <Group label="Shadow language">
        <div className="grid grid-cols-2 gap-2">
          {ELEVATION_STYLES.map((s) => (
            <OptionCard
              key={s.id}
              selected={style === s.id}
              onPress={() => setStyle(s.id)}
            >
              <span className="text-sm font-medium">{s.label}</span>
              <span className="text-xs text-fg-muted">{s.desc}</span>
            </OptionCard>
          ))}
        </div>
      </Group>

      <SliderField
        label="Strength"
        value={strength}
        minValue={0}
        maxValue={2}
        step={0.1}
        onChange={setStrength}
        format={(v) => `${v.toFixed(1)}×`}
      />
      <SwitchRow
        label="Tinted shadows"
        hint="Bleed the brand hue into shadow color."
        value={tint}
        onChange={setTint}
      />
    </div>
  )
}

/* ============================== Motion ============================= */

const SPEEDS: ReadonlyArray<Option<string>> = [
  { id: 'instant', label: 'Instant' },
  { id: 'snappy', label: 'Snappy' },
  { id: 'smooth', label: 'Smooth' },
  { id: 'expressive', label: 'Lively' },
]

const EASINGS = [
  { id: 'standard', label: 'Standard', curve: 'cubic-bezier(0.2, 0, 0, 1)' },
  {
    id: 'emphasized',
    label: 'Emphasized',
    curve: 'cubic-bezier(0.3, 0, 0, 1.2)',
  },
  { id: 'bounce', label: 'Bounce', curve: 'cubic-bezier(0.5, 1.6, 0.4, 1)' },
] as const

export function MotionScreen() {
  const { pop } = useStudio()
  const [speed, setSpeed] = useState('smooth')
  const [easing, setEasing] =
    useState<(typeof EASINGS)[number]['id']>('standard')
  const [hover, setHover] = useState('lift')

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title="Motion" onBack={pop} />

      <PreviewFrame>
        <span className="text-xs text-fg-muted">Hover the button →</span>
        <Button
          className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          style={{
            transitionTimingFunction: EASINGS.find((e) => e.id === easing)
              ?.curve,
          }}
        >
          Press me
        </Button>
      </PreviewFrame>

      <Segmented
        label="Speed"
        value={speed}
        onChange={setSpeed}
        options={SPEEDS}
      />

      <Group label="Easing">
        <div className="grid grid-cols-3 gap-2">
          {EASINGS.map((e) => (
            <OptionCard
              key={e.id}
              selected={easing === e.id}
              onPress={() => setEasing(e.id)}
            >
              <EasingCurve curve={e.curve} active={easing === e.id} />
              <span className="text-[11px] font-medium">{e.label}</span>
            </OptionCard>
          ))}
        </div>
      </Group>

      <SelectField
        label="Hover effect"
        value={hover}
        onChange={setHover}
        options={[
          { id: 'none', label: 'None' },
          { id: 'lift', label: 'Lift' },
          { id: 'glow', label: 'Glow' },
          { id: 'scale', label: 'Scale' },
        ]}
      />
      <Hint>
        Respects the user&rsquo;s reduced-motion preference automatically.
      </Hint>
    </div>
  )
}

function EasingCurve({ curve, active }: { curve: string; active: boolean }) {
  // Translate the cubic-bezier control points into an SVG path for a glanceable shape.
  const m = curve.match(/cubic-bezier\(([^)]+)\)/)
  const [x1, y1, x2, y2] = (m?.[1] ?? '0,0,1,1').split(',').map(Number)
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-full">
      <path
        d={`M 2 30 C ${2 + (x1 ?? 0) * 28} ${30 - (y1 ?? 0) * 28}, ${
          2 + (x2 ?? 1) * 28
        } ${30 - (y2 ?? 1) * 28}, 30 2`}
        fill="none"
        className={active ? 'stroke-primary' : 'stroke-fg-muted'}
        strokeWidth={1.75}
        strokeLinecap="round"
      />
    </svg>
  )
}

/* =========================== Iconography =========================== */

const ICON_LIBRARIES = [
  { id: 'lucide', label: 'Lucide', desc: 'Clean & consistent' },
  { id: 'remix', label: 'Remix', desc: 'Neutral & versatile' },
  { id: 'tabler', label: 'Tabler', desc: '5,000+ icons' },
  { id: 'phosphor', label: 'Phosphor', desc: 'Flexible weights' },
  { id: 'hugeicons', label: 'Hugeicons', desc: 'Modern & bold' },
] as const

export function IconsScreen() {
  const { pop } = useStudio()
  const [library, setLibrary] = useState<string>('lucide')
  const [stroke, setStroke] = useState(2)
  const [size, setSize] = useState(20)

  const sample = useMemo(
    () =>
      Object.entries(generatedIcons)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(0, 24)
        .map(([name, Icon]) => [name, Icon] as const),
    [],
  )

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title="Iconography" onBack={pop} />

      <PreviewFrame className="flex-wrap gap-3">
        {sample.slice(0, 12).map(([name, Icon]) => (
          <Icon
            key={name}
            style={{ width: size, height: size, strokeWidth: stroke }}
            className="text-fg"
          />
        ))}
      </PreviewFrame>

      <Group label="Library">
        <div className="grid grid-cols-2 gap-2">
          {ICON_LIBRARIES.map((lib) => (
            <OptionCard
              key={lib.id}
              selected={library === lib.id}
              onPress={() => setLibrary(lib.id)}
            >
              <span className="text-sm font-medium">{lib.label}</span>
              <span className="text-xs text-fg-muted">{lib.desc}</span>
            </OptionCard>
          ))}
        </div>
      </Group>

      <SliderField
        label="Stroke width"
        value={stroke}
        minValue={1}
        maxValue={2.5}
        step={0.25}
        onChange={setStroke}
        format={(v) => v.toFixed(2)}
      />
      <SliderField
        label="Default size"
        value={size}
        minValue={14}
        maxValue={28}
        step={1}
        onChange={setSize}
        format={(v) => `${v}px`}
      />
    </div>
  )
}

/* ============================== Cursor ============================= */

const CURSOR_OPTIONS: ReadonlyArray<Option<string>> = [
  { id: 'default', label: 'Default' },
  { id: 'pointer', label: 'Pointer' },
  { id: 'text', label: 'Text' },
  { id: 'not-allowed', label: 'Not allowed' },
  { id: 'wait', label: 'Wait' },
  { id: 'progress', label: 'Progress' },
  { id: 'help', label: 'Help' },
  { id: 'crosshair', label: 'Crosshair' },
  { id: 'move', label: 'Move' },
  { id: 'grab', label: 'Grab' },
]

export function CursorScreen() {
  const { pop } = useStudio()
  const { designSystem, setToken } = useDesignSystem()
  const interactive = designSystem.tokens[CURSOR_INTERACTIVE_VAR] ?? 'default'
  const disabled = designSystem.tokens[CURSOR_DISABLED_VAR] ?? 'not-allowed'

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title="Cursors" onBack={pop} />

      <PreviewFrame className="gap-6">
        {[
          { label: 'Interactive', cursor: interactive },
          { label: 'Disabled', cursor: disabled },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-2">
            <div
              className="flex size-12 items-center justify-center rounded-lg border bg-bg text-fg-muted"
              style={{ cursor: item.cursor }}
            >
              <MousePointer2Icon className="size-4" />
            </div>
            <span className="text-[10px] text-fg-muted">{item.label}</span>
          </div>
        ))}
      </PreviewFrame>

      <SelectField
        label="Interactive"
        value={interactive}
        onChange={(v) => setToken(CURSOR_INTERACTIVE_VAR, v)}
        options={CURSOR_OPTIONS}
      />
      <SelectField
        label="Disabled"
        value={disabled}
        onChange={(v) => setToken(CURSOR_DISABLED_VAR, v)}
        options={CURSOR_OPTIONS}
      />
    </div>
  )
}

/* ============================== Charts ============================= */

export function ChartsScreen() {
  const { pop } = useStudio()
  const { designSystem, setToken } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG

  const derived = useMemo(() => {
    const resolved = resolveColorConfig(config)
    const order = PALETTE_ORDER.filter((p) => p !== 'neutral')
    return order.map((p) => {
      const ramp = resolved.light[p]
      const v = ramp?.['500'] ?? ramp?.['400'] ?? '#888888'
      try {
        return toHex(v)
      } catch {
        return '#888888'
      }
    })
  }, [config])

  const colors = [1, 2, 3, 4, 5].map(
    (n, i) => designSystem.tokens[`--chart-${n}`] ?? derived[i] ?? '#888888',
  )

  const matchTheme = () => {
    ;[1, 2, 3, 4, 5].forEach((n, i) =>
      setToken(`--chart-${n}`, derived[i] ?? '#888888'),
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Data & charts"
        onBack={pop}
        action={
          <Button variant="quiet" size="sm" onPress={matchTheme}>
            <RotateCcwIcon className="size-3.5" />
            Match theme
          </Button>
        }
      />

      <PreviewFrame className="items-end gap-2 p-4">
        {[0.5, 0.85, 0.65, 1, 0.75].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm"
            style={{ height: `${h * 64}px`, backgroundColor: colors[i] }}
          />
        ))}
      </PreviewFrame>

      <Group
        label="Categorical palette"
        hint="Used across bars, lines, slices and points."
      >
        <div className="grid grid-cols-2 gap-x-3 gap-y-4">
          {[1, 2, 3, 4, 5].map((n, i) => (
            <SeedSwatch
              key={n}
              label={`Series ${n}`}
              value={colors[i] ?? '#888888'}
              onChange={(hex) => setToken(`--chart-${n}`, hex)}
            />
          ))}
        </div>
      </Group>
    </div>
  )
}

/* ----------------------------- Registry ----------------------------- */

export const FOUNDATION_SCREENS: Record<string, () => ReactElement> = {
  typography: TypographyScreen,
  shape: ShapeScreen,
  density: DensityScreen,
  elevation: ElevationScreen,
  motion: MotionScreen,
  icons: IconsScreen,
  cursor: CursorScreen,
  charts: ChartsScreen,
}
