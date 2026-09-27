"use client"

/* The studio's state hook: the current design system (a view or one of the
   user's systems) and its resolved design system — what the panel, the
   preview and export all read. Editing a view makes a draft. */

import { useMemo } from "react"

import type { DesignSystem } from "@/modules/studio/preset/types"

import type { StudioState } from "./axes"
import { edit } from "./history"
import { resolveDesignSystem } from "./resolve"
import { useCurrent } from "./selection"

export interface Studio {
  state: StudioState
  /** The engine's view: what the preview renders and the export ships. */
  designSystem: DesignSystem
  set: <K extends keyof StudioState>(key: K) => (value: StudioState[K]) => void
  setState: (state: StudioState) => void
}

export function useStudio(): Studio {
  const { state } = useCurrent()
  const designSystem = useMemo(() => resolveDesignSystem(state), [state])

  return useMemo(() => {
    const set =
      <K extends keyof StudioState>(key: K) =>
      (value: StudioState[K]) =>
        edit({ ...state, [key]: value })
    return { state, designSystem, set, setState: edit }
  }, [state, designSystem])
}
