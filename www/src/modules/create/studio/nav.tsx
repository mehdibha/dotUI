'use client'

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { getRouteApi } from '@tanstack/react-router'

import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'

import { ExamplesIndex } from '../__generated__/examples'
import { isGroupId } from '../components'
import { useDesignSystem } from '../preset'
import {
  FOUNDATION_IDS,
  pickRandom,
  REROLL_ACCENTS,
  REROLL_DENSITIES,
  REROLL_RADII,
} from './data'

/* ------------------------------------------------------------------ *
 * Studio navigation + panel meta state
 *
 * One provider owns the drill-in stack, the Quick/Pro depth, the editable
 * system name, the dice reroll, and an undo history. Every screen reads it
 * through `useStudio()`, so cards anywhere in the tree can navigate without
 * prop-drilling. Design-system edits still flow through `useDesignSystem`
 * (the URL `?preset=`), which is what keeps the live preview in sync.
 * ------------------------------------------------------------------ */

const RADIUS_FACTOR_VAR = '--radius-factor'

export type Depth = 'quick' | 'pro'

export type ScreenKind = 'foundation' | 'component' | 'group'

export function screenKind(id: string): ScreenKind {
  if (FOUNDATION_IDS.has(id)) return 'foundation'
  if (isGroupId(id)) return 'group'
  return 'component'
}

interface StudioContextValue {
  /** Drill-in stack; empty means the home view is on top. */
  stack: string[]
  push: (id: string) => void
  pop: () => void
  reset: () => void
  depth: Depth
  setDepth: (depth: Depth) => void
  name: string
  setName: (name: string) => void
  reroll: () => void
  undo: () => void
  canUndo: boolean
}

const StudioContext = createContext<StudioContextValue | null>(null)

export function useStudio(): StudioContextValue {
  const ctx = useContext(StudioContext)
  if (!ctx) throw new Error('useStudio must be used within <StudioProvider>')
  return ctx
}

const routeApi = getRouteApi('/_app/create')

export function StudioProvider({ children }: { children: ReactNode }) {
  const { preset } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const { setDesignSystem } = useDesignSystem()

  const [stack, setStack] = useState<string[]>([])
  const [depth, setDepth] = useState<Depth>('quick')
  const [name, setName] = useState('Untitled system')

  const push = useCallback(
    (id: string) => {
      // Opening a component swaps the live preview to it so edits are visible
      // immediately. Foundation + group screens leave the preview alone.
      const switchPreview =
        screenKind(id) === 'component' && id in ExamplesIndex
      setStack((prev) => [...prev, id])
      if (switchPreview) {
        navigate({ search: (prev) => ({ ...prev, preview: id }) })
      }
    },
    [navigate],
  )

  const pop = useCallback(() => setStack((prev) => prev.slice(0, -1)), [])
  const reset = useCallback(() => setStack([]), [])

  /* ----------------------------- Undo ----------------------------- */
  // Edits land in `?preset=` with `replace: true`, so the browser back button
  // can't walk them. Keep our own stack of past values and step back through it.
  const historyRef = useRef<(string | undefined)[]>([])
  const prevPresetRef = useRef<string | undefined>(preset)
  const isUndoingRef = useRef(false)
  const [canUndo, setCanUndo] = useState(false)

  useEffect(() => {
    if (prevPresetRef.current === preset) return
    if (isUndoingRef.current) {
      isUndoingRef.current = false
    } else {
      historyRef.current.push(prevPresetRef.current)
      setCanUndo(true)
    }
    prevPresetRef.current = preset
  }, [preset])

  const undo = useCallback(() => {
    if (historyRef.current.length === 0) return
    const previous = historyRef.current.pop()
    isUndoingRef.current = true
    navigate({
      search: (prev) => ({ ...prev, preset: previous }),
      replace: true,
    })
    setCanUndo(historyRef.current.length > 0)
  }, [navigate])

  /* ---------------------------- Reroll ---------------------------- */
  // Shuffle the always-legible axes in one update so Undo reverts them as a unit.
  const reroll = useCallback(() => {
    const accent = pickRandom(REROLL_ACCENTS)
    const radius = pickRandom(REROLL_RADII)
    const density = pickRandom(REROLL_DENSITIES)
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

  const value = useMemo<StudioContextValue>(
    () => ({
      stack,
      push,
      pop,
      reset,
      depth,
      setDepth,
      name,
      setName,
      reroll,
      undo,
      canUndo,
    }),
    [stack, push, pop, reset, depth, name, reroll, undo, canUndo],
  )

  return (
    <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
  )
}
