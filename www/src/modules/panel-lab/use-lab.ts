"use client"

/* The lab's design-system state: one store per mounted panel. Design only —
   local state in, callback out, nothing wired into the real /create. */

import { useMemo, useState } from "react"

import { DEFAULTS } from "./data"
import type { Lab, LabState } from "./data"

export function useLab(): Lab {
  const [state, setState] = useState<LabState>(DEFAULTS)

  return useMemo(() => {
    const set =
      <K extends keyof LabState>(key: K) =>
      (value: LabState[K]) =>
        setState((prev) => ({ ...prev, [key]: value }))

    const section = (keys: (keyof LabState)[]) => ({
      modified: keys.some((key) => state[key] !== DEFAULTS[key]),
      onReset: () =>
        setState((prev) => ({
          ...prev,
          ...(Object.fromEntries(
            keys.map((key) => [key, DEFAULTS[key]]),
          ) as Partial<LabState>),
        })),
    })

    return { state, set, section }
  }, [state])
}

/** A read-only lab at defaults — for the gallery's non-interactive previews. */
export function useStaticLab(): Lab {
  return useMemo(
    () => ({
      state: DEFAULTS,
      set: () => () => {},
      section: () => ({ modified: false, onReset: () => {} }),
    }),
    [],
  )
}
