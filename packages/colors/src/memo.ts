// Bounded LRU for createTheme's per-palette work; shared values are frozen.

const caches: Map<string, unknown>[] = []
let enabled = true

/** Test hook: bypass (and empty) every memo. */
export function setMemoEnabled(value: boolean): void {
  enabled = value
  for (const cache of caches) cache.clear()
}

export function lru<T>(size: number): (key: string, compute: () => T) => T {
  const cache = new Map<string, T>()
  caches.push(cache)
  return (key, compute) => {
    if (!enabled) return compute()
    // Map order is the recency list: a hit re-inserts, a miss evicts the oldest.
    let value = cache.get(key)
    if (value === undefined) {
      value = deepFreeze(compute())
      if (cache.size >= size) cache.delete(cache.keys().next().value!)
    } else cache.delete(key)
    cache.set(key, value)
    return value
  }
}

function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const child of Object.values(value)) deepFreeze(child)
  }
  return value
}
