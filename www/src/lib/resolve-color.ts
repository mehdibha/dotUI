// The preview iframe receives each config as a fresh structuredClone, so the
// cache keys by content rather than reference.
import { resolveColorConfig } from "@/registry/theme"
import type { ColorConfig } from "@/registry/theme"

const MAX_ENTRIES = 16
const cache = new Map<string, ReturnType<typeof resolveColorConfig>>()

/** A content key for `color`: equal configs give equal keys, key order aside. */
export function colorKey(color: ColorConfig): string {
  return JSON.stringify(color, (_key, v: unknown) =>
    v && typeof v === "object" && !Array.isArray(v)
      ? Object.fromEntries(
          Object.entries(v).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
        )
      : v,
  )
}

export function resolveColorConfigCached(color: ColorConfig) {
  const key = colorKey(color)
  let resolved = cache.get(key)
  if (resolved) {
    cache.delete(key)
  } else {
    resolved = resolveColorConfig(color)
    const oldest = cache.keys().next().value
    if (cache.size >= MAX_ENTRIES && oldest !== undefined) cache.delete(oldest)
  }
  cache.set(key, resolved)
  return resolved
}
