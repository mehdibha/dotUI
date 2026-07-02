'use client'

import {
  BriefcaseIcon,
  GlassWaterIcon,
  MinusIcon,
  NewspaperIcon,
  SmileIcon,
  WandSparklesIcon,
  ZapIcon,
} from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import type { Density } from '@/registry/types'

import { DEFAULT_RADIUS_FACTOR, RADIUS_FACTOR_VAR } from '../../layout'
import { useDesignSystem } from '../../preset'
import { Field, Section, SwatchButton } from '../primitives'
import { useStudio } from '../store'
import { ELEVATION_STYLE_VAR } from '../tokens'

interface Vibe {
  id: string
  label: string
  description: string
  icon: typeof MinusIcon
  accent: string
  radius: number
  density: Density
  elevation: string
}

const VIBES: Vibe[] = [
  {
    id: 'minimal',
    label: 'Minimal',
    description: 'Tight, flat, restrained',
    icon: MinusIcon,
    accent: '#2563eb',
    radius: 0.5,
    density: 'compact',
    elevation: 'flat',
  },
  {
    id: 'bold',
    label: 'Bold',
    description: 'High-contrast & punchy',
    icon: ZapIcon,
    accent: '#f43f5e',
    radius: 1,
    density: 'default',
    elevation: 'depth',
  },
  {
    id: 'playful',
    label: 'Playful',
    description: 'Round, airy, friendly',
    icon: SmileIcon,
    accent: '#8b5cf6',
    radius: 2,
    density: 'comfortable',
    elevation: 'soft',
  },
  {
    id: 'corporate',
    label: 'Corporate',
    description: 'Trustworthy & calm',
    icon: BriefcaseIcon,
    accent: '#0ea5e9',
    radius: 0.5,
    density: 'default',
    elevation: 'soft',
  },
  {
    id: 'editorial',
    label: 'Editorial',
    description: 'Warm, spacious, serif',
    icon: NewspaperIcon,
    accent: '#b45309',
    radius: 0.25,
    density: 'comfortable',
    elevation: 'flat',
  },
  {
    id: 'glass',
    label: 'Soft glass',
    description: 'Frosted & translucent',
    icon: GlassWaterIcon,
    accent: '#06b6d4',
    radius: 1.5,
    density: 'default',
    elevation: 'glass',
  },
]

export function BrandInspector() {
  const { setOnboardingOpen } = useStudio()
  const { designSystem, setDesignSystem, setColorSeed } = useDesignSystem()
  const accent =
    designSystem.color?.seeds.accent ?? DEFAULT_COLOR_CONFIG.seeds.accent
  const activeRadius =
    designSystem.tokens[RADIUS_FACTOR_VAR] ?? DEFAULT_RADIUS_FACTOR
  const activeElevation = designSystem.tokens[ELEVATION_STYLE_VAR]

  function applyVibe(vibe: Vibe) {
    setDesignSystem((prev) => {
      const base = prev.color ?? DEFAULT_COLOR_CONFIG
      return {
        ...prev,
        density: vibe.density,
        tokens: {
          ...prev.tokens,
          [RADIUS_FACTOR_VAR]: String(vibe.radius),
          [ELEVATION_STYLE_VAR]: vibe.elevation,
        },
        color: { ...base, seeds: { ...base.seeds, accent: vibe.accent } },
      }
    })
  }

  function isActive(vibe: Vibe) {
    return (
      accent.toLowerCase() === vibe.accent.toLowerCase() &&
      Number.parseFloat(activeRadius) === vibe.radius &&
      designSystem.density === vibe.density &&
      activeElevation === vibe.elevation
    )
  }

  return (
    <div className="flex flex-col gap-7">
      {/* The generator front door. */}
      <button
        type="button"
        onClick={() => setOnboardingOpen(true)}
        className="group/gen relative flex w-full items-center gap-3 overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/12 to-primary/5 p-4 text-left transition-colors hover:from-primary/18"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-fg-on-primary shadow-sm">
          <WandSparklesIcon className="size-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Generate from brand</span>
          <span className="text-[11px] text-fg-muted">
            One color, a logo or a URL → a full system
          </span>
        </div>
      </button>

      <Section title="Brand color">
        <Field label="Primary seed" live hint="Drives the accent ramps live.">
          <SwatchButton
            ariaLabel="Brand color"
            value={accent}
            onChange={(hex) => setColorSeed('accent', hex)}
          />
        </Field>
      </Section>

      <Section title="Personality">
        <p className="-mt-1 text-xs text-fg-muted">
          Each vibe sets color, radius, density and depth together.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {VIBES.map((vibe) => {
            const active = isActive(vibe)
            return (
              <ButtonPrimitives.Button
                key={vibe.id}
                onPress={() => applyVibe(vibe)}
                className={cn(
                  'flex flex-col items-start gap-2 rounded-lg border p-3 text-left focus-reset transition-colors focus-visible:focus-ring',
                  active
                    ? 'border-primary bg-primary/8 ring-1 ring-primary/30'
                    : 'hover:border-fg-muted/30 hover:bg-neutral',
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <vibe.icon
                    className={cn(
                      'size-4',
                      active ? 'text-primary' : 'text-fg-muted',
                    )}
                  />
                  <span
                    className="size-4 rounded-full border"
                    style={{ backgroundColor: vibe.accent }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium">{vibe.label}</span>
                  <span className="text-[11px] leading-snug text-fg-muted">
                    {vibe.description}
                  </span>
                </div>
              </ButtonPrimitives.Button>
            )
          })}
        </div>
      </Section>
    </div>
  )
}
