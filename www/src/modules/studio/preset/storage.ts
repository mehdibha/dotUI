"use client"

import { createPersistedStore } from "@/lib/persisted-store"
import { parseStored, readDoc } from "@/modules/studio/doc"
import type { StudioDoc } from "@/modules/studio/doc"

import { ORIGIN_ID } from "./codec"

/**
 * This browser's working design system: the rev-pinned studio query of the
 * document a tab last edited as its own (see studio/doc.ts), or a legacy blob
 * from before the grammar. A bare /studio reopens it, and docs previews render
 * it unless the reader picks another system (see docs/preview-selection.ts).
 */
const workingStore = createPersistedStore<string | undefined>(
  "dotui:preset",
  undefined,
  { decode: (raw) => raw || undefined, encode: (query) => query ?? null },
)

export const loadWorking = workingStore.get
export const saveWorking = workingStore.set
export const useWorking = workingStore.useValue

/** The stored working document; Origin until the studio stores one. */
export const readWorking = (working: string | undefined): StudioDoc =>
  readDoc(working ? parseStored(working) : { preset: ORIGIN_ID })
