'use client'

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { getRouteApi } from '@tanstack/react-router'

import { ExamplesIndex } from '../__generated__/examples'

/* ----------------------------------------------------------------------------
 * Studio store — the UI-only state for the redesigned /create control panel.
 *
 * The *design system itself* still lives in the URL (`useDesignSystem`); this
 * store only owns the chrome: which audience mode is active (Simple vs Pro),
 * the editable system name, and the slide-in navigation stack. Keeping it out
 * of the URL means navigating between editors never churns the shareable preset.
 * -------------------------------------------------------------------------- */

export type SkillLevel = 'simple' | 'pro'

/**
 * A navigation target. Foundations and the component browser are plain ids;
 * `component:<name>` and `group:<name>` carry their subject inline.
 */
export type View = string

const routeApi = getRouteApi('/_app/create')

interface StudioContextValue {
  level: SkillLevel
  setLevel: (level: SkillLevel) => void
  name: string
  setName: (name: string) => void
  /** Slide-in stack; empty = home. */
  stack: View[]
  navigate: (view: View) => void
  back: () => void
  /** Pop straight back to home. */
  goHome: () => void
  /** Jump to an arbitrary stack (used by the command palette). */
  open: (views: View[]) => void
}

const StudioContext = createContext<StudioContextValue | null>(null)

/** A component view whose live preview example exists, so opening it can swap the stage. */
function componentWithPreview(view: View): string | null {
  if (!view.startsWith('component:')) return null
  const name = view.slice('component:'.length)
  return name in ExamplesIndex ? name : null
}

export function StudioProvider({ children }: { children: ReactNode }) {
  const navigateRoute = routeApi.useNavigate()
  const [level, setLevel] = useState<SkillLevel>('simple')
  const [name, setName] = useState('Untitled system')
  const [stack, setStack] = useState<View[]>([])

  // Opening a component switches the live preview to it so param edits are visible
  // immediately — mirrors the behaviour of the previous customizer panel. Called from
  // the event handler (never inside a setState updater) so it can't fire a router
  // update during React's render phase.
  const syncPreview = useCallback(
    (view: View | undefined) => {
      const preview = view ? componentWithPreview(view) : null
      if (preview) {
        navigateRoute({
          search: (prev) => ({ ...prev, preview }),
          replace: true,
        })
      }
    },
    [navigateRoute],
  )

  const navigate = useCallback(
    (view: View) => {
      setStack((prev) => [...prev, view])
      syncPreview(view)
    },
    [syncPreview],
  )

  const open = useCallback(
    (views: View[]) => {
      setStack(views)
      syncPreview(views[views.length - 1])
    },
    [syncPreview],
  )

  const back = useCallback(() => setStack((prev) => prev.slice(0, -1)), [])
  const goHome = useCallback(() => setStack([]), [])

  const value = useMemo(
    () => ({
      level,
      setLevel,
      name,
      setName,
      stack,
      navigate,
      back,
      goHome,
      open,
    }),
    [level, name, stack, navigate, back, goHome, open],
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
