"use client"

/* The studio's state hook: the current design system (a view or one of the
   user's systems), what it resolves to, and its edits. Editing a view fills
   the unsaved slot. */

import { useMemo } from "react"

import { effective } from "./axes"
import type { Effective, StudioState } from "./axes"
import { edit, getCurrent, useCurrent } from "./selection"

export interface Studio {
  /** What the user picked; follow ids ("auto", "same") included. */
  state: StudioState
  /** What the picks resolve to; specimens and recipes read this. */
  effective: Effective
  /** One setter per key, the same one every render. */
  set: <K extends keyof StudioState & string>(
    key: K,
  ) => (value: StudioState[K]) => void
  setState: (state: StudioState) => void
}

const setters = new Map<string, (value: never) => void>()

// Edits the state current at the call, never the one a render closed over.
function set<K extends keyof StudioState & string>(key: K) {
  let setter = setters.get(key)
  if (!setter) {
    setter = (value) => edit({ ...getCurrent().state, [key]: value })
    setters.set(key, setter)
  }
  return setter as (value: StudioState[K]) => void
}

export function useStudio(): Studio {
  const { state } = useCurrent()
  return useMemo(
    () => ({ state, effective: effective(state).values, set, setState: edit }),
    [state],
  )
}
