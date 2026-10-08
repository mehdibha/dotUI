/* Saved → effective: follows resolve, then at most one rule per key, in an
   order computed once from the key graph. Saved state is never mutated. */

import type { Cond, Effect, Explained, Follow, Rule } from "./types"

type State = Readonly<Record<string, unknown>>

export interface EngineInput {
  defaults: State
  follows: Readonly<Record<string, readonly Follow[]>>
  rules: readonly Rule[]
}

export interface EffectiveResult {
  values: State
  /** Only keys a follow or rule can touch. */
  explain: Readonly<Record<string, Explained>>
}

export const condKeys = (cond: Cond): string[] =>
  "all" in cond
    ? cond.all.flatMap(condKeys)
    : "any" in cond
      ? cond.any.flatMap(condKeys)
      : [cond.key]

export function holds(cond: Cond, values: State): boolean {
  if ("all" in cond) return cond.all.every((c) => holds(c, values))
  if ("any" in cond) return cond.any.some((c) => holds(c, values))
  const value = values[cond.key]
  return "in" in cond ? cond.in.includes(value) : !cond.notIn.includes(value)
}

const followSources = (follow: Follow): readonly string[] =>
  typeof follow.from === "string" ? [follow.from] : follow.from

/** Each touched key → the keys it reads (follow sources, rule conditions). */
export function keyGraph({ follows, rules }: EngineInput) {
  const graph = new Map<string, Set<string>>()
  const node = (key: string) => {
    let deps = graph.get(key)
    if (!deps) graph.set(key, (deps = new Set()))
    return deps
  }
  for (const [key, list] of Object.entries(follows))
    for (const follow of list)
      for (const from of followSources(follow)) node(key).add(from)
  for (const rule of rules)
    for (const key of condKeys(rule.when)) node(rule.target).add(key)
  return graph
}

/** A dependency cycle as a path (`a → b → a`), else undefined. */
export function findCycle(
  graph: Map<string, Set<string>>,
): string[] | undefined {
  const state = new Map<string, "open" | "done">()
  const stack: string[] = []
  const visit = (key: string): string[] | undefined => {
    if (state.get(key) === "done") return
    if (state.get(key) === "open")
      return [...stack.slice(stack.indexOf(key)), key]
    state.set(key, "open")
    stack.push(key)
    for (const dep of graph.get(key) ?? []) {
      const cycle = visit(dep)
      if (cycle) return cycle
    }
    stack.pop()
    state.set(key, "done")
  }
  for (const key of graph.keys()) {
    const cycle = visit(key)
    if (cycle) return cycle
  }
}

/** Touched keys, sources first. A cycle is a test failure, never a throw. */
function topoOrder(graph: Map<string, Set<string>>): string[] {
  const order: string[] = []
  const seen = new Set<string>()
  const visit = (key: string) => {
    if (seen.has(key)) return
    seen.add(key)
    for (const dep of graph.get(key) ?? []) if (graph.has(dep)) visit(dep)
    order.push(key)
  }
  for (const key of graph.keys()) visit(key)
  return order
}

export function resolveFollow(follow: Follow, values: State): unknown {
  if (follow.kind === "same") {
    const source = values[follow.from]
    return follow.map?.[String(source)] ?? source
  }
  const at = followSources(follow)
    .map((key) => String(values[key]))
    .join("|")
  return Object.hasOwn(follow.table, at)
    ? follow.table[at]
    : Object.values(follow.table)[0]
}

export function createEngine(input: EngineInput) {
  const { defaults, follows, rules } = input
  const order = topoOrder(keyGraph(input))
  const rulesByTarget = new Map<string, Rule[]>()
  for (const rule of rules)
    rulesByTarget.set(rule.target, [
      ...(rulesByTarget.get(rule.target) ?? []),
      rule,
    ])

  const followFor = (key: string, value: unknown) =>
    follows[key]?.find((follow) => follow.id === value)

  /** The default as it resolves now (a follow default reads its source). */
  const resolvedDefault = (key: string, values: State) => {
    const value = defaults[key]
    const follow = followFor(key, value)
    return follow ? resolveFollow(follow, values) : value
  }

  function apply(effect: Effect, key: string, value: unknown, values: State) {
    switch (effect.kind) {
      case "pin":
        return effect.value
      case "hide":
        return "value" in effect ? effect.value : resolvedDefault(key, values)
      case "exclude":
        if ("options" in effect)
          return effect.options.includes(value as string)
            ? effect.fallback
            : value
        if (typeof value !== "number") return value
        if (effect.above !== undefined && value > effect.above)
          return effect.above
        if (effect.below !== undefined && value < effect.below)
          return effect.below
        return value
    }
  }

  const memo = new WeakMap<object, EffectiveResult>()

  function effective(saved: State): EffectiveResult {
    const hit = memo.get(saved)
    if (hit) return hit
    const values: Record<string, unknown> = { ...saved }
    const explain: Record<string, Explained> = {}
    for (const key of order) {
      let value = saved[key]
      const entry: Explained = { saved: value, effective: value }
      const follow = followFor(key, value)
      if (follow) {
        value = resolveFollow(follow, values)
        entry.via = follow.id
      }
      for (const rule of rulesByTarget.get(key) ?? []) {
        if (!holds(rule.when, values)) continue
        const { effect } = rule
        if (effect.kind === "exclude") {
          const { kind: _, ...limits } = effect
          entry.exclude ??= { rule: rule.id, cause: rule.cause, ...limits }
        } else {
          entry.lock = { rule: rule.id, kind: effect.kind, cause: rule.cause }
        }
        const next = apply(effect, key, value, values)
        if (next !== value) {
          value = next
          entry.rule = rule.id
          break
        }
        if (effect.kind !== "exclude") break
      }
      values[key] = value
      entry.effective = value
      explain[key] = entry
    }
    const result = { values, explain }
    memo.set(saved, result)
    return result
  }

  return { effective, order }
}
