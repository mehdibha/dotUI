"use client"

/* The studio's state hook: the open design system from the local workspace,
   and its resolved design system — what the panel, the preview and export
   all read. */

import { useCallback, useMemo } from "react"

import type { DesignSystem } from "@/modules/studio/preset/types"

import type { StudioState } from "./axes"
import { edit } from "./history"
import { resolveDesignSystem } from "./resolve"
import { useOpenSystem } from "./workspace"

export interface Studio {
  state: StudioState
  /** The engine's view: what the preview renders and the export ships. */
  designSystem: DesignSystem
  set: <K extends keyof StudioState>(key: K) => (value: StudioState[K]) => void
  setState: (state: StudioState) => void
}

export function useStudio(): Studio {
  const { id, state } = useOpenSystem()
  const setState = useCallback((next: StudioState) => edit(id, next), [id])
  const designSystem = useMemo(() => resolveDesignSystem(state), [state])

  return useMemo(() => {
    const set =
      <K extends keyof StudioState>(key: K) =>
      (value: StudioState[K]) =>
        setState({ ...state, [key]: value })
    return { state, designSystem, set, setState }
  }, [state, designSystem, setState])
}
