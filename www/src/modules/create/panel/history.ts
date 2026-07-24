import { useEffect, useRef, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'

import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'

import { RADIUS_FACTOR_VAR } from '../layout'
import { useDesignSystem } from '../preset'

const routeApi = getRouteApi('/_app/create')

/**
 * Undo/redo over the `?preset=` search param. Every design change is encoded
 * into the URL with `replace: true`, so the browser back button can't step
 * through edits — we keep our own stacks of past/future preset values and walk
 * them. Watching `preset` (not wiring into each setter) captures changes from
 * every panel section, each of which owns a separate `useDesignSystem()`
 * instance but shares this URL.
 */
export function usePresetHistory() {
  const { preset } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const pastRef = useRef<(string | undefined)[]>([])
  const futureRef = useRef<(string | undefined)[]>([])
  const prevPresetRef = useRef<string | undefined>(preset)
  const isTimeTravelingRef = useRef(false)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  useEffect(() => {
    if (prevPresetRef.current === preset) return
    if (isTimeTravelingRef.current) {
      isTimeTravelingRef.current = false
    } else {
      pastRef.current.push(prevPresetRef.current)
      futureRef.current = []
      setCanUndo(true)
      setCanRedo(false)
    }
    prevPresetRef.current = preset
  }, [preset])

  function goTo(value: string | undefined) {
    isTimeTravelingRef.current = true
    navigate({
      search: (prev) => ({ ...prev, preset: value }),
      replace: true,
    })
  }

  function undo() {
    if (pastRef.current.length === 0) return
    const previous = pastRef.current.pop()
    futureRef.current.push(prevPresetRef.current)
    goTo(previous)
    setCanUndo(pastRef.current.length > 0)
    setCanRedo(true)
  }

  function redo() {
    if (futureRef.current.length === 0) return
    const next = futureRef.current.pop()
    pastRef.current.push(prevPresetRef.current)
    goTo(next)
    setCanRedo(futureRef.current.length > 0)
    setCanUndo(true)
  }

  return { canUndo, canRedo, undo, redo }
}

/* ------------------------------- Shuffle -------------------------------- */

// "Surprise me" pools — the punchy, always-legible axes (accent / radius /
// density), each curated so any random pick still looks good.
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

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T
}

/** Shuffle accent/radius/density in one update — a single undo-able history entry. */
export function useShuffle() {
  const { setDesignSystem } = useDesignSystem()
  return () => {
    const accent = pickRandom(SHUFFLE_ACCENTS)
    const radius = pickRandom(SHUFFLE_RADII)
    const density = pickRandom(SHUFFLE_DENSITIES)
    setDesignSystem((prev) => {
      const base = prev.color ?? DEFAULT_COLOR_CONFIG
      return {
        ...prev,
        density,
        tokens: { ...prev.tokens, [RADIUS_FACTOR_VAR]: radius },
        color: { ...base, seeds: { ...base.seeds, accent } },
      }
    })
  }
}
