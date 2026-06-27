'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'

/* ----------------------------------------------------------------------------
 * Undo / redo over the design system. Every edit encodes into `?preset=` with
 * `replace: true`, so the browser back button can't step through edits — we keep
 * our own past/future stacks of preset values and walk them. Watching `preset`
 * (not wiring into each setter) captures changes from every chapter, which each
 * own a separate `useDesignSystem()` instance but share this one URL param.
 * -------------------------------------------------------------------------- */

const routeApi = getRouteApi('/_app/create')

export function useHistory() {
  const { preset } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const past = useRef<(string | undefined)[]>([])
  const future = useRef<(string | undefined)[]>([])
  const prev = useRef<string | undefined>(preset)
  const isTraveling = useRef(false)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  useEffect(() => {
    if (prev.current === preset) return
    if (isTraveling.current) {
      isTraveling.current = false
    } else {
      // A genuine edit — record the prior state and drop any redo trail.
      past.current.push(prev.current)
      future.current = []
      setCanUndo(true)
      setCanRedo(false)
    }
    prev.current = preset
  }, [preset])

  const undo = useCallback(() => {
    if (past.current.length === 0) return
    const target = past.current.pop()
    future.current.push(preset)
    isTraveling.current = true
    navigate({ search: (p) => ({ ...p, preset: target }), replace: true })
    setCanUndo(past.current.length > 0)
    setCanRedo(true)
  }, [navigate, preset])

  const redo = useCallback(() => {
    if (future.current.length === 0) return
    const target = future.current.pop()
    past.current.push(preset)
    isTraveling.current = true
    navigate({ search: (p) => ({ ...p, preset: target }), replace: true })
    setCanRedo(future.current.length > 0)
    setCanUndo(true)
  }, [navigate, preset])

  return { canUndo, canRedo, undo, redo }
}
