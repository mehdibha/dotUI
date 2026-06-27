'use client'

import { useCallback } from 'react'

import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'

import { DEFAULTS, useDesignSystem } from '../preset'
import {
  FONT_BODY_VAR,
  FONT_HEADING_VAR,
  type Preset,
  RADIUS_FACTOR_VAR,
  ROLL_ACCENTS,
  ROLL_DENSITIES,
  ROLL_FAMILIES,
  ROLL_RADII,
  STYLE_FAMILY_VAR,
} from './data'

/** Read + write one global CSS-var token, bound to the live preview. */
export function useToken(name: string, fallback: string) {
  const { designSystem, setToken } = useDesignSystem()
  const value = designSystem.tokens[name] ?? fallback
  const set = useCallback((v: string) => setToken(name, v), [name, setToken])
  return [value, set] as const
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T
}

/**
 * The whole-system mutations — accent + radius + density + style family + fonts
 * — land in a single `setDesignSystem` update so each reads as one undo step.
 */
export function useStudioActions() {
  const { setDesignSystem } = useDesignSystem()

  /** One color in, a whole system out — set the accent seed; the engine ramps it. */
  const seedFromColor = useCallback(
    (hex: string) => {
      setDesignSystem((prev) => {
        const base = prev.color ?? DEFAULT_COLOR_CONFIG
        return {
          ...prev,
          color: { ...base, seeds: { ...base.seeds, accent: hex } },
        }
      })
    },
    [setDesignSystem],
  )

  const applyPreset = useCallback(
    (preset: Preset) => {
      setDesignSystem((prev) => {
        const base = prev.color ?? DEFAULT_COLOR_CONFIG
        return {
          ...prev,
          density: preset.density,
          tokens: {
            ...prev.tokens,
            [RADIUS_FACTOR_VAR]: preset.radius,
            [STYLE_FAMILY_VAR]: preset.styleFamily,
            [FONT_HEADING_VAR]: preset.heading,
            [FONT_BODY_VAR]: preset.body,
          },
          color: {
            ...base,
            seeds: {
              ...base.seeds,
              accent: preset.accent,
              neutral: preset.neutral,
            },
          },
        }
      })
    },
    [setDesignSystem],
  )

  /** Surprise me — reshuffle the punchy, always-legible axes in one step. */
  const reroll = useCallback(() => {
    const accent = pick(ROLL_ACCENTS)
    const radius = pick(ROLL_RADII)
    const density = pick(ROLL_DENSITIES)
    const family = pick(ROLL_FAMILIES)
    setDesignSystem((prev) => {
      const base = prev.color ?? DEFAULT_COLOR_CONFIG
      return {
        ...prev,
        density,
        tokens: {
          ...prev.tokens,
          [RADIUS_FACTOR_VAR]: radius,
          [STYLE_FAMILY_VAR]: family,
        },
        color: { ...base, seeds: { ...base.seeds, accent } },
      }
    })
  }, [setDesignSystem])

  /** Back to the calm default system. */
  const reset = useCallback(() => {
    setDesignSystem(DEFAULTS)
  }, [setDesignSystem])

  return { seedFromColor, applyPreset, reroll, reset }
}
