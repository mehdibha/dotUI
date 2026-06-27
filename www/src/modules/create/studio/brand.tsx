'use client'

/**
 * Brand — the front door. The promise of the product made literal: drop in one
 * brand color (or pick a starting point, or apply a whole vibe) and walk away
 * with a complete, on-brand system. Everything here is wired to the real color
 * engine, so the ramps you see below the seed ARE the system being generated.
 */

import { useMemo } from 'react'
import { ArrowRightIcon, ShuffleIcon, SparklesIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG, resolveColorConfig } from '@/registry/theme'
import type { AlgorithmId } from '@/registry/theme'
import { Button } from '@/registry/ui/button'

import { DEFAULT_RADIUS_FACTOR, RADIUS_FACTOR_VAR } from '../layout'
import { useDesignSystem } from '../preset'
import type { Density } from '../preset'
import {
  GroupLabel,
  RampStrip,
  SectionIntro,
  SeedSwatch,
  usePro,
} from './widgets'

/* ----------------------------------------------------------------------------
 * Full-system presets — each applies a brand color, a generation algorithm, a
 * corner-radius factor and a density in ONE update, so the live preview re-skins
 * wholesale. This is the "recreate almost any design system" bet: a small set of
 * well-chosen starting points that each look finished out of the gate.
 * -------------------------------------------------------------------------- */

interface ThemePreset {
  id: string
  name: string
  blurb: string
  accent: string
  neutral: string
  algorithm: AlgorithmId
  radius: string
  density: Density
}

const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    blurb: 'Geist-like. Near-neutral, tight corners.',
    accent: '#171717',
    neutral: '#808080',
    algorithm: 'oklch',
    radius: '0.5',
    density: 'default',
  },
  {
    id: 'vivid',
    name: 'Vivid',
    blurb: 'Saturated indigo, rounded, roomy.',
    accent: '#6366f1',
    neutral: '#7c7d8c',
    algorithm: 'oklch',
    radius: '1.25',
    density: 'comfortable',
  },
  {
    id: 'material',
    name: 'Material',
    blurb: 'Tonal blue, Material tone ramps.',
    accent: '#2563eb',
    neutral: '#7e8088',
    algorithm: 'material',
    radius: '1',
    density: 'default',
  },
  {
    id: 'editorial',
    name: 'Editorial',
    blurb: 'Warm amber, squared, calm.',
    accent: '#b45309',
    neutral: '#857f76',
    algorithm: 'oklch',
    radius: '0.25',
    density: 'default',
  },
  {
    id: 'playful',
    name: 'Playful',
    blurb: 'Rose, pill corners, cozy.',
    accent: '#ec4899',
    neutral: '#8a7d84',
    algorithm: 'oklch',
    radius: '2',
    density: 'comfortable',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    blurb: 'Steel blue, dense, contrast-locked.',
    accent: '#0369a1',
    neutral: '#787f85',
    algorithm: 'contrast',
    radius: '0.5',
    density: 'compact',
  },
]

/* Quick starting points — accent only, for one-tap reseeding. */
const STARTER_COLORS = [
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
  '#f59e0b',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#171717',
]

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T
}

export function BrandSection() {
  const pro = usePro()
  const { designSystem, setDesignSystem, setColorSeed } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const accent = config.seeds.accent ?? DEFAULT_COLOR_CONFIG.seeds.accent
  const neutral = config.seeds.neutral ?? DEFAULT_COLOR_CONFIG.seeds.neutral

  const resolved = useMemo(() => resolveColorConfig(config), [config])
  const radius = designSystem.tokens[RADIUS_FACTOR_VAR] ?? DEFAULT_RADIUS_FACTOR

  function applyPreset(preset: ThemePreset) {
    setDesignSystem((prev) => {
      const base = prev.color ?? DEFAULT_COLOR_CONFIG
      return {
        ...prev,
        density: preset.density,
        tokens: { ...prev.tokens, [RADIUS_FACTOR_VAR]: preset.radius },
        color: {
          ...base,
          algorithm: preset.algorithm,
          seeds: {
            ...base.seeds,
            accent: preset.accent,
            neutral: preset.neutral,
          },
        },
      }
    })
  }

  const activePreset = THEME_PRESETS.find(
    (p) =>
      p.accent.toLowerCase() === accent.toLowerCase() &&
      p.radius === radius &&
      p.density === designSystem.density,
  )

  return (
    <div className="flex flex-col gap-5">
      <SectionIntro title="Brand">
        One color in, a complete system out. Pick a starting point — every other
        token derives from it, and you can refine anything later.
      </SectionIntro>

      {/* The single seed — the hero input. */}
      <div className="rounded-xl border bg-gradient-to-b from-neutral/40 to-transparent p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-fg">Brand color</span>
          <Button
            size="sm"
            variant="quiet"
            onPress={() => setColorSeed('accent', pickRandom(STARTER_COLORS))}
            aria-label="Random brand color"
          >
            <ShuffleIcon data-icon-start="" />
            Surprise me
          </Button>
        </div>
        <SeedSwatch
          value={accent}
          onChange={(hex) => setColorSeed('accent', hex)}
          label="Brand color"
        />

        {/* The generated system, live — proof the one seed became a full ramp. */}
        <div className="mt-3 flex flex-col gap-1">
          {(['accent', 'neutral'] as const).map((palette) => {
            const ramp = resolved.light[palette]
            if (!ramp) return null
            return (
              <RampStrip
                key={palette}
                title={palette}
                steps={Object.entries(ramp)}
              />
            )
          })}
        </div>

        {/* Starter swatches — one tap to reseed the accent. */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {STARTER_COLORS.map((hex) => (
            <button
              key={hex}
              type="button"
              aria-label={`Use ${hex}`}
              onClick={() => setColorSeed('accent', hex)}
              className={cn(
                'size-5 rounded-full focus-reset ring-1 ring-border transition-transform ring-inset hover:scale-110 focus-visible:focus-ring',
                accent.toLowerCase() === hex.toLowerCase() &&
                  'ring-2 ring-fg ring-offset-1 ring-offset-bg',
              )}
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
      </div>

      {/* Whole-system presets. */}
      <div className="flex flex-col gap-2.5">
        <GroupLabel hint={<SparklesIcon className="size-3 text-fg-muted" />}>
          Start from a vibe
        </GroupLabel>
        <div className="grid grid-cols-1 gap-2">
          {THEME_PRESETS.map((preset) => {
            const isActive = activePreset?.id === preset.id
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={cn(
                  'group flex items-center gap-3 rounded-lg border p-2.5 text-left focus-reset transition-colors hover:bg-neutral focus-visible:focus-ring',
                  isActive && 'border-fg/30 bg-neutral',
                )}
              >
                <PresetSwatch preset={preset} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium">{preset.name}</span>
                    {isActive && (
                      <span className="rounded bg-primary px-1 py-px text-[9px] font-semibold tracking-wide text-fg-on-primary uppercase">
                        On
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[11px] text-fg-muted">
                    {preset.blurb}
                  </p>
                </div>
                <ArrowRightIcon className="size-4 shrink-0 text-fg-muted opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            )
          })}
        </div>
      </div>

      {pro && (
        <div className="flex flex-col gap-2.5">
          <GroupLabel>Base / gray</GroupLabel>
          <SeedSwatch
            value={neutral}
            onChange={(hex) => setColorSeed('neutral', hex)}
            label="Base gray"
          />
          <p className="text-[11px] leading-snug text-fg-muted/80">
            The neutral seed every surface, text and border derives from. Nudge
            it toward the brand for a tinted gray. Tune the full color system in
            the Color section.
          </p>
        </div>
      )}
    </div>
  )
}

/** A radius-accurate mini-chip showing a preset's accent over its neutral. */
function PresetSwatch({ preset }: { preset: ThemePreset }) {
  const r = Number.parseFloat(preset.radius) || 1
  return (
    <div
      className="flex size-9 shrink-0 items-center justify-center border"
      style={{
        backgroundColor: preset.neutral + '22',
        borderRadius: `calc(0.5rem * ${r})`,
      }}
    >
      <span
        className="size-4"
        style={{
          backgroundColor: preset.accent,
          borderRadius: `calc(0.25rem * ${r})`,
        }}
      />
    </div>
  )
}
