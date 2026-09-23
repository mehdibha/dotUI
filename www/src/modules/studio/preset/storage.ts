"use client"

import { useMemo } from "react"

import { createPersistedStore } from "@/lib/persisted-store"
import { parseStored, readDoc } from "@/modules/studio/doc"
import type { StudioDoc } from "@/modules/studio/doc"

import { ORIGIN_ID } from "./codec"

/**
 * This browser's working design system: the studio query of the document a
 * tab last edited as its own (see studio/doc.ts), or a legacy blob from
 * before the grammar. A bare /studio reopens it; docs previews render it.
 */
const workingStore = createPersistedStore<string | undefined>(
  "dotui:preset",
  undefined,
  { decode: (raw) => raw || undefined, encode: (query) => query ?? null },
)

export const loadWorking = workingStore.get
export const saveWorking = workingStore.set
export const useWorking = workingStore.useValue

/** The working document; Origin until the studio stores one. */
export function useWorkingDoc(): StudioDoc {
  const working = useWorking()
  return useMemo(
    () => readDoc(working ? parseStored(working) : { preset: ORIGIN_ID }),
    [working],
  )
}
