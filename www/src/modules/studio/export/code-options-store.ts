"use client"

import { createPersistedStore } from "@/lib/persisted-store"
import {
  DEFAULT_CODE_OPTIONS,
  sanitizeCodeOptions,
} from "@/publisher/code-options"
import type { CodeOptions } from "@/publisher/code-options"

/** How the user wants exported code written: their preference, not part of
 *  the design system, so it survives picking or resetting a preset. */
const store = createPersistedStore<CodeOptions>(
  "dotui:code-options",
  DEFAULT_CODE_OPTIONS,
  {
    decode: (raw) => sanitizeCodeOptions(JSON.parse(raw)),
    encode: (options) => {
      const json = JSON.stringify(sanitizeCodeOptions(options))
      return json === JSON.stringify(DEFAULT_CODE_OPTIONS) ? null : json
    },
  },
)

export const useCodeOptions = store.useValue

export function setCodeOption<K extends keyof CodeOptions>(
  key: K,
  value: CodeOptions[K],
) {
  store.update((options) => ({ ...options, [key]: value }))
}
