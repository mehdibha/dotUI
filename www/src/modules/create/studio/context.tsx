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
import { getRouteApi } from '@tanstack/react-router'

/* ----------------------------------------------------------------------------
 * Studio context — the navigation + chrome state for the builder panel.
 *
 * The *design system* itself lives in the URL (`?preset=`) via useDesignSystem;
 * this context only owns the panel's own UI state: which workspace is open, the
 * command palette, the editable system name, and a deep-link target so jumping
 * from search lands on the right control.
 * -------------------------------------------------------------------------- */

export type WorkspaceId =
  | 'start'
  | 'color'
  | 'typography'
  | 'shape'
  | 'spacing'
  | 'surface'
  | 'motion'
  | 'icons'
  | 'interaction'
  | 'components'

interface StudioContextValue {
  workspace: WorkspaceId
  /** A control anchor to scroll to once the workspace mounts (then it clears). */
  focus: string | null
  goTo: (workspace: WorkspaceId, anchor?: string) => void
  clearFocus: () => void
  name: string
  setName: (name: string) => void
  commandOpen: boolean
  setCommandOpen: (open: boolean) => void
}

const StudioContext = createContext<StudioContextValue | null>(null)

export function StudioProvider({ children }: { children: ReactNode }) {
  const [workspace, setWorkspace] = useState<WorkspaceId>('start')
  const [focus, setFocus] = useState<string | null>(null)
  const [name, setName] = useState('Untitled system')
  const [commandOpen, setCommandOpen] = useState(false)

  const goTo = useCallback((next: WorkspaceId, anchor?: string) => {
    setWorkspace(next)
    setFocus(anchor ?? null)
    setCommandOpen(false)
  }, [])

  const clearFocus = useCallback(() => setFocus(null), [])

  // ⌘K / Ctrl-K opens the command palette from anywhere in the builder.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const value = useMemo(
    () => ({
      workspace,
      focus,
      goTo,
      clearFocus,
      name,
      setName,
      commandOpen,
      setCommandOpen,
    }),
    [workspace, focus, goTo, clearFocus, name, commandOpen],
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

/* ------------------------------- Undo history ------------------------------ */

const routeApi = getRouteApi('/_app/create')

/**
 * Undo for the builder. Every design edit replaces the `?preset=` param
 * (`replace: true`), so browser history can't step through edits — we keep our
 * own stack of past values and walk back through it. Watching `preset` (not
 * each setter) captures changes from every workspace, which all share this URL.
 */
export function useUndo() {
  const { preset } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const stack = useRef<(string | undefined)[]>([])
  const prev = useRef<string | undefined>(preset)
  const undoing = useRef(false)
  const [canUndo, setCanUndo] = useState(false)

  useEffect(() => {
    if (prev.current === preset) return
    if (undoing.current) {
      undoing.current = false
    } else {
      stack.current.push(prev.current)
      setCanUndo(true)
    }
    prev.current = preset
  }, [preset])

  const undo = useCallback(() => {
    if (stack.current.length === 0) return
    const previous = stack.current.pop()
    undoing.current = true
    navigate({
      search: (s) => ({ ...s, preset: previous }),
      replace: true,
    })
    setCanUndo(stack.current.length > 0)
  }, [navigate])

  return { undo, canUndo }
}

/** Reset the whole system to defaults by clearing the preset. */
export function useReset() {
  const navigate = routeApi.useNavigate()
  return useCallback(() => {
    navigate({ search: (s) => ({ ...s, preset: undefined }), replace: true })
  }, [navigate])
}
