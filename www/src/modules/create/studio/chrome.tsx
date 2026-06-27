'use client'

/**
 * Studio chrome — the builder's primary actions, lifted out of the panel so they
 * can live in the /create top bar (one cohesive bar, not two stacked ones).
 *
 * Owns the depth switch (Simple/Pro), the undo history, the reset, and the
 * "surprise me" shuffle. All of it is derived from the route's `?preset=` search
 * param + `useDesignSystem()`, so the provider can sit above both the top bar and
 * the panel and let either one drive the same state.
 */

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { getRouteApi } from '@tanstack/react-router'

import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'

import { RADIUS_FACTOR_VAR } from '../layout'
import { useDesignSystem } from '../preset'

const routeApi = getRouteApi('/_app/create')

/* "Surprise me" pools — the always-legible axes, each curated so any pick lands. */
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

interface StudioChrome {
  pro: boolean
  setPro: (pro: boolean) => void
  canUndo: boolean
  undo: () => void
  reset: () => void
  shuffle: () => void
}

const StudioChromeContext = createContext<StudioChrome | null>(null)

export function StudioChromeProvider({ children }: { children: ReactNode }) {
  const { preset } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const { setDesignSystem } = useDesignSystem()

  const [pro, setPro] = useState(false)

  /* ----- Undo history. Every edit lands in `?preset=` with replace:true, so the
     browser back button can't step through it. We keep our own stack, watching
     `preset` to catch changes from every section regardless of which one made it. */
  const history = useRef<(string | undefined)[]>([])
  const prevPreset = useRef<string | undefined>(preset)
  const undoing = useRef(false)
  const [canUndo, setCanUndo] = useState(false)

  useEffect(() => {
    if (prevPreset.current === preset) return
    if (undoing.current) {
      undoing.current = false
    } else {
      history.current.push(prevPreset.current)
      setCanUndo(true)
    }
    prevPreset.current = preset
  }, [preset])

  function undo() {
    if (history.current.length === 0) return
    const previous = history.current.pop()
    undoing.current = true
    navigate({
      search: (prev) => ({ ...prev, preset: previous }),
      replace: true,
    })
    setCanUndo(history.current.length > 0)
  }

  function reset() {
    navigate({
      search: (prev) => ({ ...prev, preset: undefined }),
      replace: true,
    })
  }

  /* Shuffle the legible axes in one update so Undo reverts it in a single step. */
  function shuffle() {
    const accentPick = pickRandom(SHUFFLE_ACCENTS)
    const radius = pickRandom(SHUFFLE_RADII)
    const density = pickRandom(SHUFFLE_DENSITIES)
    setDesignSystem((prev) => {
      const base = prev.color ?? DEFAULT_COLOR_CONFIG
      return {
        ...prev,
        density,
        tokens: { ...prev.tokens, [RADIUS_FACTOR_VAR]: radius },
        color: { ...base, seeds: { ...base.seeds, accent: accentPick } },
      }
    })
  }

  return (
    <StudioChromeContext.Provider
      value={{ pro, setPro, canUndo, undo, reset, shuffle }}
    >
      {children}
    </StudioChromeContext.Provider>
  )
}

export function useStudioChrome() {
  const ctx = useContext(StudioChromeContext)
  if (!ctx) {
    throw new Error(
      'useStudioChrome must be used within a StudioChromeProvider',
    )
  }
  return ctx
}
