'use client'

import { useCallback } from 'react'
import { DicesIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button } from '@/registry/ui/button'

import { RADIUS_FACTOR_VAR } from '../layout'
import { useDesignSystem } from '../preset'
import type { Density } from '../preset'
import { Segmented, ValueSlider } from './primitives'
import { SeedField } from './schema'

/* ----------------------------------------------------------------------------
 * The macro front door — the hobbyist's ~2-minute path. A handful of macros
 * that each re-skin the whole system, plus re-roll. Everything here is a
 * shortcut into the same live state the expert controls below also edit.
 * -------------------------------------------------------------------------- */

interface Personality {
  id: string
  label: string
  accent: string
  radius: string
  density: Density
}

const PERSONALITIES: Personality[] = [
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
]

const SHUFFLE_ACCENTS = [
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#f59e0b',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
]
const SHUFFLE_RADII = ['0', '0.5', '1', '1.5', '2']
const SHUFFLE_DENSITIES: Density[] = ['compact', 'default', 'comfortable']

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T
}

/** Shared by the front door and the header's primary action. */
export function useReroll() {
  const { setDesignSystem } = useDesignSystem()
  return useCallback(() => {
    const accent = pick(SHUFFLE_ACCENTS)
    const r = pick(SHUFFLE_RADII)
    const density = pick(SHUFFLE_DENSITIES)
    setDesignSystem((prev) => {
      const base = prev.color ?? DEFAULT_COLOR_CONFIG
      return {
        ...prev,
        density,
        tokens: { ...prev.tokens, [RADIUS_FACTOR_VAR]: r },
        color: { ...base, seeds: { ...base.seeds, accent } },
      }
    })
  }, [setDesignSystem])
}

export function MacroFrontDoor() {
  const { designSystem, setDesignSystem, setDensity, setToken } =
    useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const radius = designSystem.tokens[RADIUS_FACTOR_VAR] ?? '1'
  const reroll = useReroll()

  function applyPersonality(p: Personality) {
    setDesignSystem((prev) => {
      const base = prev.color ?? DEFAULT_COLOR_CONFIG
      return {
        ...prev,
        density: p.density,
        tokens: { ...prev.tokens, [RADIUS_FACTOR_VAR]: p.radius },
        color: { ...base, seeds: { ...base.seeds, accent: p.accent } },
      }
    })
  }

  // Reflect which personality (if any) the current state matches.
  const activePersonality = PERSONALITIES.find(
    (p) =>
      p.accent.toLowerCase() === (config.seeds.accent ?? '').toLowerCase() &&
      p.radius === radius &&
      p.density === designSystem.density,
  )?.id

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-neutral/40 p-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wider text-fg-muted uppercase">
          Quick start
        </span>
        <Button
          size="sm"
          variant="default"
          onPress={reroll}
          className="h-7 gap-1.5 px-2 text-xs"
        >
          <DicesIcon className="size-3.5" />
          Re-roll
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-fg">Brand color</span>
        <SeedField seed="accent" />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-fg">Personality</span>
        <div className="flex flex-wrap gap-1.5">
          {PERSONALITIES.map((p) => (
            <ButtonPrimitives.Button
              key={p.id}
              onPress={() => applyPersonality(p)}
              className={cn(
                'group flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs focus-reset transition-colors focus-visible:focus-ring',
                activePersonality === p.id
                  ? 'text-primary-fg border-transparent bg-primary'
                  : 'hover:bg-neutral',
              )}
            >
              <span
                className="size-2.5 rounded-full ring-1 ring-black/10 ring-inset"
                style={{ backgroundColor: p.accent }}
              />
              {p.label}
            </ButtonPrimitives.Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-fg">Density</span>
          <Segmented
            ariaLabel="Density"
            value={designSystem.density}
            onChange={setDensity}
            options={[
              { value: 'compact', label: 'S' },
              { value: 'default', label: 'M' },
              { value: 'comfortable', label: 'L' },
            ]}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-fg">Radius</span>
          <ValueSlider
            ariaLabel="Radius"
            value={Number.parseFloat(radius) || 1}
            min={0}
            max={2}
            step={0.05}
            format={(v) => `${v.toFixed(1)}×`}
            onChange={(v) => setToken(RADIUS_FACTOR_VAR, String(v))}
          />
        </div>
      </div>
    </div>
  )
}
