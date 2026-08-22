"use client"

/* The lab's design-system state: one store per mounted panel. Design only —
   local state in, callback out, nothing wired into the real /create. */

import { useMemo, useState } from "react"

import { DEFAULTS } from "./state"
import type { Lab, LabState } from "./state"

export function useLab(): Lab {
  const [state, setState] = useState<LabState>(DEFAULTS)

  return useMemo(() => {
    const set =
      <K extends keyof LabState>(key: K) =>
      (value: LabState[K]) =>
        setState((prev) => ({ ...prev, [key]: value }))

    const section = (defaults: Partial<LabState>) => ({
      modified: Object.entries(defaults).some(
        ([key, value]) => state[key as keyof LabState] !== value,
      ),
      onReset: () => setState((prev) => ({ ...prev, ...defaults })),
    })

    return { state, set, section }
  }, [state])
}
