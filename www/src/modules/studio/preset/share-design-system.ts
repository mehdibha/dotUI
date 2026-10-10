// Reuses the unchanged parts of a cloned message so the provider's memos hold.

import type { DesignSystem } from "./types"

type Flat = Record<string, string>

function sameFlat(a: Flat, b: Flat) {
  const keys = Object.keys(a)
  return (
    keys.length === Object.keys(b).length &&
    keys.every((key) => Object.hasOwn(b, key) && a[key] === b[key])
  )
}

function sameDeep(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (typeof a !== "object" || typeof b !== "object" || !a || !b) return false
  if (Array.isArray(a) !== Array.isArray(b)) return false
  const keys = Object.keys(a)
  return (
    keys.length === Object.keys(b).length &&
    keys.every(
      (key) =>
        Object.hasOwn(b, key) &&
        sameDeep(
          (a as Record<string, unknown>)[key],
          (b as Record<string, unknown>)[key],
        ),
    )
  )
}

function shareParams(
  prev: DesignSystem["componentParams"],
  next: DesignSystem["componentParams"],
) {
  let reused = Object.keys(prev).length === Object.keys(next).length
  const shared: DesignSystem["componentParams"] = {}
  for (const [component, selections] of Object.entries(next)) {
    const old = prev[component]
    if (old && sameFlat(old, selections)) shared[component] = old
    else {
      shared[component] = selections
      reused = false
    }
  }
  return reused ? prev : shared
}

export function shareDesignSystem(
  prev: DesignSystem,
  next: DesignSystem,
): DesignSystem {
  const componentParams = shareParams(
    prev.componentParams,
    next.componentParams,
  )
  const tokens = sameFlat(prev.tokens, next.tokens) ? prev.tokens : next.tokens
  const color = sameDeep(prev.color, next.color) ? prev.color : next.color
  if (
    componentParams === prev.componentParams &&
    tokens === prev.tokens &&
    color === prev.color &&
    next.density === prev.density &&
    next.icons === prev.icons
  )
    return prev
  return { ...next, componentParams, tokens, color }
}
