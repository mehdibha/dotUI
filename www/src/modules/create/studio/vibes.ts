'use client'

import { useCallback } from 'react'

import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'

import { RADIUS_FACTOR_VAR } from '../layout'
import { useDesignSystem } from '../preset'
import type { Density } from '../preset'
import { FONT_BODY_VAR, FONT_HEADING_VAR, STYLE_FAMILY_VAR } from './tokens'

/* ----------------------------------------------------------------------------
 * Vibes — curated starting points. Each re-skins the whole system in one tap:
 * brand accent, neutral strategy, radius, density, a style family and fonts.
 * They're shortcuts into the same live state every workspace also edits, so
 * after picking one the user keeps tuning from there.
 * -------------------------------------------------------------------------- */

export interface Vibe {
  id: string
  label: string
  blurb: string
  accent: string
  neutral: string
  radius: string
  density: Density
  style: 'flat' | 'soft' | 'depth' | 'glass'
  heading: string
  body: string
}

export const VIBES: Vibe[] = [
  {
    id: 'minimal',
    label: 'Minimal',
    blurb: 'Mono ink, tight corners',
    accent: '#171717',
    neutral: '#808080',
    radius: '0.4',
    density: 'compact',
    style: 'flat',
    heading: 'Geist',
    body: 'Geist',
  },
  {
    id: 'swiss',
    label: 'Swiss',
    blurb: 'Editorial, square, calm',
    accent: '#0f766e',
    neutral: '#7d7d78',
    radius: '0.1',
    density: 'comfortable',
    style: 'flat',
    heading: 'Geist',
    body: 'Geist',
  },
  {
    id: 'product',
    label: 'Product',
    blurb: 'Indigo, soft, balanced',
    accent: '#5e6ad2',
    neutral: '#7e8091',
    radius: '0.7',
    density: 'default',
    style: 'soft',
    heading: 'Inter',
    body: 'Inter',
  },
  {
    id: 'corporate',
    label: 'Corporate',
    blurb: 'Trustworthy blue',
    accent: '#2563eb',
    neutral: '#80828a',
    radius: '0.6',
    density: 'default',
    style: 'soft',
    heading: 'Geist',
    body: 'Geist',
  },
  {
    id: 'playful',
    label: 'Playful',
    blurb: 'Rosy, round, roomy',
    accent: '#f43f5e',
    neutral: '#8a8086',
    radius: '1.7',
    density: 'comfortable',
    style: 'soft',
    heading: 'Geist',
    body: 'Geist',
  },
  {
    id: 'vivid',
    label: 'Vivid',
    blurb: 'Violet with depth',
    accent: '#7c3aed',
    neutral: '#83808c',
    radius: '1',
    density: 'default',
    style: 'depth',
    heading: 'Geist',
    body: 'Geist',
  },
  {
    id: 'glass',
    label: 'Glass',
    blurb: 'Frosted, translucent',
    accent: '#06b6d4',
    neutral: '#7c8488',
    radius: '1.2',
    density: 'default',
    style: 'glass',
    heading: 'Geist',
    body: 'Geist',
  },
  {
    id: 'brutalist',
    label: 'Brutalist',
    blurb: 'Hard edges, full black',
    accent: '#000000',
    neutral: '#7a7a7a',
    radius: '0',
    density: 'default',
    style: 'flat',
    heading: 'Geist',
    body: 'Geist',
  },
]

/** Apply a vibe as a single, undo-able state change. */
export function useApplyVibe() {
  const { setDesignSystem } = useDesignSystem()
  return useCallback(
    (vibe: Vibe) => {
      setDesignSystem((prev) => {
        const base = prev.color ?? DEFAULT_COLOR_CONFIG
        return {
          ...prev,
          density: vibe.density,
          tokens: {
            ...prev.tokens,
            [RADIUS_FACTOR_VAR]: vibe.radius,
            [STYLE_FAMILY_VAR]: vibe.style,
            [FONT_HEADING_VAR]: vibe.heading,
            [FONT_BODY_VAR]: vibe.body,
          },
          color: {
            ...base,
            seeds: {
              ...base.seeds,
              accent: vibe.accent,
              neutral: vibe.neutral,
            },
          },
        }
      })
    },
    [setDesignSystem],
  )
}

/* --------------------------------- Re-roll -------------------------------- */

const REROLL_ACCENTS = [
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
const REROLL_RADII = ['0', '0.5', '1', '1.5', '2']
const REROLL_DENSITIES: Density[] = ['compact', 'default', 'comfortable']

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T
}

/** Randomize the always-legible axes (accent / radius / density) in one step. */
export function useReroll() {
  const { setDesignSystem } = useDesignSystem()
  return useCallback(() => {
    const accent = pick(REROLL_ACCENTS)
    const radius = pick(REROLL_RADII)
    const density = pick(REROLL_DENSITIES)
    setDesignSystem((prev) => {
      const base = prev.color ?? DEFAULT_COLOR_CONFIG
      return {
        ...prev,
        density,
        tokens: { ...prev.tokens, [RADIUS_FACTOR_VAR]: radius },
        color: { ...base, seeds: { ...base.seeds, accent } },
      }
    })
  }, [setDesignSystem])
}

/** Which vibe (if any) the current state matches — for active highlighting. */
export function matchVibe(
  accent: string | undefined,
  radius: string,
  density: Density,
): string | undefined {
  return VIBES.find(
    (v) =>
      v.accent.toLowerCase() === (accent ?? '').toLowerCase() &&
      v.radius === radius &&
      v.density === density,
  )?.id
}
