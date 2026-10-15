// Bounded LRU memo for createTheme's per-palette work; values are frozen.

export type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T

let enabled = true
let generation = 0

/** Test hook: bypass the memo; every call also empties it. */
export function setMemoEnabled(value: boolean): void {
  enabled = value
  generation++
}

/** `compute` memoized on its arguments' values; it must read nothing else. */
export function memoize<A extends unknown[], T>(
  size: number,
  compute: (...args: A) => T,
): (...args: A) => DeepReadonly<T> {
  const cache = new Map<string, DeepReadonly<T>>()
  let seen = generation
  return (...args) => {
    if (!enabled) return deepFreeze(compute(...args))
    if (seen !== generation) {
      cache.clear()
      seen = generation
    }
    const key = keyOf(args)
    // Map order is the recency list: a hit re-inserts, a miss evicts the oldest.
    let value = cache.get(key)
    if (value === undefined) {
      value = deepFreeze(compute(...args))
      if (cache.size >= size) cache.delete(cache.keys().next().value!)
    } else cache.delete(key)
    cache.set(key, value)
    return value
  }
}

/** Every leaf of `value`, object keys sorted so field order never matters;
 *  strings quoted, so no value spells another. */
function keyOf(value: unknown): string {
  if (typeof value === "string") return JSON.stringify(value)
  if (typeof value !== "object" || value === null)
    return Object.is(value, -0) ? "-0" : String(value)
  if (Array.isArray(value)) return `[${value.map(keyOf).join()}]`
  const record = value as Record<string, unknown>
  const fields = Object.keys(record)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${keyOf(record[k])}`)
  return `{${fields.join()}}`
}

function deepFreeze<T>(value: T): DeepReadonly<T> {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const child of Object.values(value)) deepFreeze(child)
  }
  return value as DeepReadonly<T>
}
