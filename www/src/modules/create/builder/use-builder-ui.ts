'use client'

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createElement } from 'react'

/* ----------------------------------------------------------------------------
 * Builder UI state — everything about *how the panel is arranged*, kept apart
 * from the design system itself (which lives in the ?preset= URL via
 * useDesignSystem). This is local, ephemeral, per-session chrome: which cards
 * are open, which speed (Essentials / Everything), which deep editor is open,
 * the command palette, the color-foundation mode, and the session name.
 *
 * Splitting it out is deliberate: flipping the panel's shape must never touch,
 * reset, or branch the user's actual system — so the two never share a store.
 * -------------------------------------------------------------------------- */

export type DetailMode = 'essentials' | 'everything'
export type Foundation = 'tonal' | 'flat'

export type Drill =
  | { kind: 'color' }
  | { kind: 'component'; group: string }
  | null

/** The fixed authored order of the rail's aspect cards. */
export const CARD_ORDER = [
  'brand',
  'color',
  'typography',
  'shape',
  'density',
  'elevation',
  'motion',
  'interaction',
  'icons',
  'modes',
  'components',
] as const
export type CardId = (typeof CARD_ORDER)[number]

interface BuilderUiState {
  open: Record<string, boolean>
  detail: DetailMode
  drill: Drill
  cmdkOpen: boolean
  foundation: Foundation
  /** Local-only flat semantic palette (the "no palettes as foundations" path). */
  flatColors: Record<string, string>
  systemName: string
  /** A card id pulsed after a ⌘K jump; clears itself shortly after. */
  flashId: string | null
}

interface BuilderUiContextValue extends BuilderUiState {
  toggleCard: (id: string) => void
  openCard: (id: string) => void
  setDetail: (mode: DetailMode) => void
  setDrill: (drill: Drill) => void
  setCmdkOpen: (open: boolean) => void
  setFoundation: (foundation: Foundation) => void
  setFlatColor: (key: string, value: string) => void
  setSystemName: (name: string) => void
  /** Scroll-to + open + pulse a card (the ⌘K landing behavior). */
  flashCard: (id: string) => void
}

const STORAGE_KEY = 'dotui:builder-ui'

const DEFAULT_STATE: BuilderUiState = {
  open: { brand: true, color: true },
  detail: 'essentials',
  drill: null,
  cmdkOpen: false,
  foundation: 'tonal',
  flatColors: {},
  systemName: 'Untitled system',
  flashId: null,
}

// Only these keys are persisted — transient UI (drill, cmdk, flash) resets per load.
type PersistedKeys =
  | 'open'
  | 'detail'
  | 'foundation'
  | 'flatColors'
  | 'systemName'

function readStored(): BuilderUiState {
  if (typeof window === 'undefined') return DEFAULT_STATE
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw) as Partial<
      Pick<BuilderUiState, PersistedKeys>
    >
    return {
      ...DEFAULT_STATE,
      ...parsed,
      open: { ...DEFAULT_STATE.open, ...parsed.open },
      flatColors: { ...parsed.flatColors },
    }
  } catch {
    return DEFAULT_STATE
  }
}

const BuilderUiContext = createContext<BuilderUiContextValue | null>(null)

export function BuilderUiProvider({ children }: { children: ReactNode }) {
  // Seed from defaults on the server; hydrate from storage after mount so SSR
  // and first client paint agree (the builder route is client-heavy anyway).
  const [state, setState] = useState<BuilderUiState>(DEFAULT_STATE)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setState(readStored())
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const { open, detail, foundation, flatColors, systemName } = state
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ open, detail, foundation, flatColors, systemName }),
    )
  }, [state])

  const toggleCard = useCallback((id: string) => {
    setState((s) => ({ ...s, open: { ...s.open, [id]: !s.open[id] } }))
  }, [])

  const openCard = useCallback((id: string) => {
    setState((s) => ({ ...s, open: { ...s.open, [id]: true } }))
  }, [])

  // Essentials = every card collapsed to its head; Everything = all expanded.
  const setDetail = useCallback((mode: DetailMode) => {
    setState((s) => {
      const next: Record<string, boolean> = {}
      for (const id of CARD_ORDER) next[id] = mode === 'everything'
      return { ...s, detail: mode, open: next }
    })
  }, [])

  const setDrill = useCallback((drill: Drill) => {
    setState((s) => ({ ...s, drill }))
  }, [])

  const setCmdkOpen = useCallback((cmdkOpen: boolean) => {
    setState((s) => ({ ...s, cmdkOpen }))
  }, [])

  const setFoundation = useCallback((foundation: Foundation) => {
    setState((s) => ({ ...s, foundation }))
  }, [])

  const setFlatColor = useCallback((key: string, value: string) => {
    setState((s) => ({ ...s, flatColors: { ...s.flatColors, [key]: value } }))
  }, [])

  const setSystemName = useCallback((systemName: string) => {
    setState((s) => ({ ...s, systemName }))
  }, [])

  const flashCard = useCallback((id: string) => {
    setState((s) => ({ ...s, open: { ...s.open, [id]: true }, flashId: id }))
    if (flashTimer.current) clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => {
      setState((s) => (s.flashId === id ? { ...s, flashId: null } : s))
    }, 1100)
  }, [])

  useEffect(
    () => () => {
      if (flashTimer.current) clearTimeout(flashTimer.current)
    },
    [],
  )

  const value = useMemo<BuilderUiContextValue>(
    () => ({
      ...state,
      toggleCard,
      openCard,
      setDetail,
      setDrill,
      setCmdkOpen,
      setFoundation,
      setFlatColor,
      setSystemName,
      flashCard,
    }),
    [
      state,
      toggleCard,
      openCard,
      setDetail,
      setDrill,
      setCmdkOpen,
      setFoundation,
      setFlatColor,
      setSystemName,
      flashCard,
    ],
  )

  return createElement(BuilderUiContext.Provider, { value }, children)
}

export function useBuilderUi() {
  const ctx = useContext(BuilderUiContext)
  if (!ctx)
    throw new Error('useBuilderUi must be used within a BuilderUiProvider')
  return ctx
}
