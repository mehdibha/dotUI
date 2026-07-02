'use client'

import { useCallback } from 'react'

import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import type { PaletteSeeds } from '@/registry/theme'

import { DEFAULTS, useDesignSystem } from '../preset'
import {
  type Vibe,
  FONT_BODY_VAR,
  FONT_HEADING_VAR,
  RADIUS_FACTOR_VAR,
  SHUFFLE_ACCENTS,
  SHUFFLE_DENSITIES,
  SHUFFLE_RADII,
  STYLE_FAMILY_VAR,
  pick,
} from './data'

/**
 * The multi-axis operations the front door fires. Each lands as a single
 * `setDesignSystem` so the whole re-skin is one undo step, not a dozen.
 */
export function useStudioActions() {
  const { setDesignSystem } = useDesignSystem()

  const applyVibe = useCallback(
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

  const reroll = useCallback(() => {
    const accent = pick(SHUFFLE_ACCENTS)
    const radius = pick(SHUFFLE_RADII)
    const density = pick(SHUFFLE_DENSITIES)
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

  /** Apply a list of seeds at once (e.g. a pasted palette). */
  const applySeeds = useCallback(
    (seeds: Partial<PaletteSeeds>) => {
      setDesignSystem((prev) => {
        const base = prev.color ?? DEFAULT_COLOR_CONFIG
        return {
          ...prev,
          color: { ...base, seeds: { ...base.seeds, ...seeds } },
        }
      })
    },
    [setDesignSystem],
  )

  const resetAll = useCallback(() => {
    setDesignSystem(DEFAULTS)
  }, [setDesignSystem])

  return { applyVibe, reroll, applySeeds, resetAll }
}
