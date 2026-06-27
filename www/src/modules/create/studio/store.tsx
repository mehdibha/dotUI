'use client'

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

import type { ChapterId } from './data'

/* ----------------------------------------------------------------------------
 * Studio UI state — the ergonomics of the *builder*, kept separate from the
 * design system itself (which lives in the shareable `?preset=` URL via
 * `useDesignSystem`). This is the cockpit state: which chapter is open, how much
 * depth the user wants exposed, the system's name, and the color authoring mode.
 * None of it is serialized — reopening the builder starts from a calm default.
 * -------------------------------------------------------------------------- */

/** How much of the surface is revealed. The same panel, two postures. */
export type Depth = 'quick' | 'studio'

/** Whether color is authored as a few decisions or the full engine. */
export type ColorMode = 'simple' | 'advanced'

interface StudioState {
  /** The open chapter in the inspector. */
  chapter: ChapterId
  setChapter: (id: ChapterId) => void

  /** Quick (the five big decisions) vs Studio (every token). */
  depth: Depth
  setDepth: (depth: Depth) => void

  /** Cosmetic system name shown in the header and used in export copy. */
  name: string
  setName: (name: string) => void

  /** Simple color authoring vs the full OKLCH engine. */
  colorMode: ColorMode
  setColorMode: (mode: ColorMode) => void

  /** Whether raw generated palettes are surfaced as foundations. */
  showPalettes: boolean
  setShowPalettes: (show: boolean) => void

  /** The component currently being inspected, if any (drives the preview). */
  activeComponent: string | null
  setActiveComponent: (name: string | null) => void
}

const StudioContext = createContext<StudioState | null>(null)

export function StudioProvider({ children }: { children: ReactNode }) {
  const [chapter, setChapter] = useState<ChapterId>('brand')
  const [depth, setDepth] = useState<Depth>('studio')
  const [name, setName] = useState('Untitled system')
  const [colorMode, setColorMode] = useState<ColorMode>('simple')
  const [showPalettes, setShowPalettes] = useState(false)
  const [activeComponent, setActiveComponent] = useState<string | null>(null)

  const value = useMemo<StudioState>(
    () => ({
      chapter,
      setChapter,
      depth,
      setDepth,
      name,
      setName,
      colorMode,
      setColorMode,
      showPalettes,
      setShowPalettes,
      activeComponent,
      setActiveComponent,
    }),
    [chapter, depth, name, colorMode, showPalettes, activeComponent],
  )

  return (
    <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
  )
}

export function useStudio() {
  const ctx = useContext(StudioContext)
  if (!ctx) throw new Error('useStudio must be used within a StudioProvider')
  return ctx
}

/* ----------------------------------------------------------------------------
 * Quick-mode visibility. A control declares its own posture; in Quick we show
 * only the macros (the few decisions that re-skin the whole system), in Studio
 * everything. Centralized here so every chapter gates the same way.
 * -------------------------------------------------------------------------- */

export type Tempo = 'macro' | 'micro'

export function useReveals(tempo: Tempo): boolean {
  const { depth } = useStudio()
  if (depth === 'studio') return true
  return tempo === 'macro'
}

/** Imperative form for chapters that branch on more than one tempo. */
export function useDepth() {
  const { depth } = useStudio()
  const reveals = useCallback(
    (tempo: Tempo) => depth === 'studio' || tempo === 'macro',
    [depth],
  )
  return { depth, reveals }
}
