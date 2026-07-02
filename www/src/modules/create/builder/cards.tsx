'use client'

import {
  DicesIcon,
  LayersIcon,
  MoonIcon,
  MousePointer2Icon,
  RulerIcon,
  ShapesIcon,
  SmileIcon,
  SparklesIcon,
  TypeIcon,
  ZapIcon,
} from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { Switch } from '@/registry/ui/switch'

import {
  CURSOR_DISABLED_VAR,
  CURSOR_INTERACTIVE_VAR,
  CursorConfig,
} from '../cursor'
import { IconographyConfig } from '../iconography'
import {
  DEFAULT_RADIUS_FACTOR,
  DensityConfig,
  RADIUS_FACTOR_VAR,
  RadiusConfig,
} from '../layout'
import { useReroll } from '../panel/macros'
import { BindingDot, Segmented, ValueSlider } from '../panel/primitives'
import { SeedField } from '../panel/schema'
import { useDesignSystem } from '../preset'
import type { Density } from '../preset'
import { TypographyConfig } from '../typography'
import { AspectCard, Field, MicroGroup, Readout, Swatch } from './atoms'

/* ----------------------------- token helpers ----------------------------- */

/** Read/write a global token. Stub vars (--ds-*) are harmless until a component reads them. */
function useToken(name: string, fallback: string) {
  const { designSystem, setToken } = useDesignSystem()
  const value = designSystem.tokens[name] ?? fallback
  return [value, (v: string) => setToken(name, v)] as const
}

/* ------------------------------- Brand card ------------------------------ */

interface Vibe {
  id: string
  label: string
  accent: string
  radius: string
  density: Density
}

const VIBES: Vibe[] = [
  {
    id: 'minimal',
    label: 'Minimal',
    accent: '#171717',
    radius: '0.4',
    density: 'compact',
  },
  {
    id: 'corporate',
    label: 'Corporate',
    accent: '#2563eb',
    radius: '0.6',
    density: 'default',
  },
  {
    id: 'playful',
    label: 'Playful',
    accent: '#f43f5e',
    radius: '1.6',
    density: 'comfortable',
  },
  {
    id: 'editorial',
    label: 'Editorial',
    accent: '#0f766e',
    radius: '0.25',
    density: 'comfortable',
  },
  {
    id: 'vivid',
    label: 'Vivid',
    accent: '#7c3aed',
    radius: '1',
    density: 'default',
  },
  {
    id: 'warm',
    label: 'Warm',
    accent: '#ea580c',
    radius: '1',
    density: 'default',
  },
]

export function BrandCard() {
  const { designSystem, setDesignSystem } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const accent = config.seeds.accent ?? DEFAULT_COLOR_CONFIG.seeds.accent
  const radius = designSystem.tokens[RADIUS_FACTOR_VAR] ?? '1'
  const reroll = useReroll()

  // One transaction so a vibe lands as a single undo entry.
  function applyVibe(v: Vibe) {
    setDesignSystem((prev) => {
      const base = prev.color ?? DEFAULT_COLOR_CONFIG
      return {
        ...prev,
        density: v.density,
        tokens: { ...prev.tokens, [RADIUS_FACTOR_VAR]: v.radius },
        color: { ...base, seeds: { ...base.seeds, accent: v.accent } },
      }
    })
  }

  const activeVibe = VIBES.find(
    (v) =>
      v.accent.toLowerCase() === accent.toLowerCase() &&
      v.radius === radius &&
      v.density === designSystem.density,
  )?.id

  return (
    <AspectCard
      id="brand"
      icon={SparklesIcon}
      title="Brand"
      accent
      readout={
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-fg-muted tabular-nums">
            {accent}
          </span>
          <Swatch color={accent} />
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <Field
          label="Brand color"
          binding="live"
          hint="Seed one color — the entire system regenerates from it."
        >
          <SeedField seed="accent" />
        </Field>

        <Field label="Vibe">
          <div className="flex flex-wrap gap-1.5">
            {VIBES.map((v) => (
              <ButtonPrimitives.Button
                key={v.id}
                onPress={() => applyVibe(v)}
                className={cn(
                  'group flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs focus-reset transition-[colors,transform] hover:bg-neutral focus-visible:focus-ring active:scale-[0.97]',
                  activeVibe === v.id &&
                    'text-primary-fg border-transparent bg-primary',
                )}
              >
                <span
                  className="size-2.5 rounded-full ring-1 ring-black/10 ring-inset"
                  style={{ backgroundColor: v.accent }}
                />
                {v.label}
              </ButtonPrimitives.Button>
            ))}
          </div>
        </Field>

        <Button
          size="sm"
          variant="default"
          onPress={reroll}
          className="gap-1.5 self-start"
        >
          <DicesIcon data-icon-start="" />
          Surprise me
        </Button>
      </div>
    </AspectCard>
  )
}

/* ----------------------------- Typography card --------------------------- */

export function TypographyCard() {
  const [heading] = useToken('--ds-font-heading', 'Geist')
  const [scale, setScale] = useToken('--ds-type-scale', '1.25')
  const [base, setBase] = useToken('--ds-type-base', '16')

  return (
    <AspectCard
      id="typography"
      icon={TypeIcon}
      title="Typography"
      readout={
        <div className="flex items-center gap-2">
          <Readout value={heading} />
          <span className="font-heading text-lg leading-none">Ag</span>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <TypographyConfig />
        <MicroGroup>
          <Field label="Scale ratio" binding="stub">
            <ValueSlider
              ariaLabel="Type scale ratio"
              value={Number.parseFloat(scale) || 1.25}
              min={1.1}
              max={1.5}
              step={0.01}
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
        </MicroGroup>
      </div>
    </AspectCard>
  )
}

/* ------------------------------- Shape card ------------------------------ */

export function ShapeCard() {
  const [radius, setRadius] = useToken(RADIUS_FACTOR_VAR, DEFAULT_RADIUS_FACTOR)
  const [border, setBorder] = useToken('--ds-border-width', '1')
  const factor = Number.parseFloat(radius) || 1

  return (
    <AspectCard
      id="shape"
      icon={ShapesIcon}
      title="Shape"
      readout={
        <div className="flex items-center gap-2">
          <Readout value={`${factor.toFixed(2)}×`} mono />
          <span
            className="size-5 border border-fg-muted/60"
            style={{ borderRadius: `calc(0.5rem * ${factor})` }}
          />
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <Field
          label="Radius factor"
          binding="live"
          hint="Scales the whole corner-radius ramp."
        >
          <RadiusConfig value={radius} onChange={setRadius} />
        </Field>
        <MicroGroup>
          <Field label="Border width" binding="stub">
            <ValueSlider
              ariaLabel="Border width"
              value={Number.parseFloat(border) || 1}
              min={0}
              max={3}
              step={0.5}
              format={(v) => `${v}px`}
              onChange={(v) => setBorder(String(v))}
            />
          </Field>
        </MicroGroup>
      </div>
    </AspectCard>
  )
}

/* ------------------------------ Density card ----------------------------- */

export function DensityCard() {
  const { designSystem, setDensity } = useDesignSystem()
  const [spacing, setSpacing] = useToken('--ds-spacing-scale', '1')
  const gap =
    designSystem.density === 'compact'
      ? 3
      : designSystem.density === 'default'
        ? 5
        : 8

  return (
    <AspectCard
      id="density"
      icon={RulerIcon}
      title="Density & spacing"
      readout={
        <div className="flex items-center gap-2">
          <Readout value={designSystem.density} />
          <span
            className="flex flex-col items-end"
            style={{ gap: `${gap - 2}px` }}
          >
            <span className="h-[2px] w-5 rounded-full bg-fg-muted" />
            <span className="h-[2px] w-5 rounded-full bg-fg-muted" />
            <span className="h-[2px] w-5 rounded-full bg-fg-muted" />
          </span>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <Field
          label="Density"
          binding="live"
          hint="Global control heights, gaps and padding."
        >
          <DensityConfig value={designSystem.density} onChange={setDensity} />
        </Field>
        <MicroGroup>
          <Field label="Spacing scale" binding="stub">
            <ValueSlider
              ariaLabel="Spacing scale"
              value={Number.parseFloat(spacing) || 1}
              min={0.75}
              max={1.5}
              step={0.05}
              format={(v) => `${v.toFixed(2)}×`}
              onChange={(v) => setSpacing(String(v))}
            />
          </Field>
        </MicroGroup>
      </div>
    </AspectCard>
  )
}

/* ----------------------------- Elevation card ---------------------------- */

const ELEVATIONS = [
  { value: 'flat', label: 'Flat' },
  { value: 'soft', label: 'Soft' },
  { value: 'depth', label: '3D' },
  { value: 'glass', label: 'Glass' },
] as const

export function ElevationCard() {
  const [style, setStyle] = useToken('--ds-elevation-style', 'soft')
  const [shadow, setShadow] = useToken('--ds-shadow-intensity', '0.5')
  const [blur, setBlur] = useToken('--ds-backdrop-blur', '0')

  return (
    <AspectCard
      id="elevation"
      icon={LayersIcon}
      title="Elevation"
      readout={
        <div className="flex items-center gap-2">
          <Readout
            value={ELEVATIONS.find((e) => e.value === style)?.label ?? style}
          />
          <span className="size-5 rounded-md border bg-card shadow-md" />
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <Field
          label="Style family"
          binding="stub"
          hint="The big re-skin: flat, soft, 3D or glass."
        >
          <Segmented
            ariaLabel="Style family"
            value={style}
            onChange={setStyle}
            options={ELEVATIONS}
          />
        </Field>
        <MicroGroup>
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
          <Field
            label="Backdrop blur"
            binding="stub"
            hint="Frost behind overlays and menus."
          >
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
        </MicroGroup>
      </div>
    </AspectCard>
  )
}

/* ------------------------------- Motion card ----------------------------- */

export function MotionCard() {
  const [duration, setDuration] = useToken('--ds-motion-duration', '150')
  const [enabled, setEnabled] = useToken('--ds-motion-enabled', 'true')
  const [reduced, setReduced] = useToken('--ds-reduced-motion', 'true')

  return (
    <AspectCard
      id="motion"
      icon={ZapIcon}
      title="Motion"
      readout={
        <Readout value={`${Number.parseFloat(duration) || 150}ms`} mono />
      }
    >
      <div className="flex flex-col gap-4">
        <Field
          label="Duration scale"
          binding="stub"
          hint="Baseline transition speed."
        >
          <ValueSlider
            ariaLabel="Duration scale"
            value={Number.parseFloat(duration) || 150}
            min={0}
            max={400}
            step={10}
            format={(v) => `${v}ms`}
            onChange={(v) => setDuration(String(v))}
          />
        </Field>
        <MicroGroup>
          <SwitchField
            label="Animations"
            binding="stub"
            value={enabled === 'true'}
            onChange={(v) => setEnabled(String(v))}
          />
          <SwitchField
            label="Respect reduced-motion"
            binding="stub"
            value={reduced === 'true'}
            onChange={(v) => setReduced(String(v))}
          />
        </MicroGroup>
      </div>
    </AspectCard>
  )
}

/* ---------------------------- Interaction card --------------------------- */

export function InteractionCard() {
  const { designSystem, setToken } = useDesignSystem()
  const interactive = designSystem.tokens[CURSOR_INTERACTIVE_VAR] ?? 'default'
  const disabled = designSystem.tokens[CURSOR_DISABLED_VAR] ?? 'not-allowed'
  const [ring, setRing] = useToken('--ds-focus-ring', '2')

  return (
    <AspectCard
      id="interaction"
      icon={MousePointer2Icon}
      title="Interaction"
      readout={
        <div
          className="flex size-5 items-center justify-center rounded-md border text-fg-muted"
          style={{ cursor: interactive }}
        >
          <MousePointer2Icon className="size-3" />
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Cursors" binding="live">
          <CursorConfig
            interactive={interactive}
            disabled={disabled}
            onChange={setToken}
          />
        </Field>
        <MicroGroup>
          <Field label="Focus-ring width" binding="stub">
            <ValueSlider
              ariaLabel="Focus ring width"
              value={Number.parseFloat(ring) || 2}
              min={0}
              max={4}
              step={1}
              format={(v) => `${v}px`}
              onChange={(v) => setRing(String(v))}
            />
          </Field>
        </MicroGroup>
      </div>
    </AspectCard>
  )
}

/* ------------------------------- Icons card ------------------------------ */

export function IconsCard() {
  const [stroke, setStroke] = useToken('--ds-icon-stroke', '2')

  return (
    <AspectCard
      id="icons"
      icon={SmileIcon}
      title="Icons"
      readout={
        <Readout
          caption="Lucide"
          value={`${Number.parseFloat(stroke) || 2}px`}
          mono
        />
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Icon library" binding="stub">
          <IconographyConfig />
        </Field>
        <MicroGroup>
          <Field label="Stroke width" binding="stub">
            <ValueSlider
              ariaLabel="Icon stroke"
              value={Number.parseFloat(stroke) || 2}
              min={1}
              max={2.5}
              step={0.25}
              format={(v) => `${v}px`}
              onChange={(v) => setStroke(String(v))}
            />
          </Field>
        </MicroGroup>
      </div>
    </AspectCard>
  )
}

/* ------------------------------- Modes card ------------------------------ */

const MODES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'Auto' },
] as const

export function ModesCard() {
  const [mode, setMode] = useToken('--ds-default-mode', 'system')

  return (
    <AspectCard
      id="modes"
      icon={MoonIcon}
      title="Modes"
      readout={
        <Readout value={MODES.find((m) => m.value === mode)?.label ?? mode} />
      }
    >
      <Field
        label="Default mode"
        binding="stub"
        hint="Which mode the exported system boots in."
      >
        <Segmented
          ariaLabel="Default mode"
          value={mode}
          onChange={setMode}
          options={MODES}
        />
      </Field>
    </AspectCard>
  )
}

/* -------------------------------- helpers -------------------------------- */

function SwitchField({
  label,
  binding,
  value,
  onChange,
}: {
  label: string
  binding: 'live' | 'stub'
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-1.5">
        <span className="text-[13px] font-medium text-fg">{label}</span>
        <BindingDot binding={binding} />
      </div>
      <Switch
        isSelected={value}
        onChange={onChange}
        aria-label={label}
        size="sm"
      />
    </div>
  )
}
