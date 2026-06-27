'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'

import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'

import { RADIUS_FACTOR_VAR } from '../layout'
import { useDesignSystem } from '../preset'
import type { StudioMode } from './context'
import {
  pickRandom,
  SHUFFLE_ACCENTS,
  SHUFFLE_DENSITIES,
  SHUFFLE_RADII,
} from './data'

const routeApi = getRouteApi('/_app/create')

/**
 * The Studio "shell" — the state shared between the full-width builder top bar
 * and the inspector panel: the system name, the Simple/Pro posture, undo, the
 * "surprise me" shuffle, and the ⌘K command search. It lives above both so the
 * top bar can own these primary controls while the panel keeps reacting to them
 * (sections read `mode`, the panel hosts the command-search overlay).
 */
export interface StudioShellValue {
  name: string
  setName: (name: string) => void
  /** The current accent seed — drives the top bar's identity swatch. */
  accent: string
  mode: StudioMode
  setMode: (mode: StudioMode) => void
  canUndo: boolean
  undo: () => void
  shuffle: () => void
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
}

const StudioShellContext = createContext<StudioShellValue | null>(null)

export function StudioShellProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { preset } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const { designSystem, setDesignSystem } = useDesignSystem()

  const [name, setName] = useState('Untitled system')
  const [mode, setMode] = useState<StudioMode>('simple')
  const [searchOpen, setSearchOpen] = useState(false)

  const accent =
    (designSystem.color ?? DEFAULT_COLOR_CONFIG).seeds.accent ?? '#438cd6'

  /* --- Undo: snapshot every preset change, walk back through them. --- */
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
  function undo() {
    const previous = historyRef.current.pop()
    if (previous === undefined && historyRef.current.length === 0 && !canUndo)
      return
    isUndoingRef.current = true
    navigate({
      search: (prev) => ({ ...prev, preset: previous }),
      replace: true,
    })
    setCanUndo(historyRef.current.length > 0)
  }

  /* --- Shuffle the always-legible axes in one history entry. --- */
  function shuffle() {
    setDesignSystem((prev) => {
      const base = prev.color ?? DEFAULT_COLOR_CONFIG
      return {
        ...prev,
        density: pickRandom(SHUFFLE_DENSITIES),
        tokens: {
          ...prev.tokens,
          [RADIUS_FACTOR_VAR]: pickRandom(SHUFFLE_RADII),
        },
        color: {
          ...base,
          seeds: { ...base.seeds, accent: pickRandom(SHUFFLE_ACCENTS) },
        },
      }
    })
  }

  /* --- ⌘K toggles the command search. --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((o) => !o)
      }
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <StudioShellContext.Provider
      value={{
        name,
        setName,
        accent,
        mode,
        setMode,
        canUndo,
        undo,
        shuffle,
        searchOpen,
        setSearchOpen,
      }}
    >
      {children}
    </StudioShellContext.Provider>
  )
}

export function useStudioShell(): StudioShellValue {
  const ctx = useContext(StudioShellContext)
  if (!ctx)
    throw new Error('useStudioShell must be used inside <StudioShellProvider>')
  return ctx
}
