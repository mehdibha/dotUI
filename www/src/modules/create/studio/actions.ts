'use client'

import { getRouteApi } from '@tanstack/react-router'

import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'

import { RADIUS_FACTOR_VAR } from '../layout'
import { useDesignSystem } from '../preset'

/* Shared studio commands, reused by the top bar and the ⌘K palette. */

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
const SHUFFLE_DENSITIES = ['compact', 'default', 'comfortable'] as const

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T
}

const routeApi = getRouteApi('/_app/create')

export function useStudioActions() {
  const navigate = routeApi.useNavigate()
  const { setDesignSystem } = useDesignSystem()

  /** Roll the always-legible axes (accent / radius / density) in one history entry. */
  function shuffle() {
    const accent = pick(SHUFFLE_ACCENTS)
    const radius = pick(SHUFFLE_RADII)
    const density = pick(SHUFFLE_DENSITIES)
    setDesignSystem((p) => {
      const base = p.color ?? DEFAULT_COLOR_CONFIG
      return {
        ...p,
        density,
        tokens: { ...p.tokens, [RADIUS_FACTOR_VAR]: radius },
        color: { ...base, seeds: { ...base.seeds, accent } },
      }
    })
  }

  /** Clear the preset back to defaults. */
  function reset() {
    navigate({ search: (p) => ({ ...p, preset: undefined }), replace: true })
  }

  return { shuffle, reset }
}
