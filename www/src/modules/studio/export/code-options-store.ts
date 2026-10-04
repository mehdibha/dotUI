"use client"

import { createPersistedStore } from "@/lib/persisted-store"
import {
  codeFlags,
  DEFAULT_CODE_OPTIONS,
  parseCodeFlags,
} from "@/publisher/code-options"
import type { CodeOptions } from "@/publisher/code-options"

/** How the user wants exported code written: a per-user preference, never
 *  part of a design system. Stored as its `?code=` flags. */
const store = createPersistedStore<CodeOptions>(
  "dotui:code-options",
  DEFAULT_CODE_OPTIONS,
  {
    decode: (raw) => parseCodeFlags(raw) ?? DEFAULT_CODE_OPTIONS,
    encode: (options) => codeFlags(options) || null,
  },
)

export const useCodeOptions = store.useValue

export function setCodeOption<K extends keyof CodeOptions>(
  key: K,
  value: CodeOptions[K],
) {
  store.update((options) => ({ ...options, [key]: value }))
}
