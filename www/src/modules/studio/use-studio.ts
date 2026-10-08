"use client"

/* The studio's state hook: the current design system (a view or one of the
   user's systems), what it resolves to and the design system the preview
   renders and export ships. Editing a view fills the unsaved slot. */

import { useMemo } from "react"

import type { DesignSystem } from "@/modules/studio/preset/types"

import { effective, setKey } from "./axes"
import type { Effective, StudioState } from "./axes"
import { resolveDesignSystem } from "./resolve"
import { edit, useCurrent } from "./selection"

export interface Studio {
  /** What the user picked; follow ids ("auto", "same") included. */
  state: StudioState
  /** What the picks resolve to; specimens and recipes read this. */
  effective: Effective
  /** The engine's view: what the preview renders and the export ships. */
  designSystem: DesignSystem
  set: <K extends keyof StudioState & string>(
    key: K,
  ) => (value: StudioState[K]) => void
  setState: (state: StudioState) => void
}

// Every row reads the studio: resolve each state's system once.
const SYSTEMS = new WeakMap<Effective, DesignSystem>()

function systemOf(values: Effective): DesignSystem {
  let system = SYSTEMS.get(values)
  if (!system) SYSTEMS.set(values, (system = resolveDesignSystem(values)))
  return system
}

export function useStudio(): Studio {
  const { state } = useCurrent()
  return useMemo(() => {
    const values = effective(state).values
    const set =
      <K extends keyof StudioState & string>(key: K) =>
      (value: StudioState[K]) =>
        edit(setKey(state, key, value))
    return {
      state,
      effective: values,
      designSystem: systemOf(values),
      set,
      setState: edit,
    }
  }, [state])
}
