import { describe, expect, it } from "vitest"

import { FONT_CATALOG } from "@/lib/fonts"
import { registryUi } from "@/registry/ui/registry"

import { designSystemOf, resolveDesignSystem } from "../../resolve"
import {
  CHAPTERS,
  checkKey,
  DEFAULT_EFFECTIVE,
  DEFAULT_STATE,
  DEFAULTS,
  effective,
  FOLLOWS,
  KEY_OWNER,
  parseState,
  RULES,
  SCHEMA,
} from "../index"
import type { StudioState } from "../index"
import { sameValue } from "../schema"
import { condKeys, createEngine, findCycle, holds, keyGraph } from "./effective"
import type { Cond } from "./types"

type Raw = Record<string, unknown>

const fired = (state: StudioState) =>
  Object.entries(effective(state).explain)
    .filter(([, e]) => e?.rule)
    .map(([key, e]) => `${key}: ${e?.rule}`)

const enumValues = (key: string) => {
  const schema = SCHEMA[key as keyof typeof SCHEMA]?.value
  return schema?.type === "enum"
    ? schema.options.map((o) => o.value)
    : undefined
}

/** A key's domain: numbers at min, default, max and every value `named`. */
function sample(key: string, named: unknown[] = []): unknown[] {
  const kind = SCHEMA[key as keyof typeof SCHEMA]?.value
  const fallback = DEFAULTS[key as keyof typeof DEFAULTS]
  if (kind?.type === "enum") return kind.options.map((o) => o.value)
  if (kind?.type === "number")
    return [...new Set([kind.min, fallback, kind.max, ...named])]
  if (kind?.type === "boolean") return [false, true]
  return [fallback]
}

/** The values a condition names for `key`. */
const literals = (cond: Cond, key: string): unknown[] =>
  "all" in cond
    ? cond.all.flatMap((c) => literals(c, key))
    : "any" in cond
      ? cond.any.flatMap((c) => literals(c, key))
      : cond.key === key
        ? [...("in" in cond ? cond.in : cond.notIn)]
        : []

describe("catalog", () => {
  it("every key has one owner and a default its schema accepts", () => {
    const keys = CHAPTERS.flatMap((chapter) => Object.keys(chapter.defaults))
    expect(new Set(keys).size).toBe(keys.length)
    expect(Object.keys(SCHEMA).sort()).toEqual([...keys].sort())
    for (const key of keys)
      expect([
        key,
        checkKey(key, DEFAULTS[key as keyof typeof DEFAULTS]),
      ]).toEqual([key, undefined])
  })

  it("follows read existing keys and Auto tables cover their source", () => {
    for (const [key, follows] of Object.entries(FOLLOWS)) {
      const ids = follows.map((follow) => follow.id)
      expect(new Set(ids).size, key).toBe(ids.length)
      for (const follow of follows) {
        const from =
          typeof follow.from === "string" ? [follow.from] : follow.from
        for (const source of from) expect(SCHEMA).toHaveProperty(source)
        if (follow.kind !== "auto") continue
        const domains = from.map((source) => enumValues(source))
        expect(domains.every(Boolean), `${key} reads an enum`).toBe(true)
        const combos = domains.reduce<string[]>(
          (acc, values) =>
            acc.flatMap((a) => values!.map((v) => (a ? `${a}|${v}` : v))),
          [""],
        )
        for (const combo of combos) {
          expect(follow.table, `${key} Auto at ${combo}`).toHaveProperty(combo)
          expect(
            checkKey(key, follow.table[combo]),
            `${key} at ${combo}`,
          ).toBeUndefined()
        }
        // A table that maps everything to one value is no pairing.
        expect(new Set(Object.values(follow.table)).size, key).toBeGreaterThan(
          1,
        )
      }
    }
  })

  it("rules are well formed and authored by their target's owner", () => {
    const ids = RULES.map((rule) => rule.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const rule of RULES) {
      expect(rule.id.split("/")[0], rule.id).toBe(KEY_OWNER[rule.target])
      const keys = condKeys(rule.when)
      for (const key of keys) expect(SCHEMA, rule.id).toHaveProperty(key)
      expect(keys, rule.id).toContain(rule.cause)
      expect(keys, rule.id).not.toContain(rule.target)
      const { effect } = rule
      if (effect.kind === "pin")
        expect(checkKey(rule.target, effect.value), rule.id).toBeUndefined()
      if (effect.kind === "exclude" && "options" in effect) {
        const domain = enumValues(rule.target)
        for (const option of [...effect.options, effect.fallback])
          expect(domain, rule.id).toContain(option)
        expect(effect.options, rule.id).not.toContain(effect.fallback)
      }
    }
  })

  it("at most one rule acts on a key at a time", () => {
    const byTarget = new Map<string, typeof RULES>()
    for (const rule of RULES)
      byTarget.set(rule.target, [...(byTarget.get(rule.target) ?? []), rule])
    for (const [target, rules] of byTarget) {
      if (rules.length < 2) continue
      const keys = [...new Set(rules.flatMap((rule) => condKeys(rule.when)))]
      let states: Raw[] = [{}]
      for (const key of keys)
        states = states.flatMap((s) =>
          sample(
            key,
            rules.flatMap((rule) => literals(rule.when, key)),
          ).map((v) => ({ ...s, [key]: v })),
        )
      for (const values of states) {
        const active = rules.filter((rule) => holds(rule.when, values))
        expect(
          active.map((r) => r.id),
          `${target} at ${JSON.stringify(values)}`,
        ).toHaveLength(Math.min(active.length, 1))
      }
    }
  })

  it("the key graph is acyclic", () => {
    const cycle = findCycle(
      keyGraph({ defaults: DEFAULTS, follows: FOLLOWS, rules: RULES }),
    )
    expect(cycle?.join(" → ")).toBeUndefined()
  })

  it("names the path of a cycle", () => {
    const graph = keyGraph({
      defaults: { a: "x", b: "x" },
      follows: { a: [{ kind: "same", id: "same", from: "b" }] },
      rules: [
        {
          id: "t/b",
          target: "b",
          when: { key: "a", in: ["x"] },
          effect: { kind: "hide" },
          cause: "a",
        },
      ],
    })
    expect(findCycle(graph)?.join(" → ")).toBe("a → b → a")
  })
})

describe("Origin", () => {
  it("fires no rule", () => {
    expect(fired(DEFAULT_STATE)).toEqual([])
  })

  it("resolves token-free onto every registry default", () => {
    const ds = resolveDesignSystem(DEFAULT_EFFECTIVE)
    expect(ds.tokens).toEqual({})
    for (const item of registryUi)
      for (const [param, def] of Object.entries(item.params ?? {}))
        expect([
          item.name,
          param,
          ds.componentParams[item.name]?.[param],
        ]).toEqual([item.name, param, def.default])
  })
})

/* Seeded random states over every schema domain, follow ids included. */
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

function randomState(r: () => number): StudioState {
  const raw: Raw = {}
  for (const [key, { value: kind }] of Object.entries(SCHEMA)) {
    const ids = (FOLLOWS[key] ?? []).map((f) => f.id)
    if (ids.length > 0 && r() < 0.3) {
      raw[key] = ids[Math.floor(r() * ids.length)]
      continue
    }
    if (kind.type === "enum")
      raw[key] = kind.options[Math.floor(r() * kind.options.length)]!.value
    else if (kind.type === "number") {
      const step = kind.step ?? 1
      const n = Math.round((kind.max - kind.min) / step)
      raw[key] = Number(
        (kind.min + Math.floor(r() * (n + 1)) * step).toPrecision(12),
      )
    } else if (kind.type === "boolean") raw[key] = r() < 0.5
    else if (kind.type === "font")
      raw[key] = FONT_CATALOG[Math.floor(r() * FONT_CATALOG.length)]!.family
  }
  return parseState(raw)
}

describe("effective", () => {
  it("is idempotent and never touches saved state", () => {
    const r = rng(7)
    for (let i = 0; i < 300; i++) {
      const state = randomState(r)
      const copy = structuredClone(state)
      const { values } = effective(state)
      const again = effective(values as unknown as StudioState).values
      expect(sameValue(again, values), `state ${i}`).toBe(true)
      expect(state).toEqual(copy)
      // Only concrete values reach a resolver.
      for (const [key, value] of Object.entries(values))
        expect([key, checkKey(key, value)]).toEqual([key, undefined])
    }
  })

  it("is memoized on the saved object", () => {
    const state = parseState({ iconLibrary: "hugeicons" })
    expect(effective(state)).toBe(effective(state))
  })

  it("records pin/hide locks even when the value already matched", () => {
    const { explain } = effective(parseState({ iconLibrary: "phosphor" }))
    expect(explain.iconStroke).toMatchObject({
      via: "auto",
      lock: { kind: "hide", rule: "icons/stroke-only-line-sets" },
    })
    expect(explain.iconStroke?.rule).toBeUndefined()
  })

  it("pins, and resolves a `same` map", () => {
    const { effective: run } = createEngine({
      defaults: { a: "x", b: "same", c: "free" },
      follows: {
        b: [{ kind: "same", id: "same", from: "a", map: { x: "y" } }],
      },
      rules: [
        {
          id: "t/c",
          target: "c",
          when: { key: "b", in: ["y"] },
          effect: { kind: "pin", value: "held" },
          cause: "b",
        },
      ],
    })
    const { values, explain } = run({ a: "x", b: "same", c: "free" })
    expect(values).toEqual({ a: "x", b: "y", c: "held" })
    expect(explain.c).toMatchObject({
      rule: "t/c",
      lock: { kind: "pin", cause: "b" },
    })
  })
})

/* One fire and one no-fire per rule: [rule, fires, holds back]. */
const FIXTURES: Record<string, [Raw, Raw]> = {
  "color/grouped-page": [
    {
      surfaceLayers: "grouped",
      surfaceEdge: "none",
      surfaceShadow: "flat",
      lightBg: 100,
    },
    {
      surfaceLayers: "grouped",
      surfaceEdge: "line",
      surfaceShadow: "flat",
      lightBg: 100,
    },
  ],
  "surfaces/flat-needs-separation": [
    { surfaceEdge: "none" },
    { surfaceEdge: "none", surfaceLayers: "tonal" },
  ],
  "icons/stroke-only-line-sets": [
    { iconLibrary: "phosphor", iconStroke: 2.5 },
    { iconLibrary: "tabler", iconStroke: 2.5 },
  ],
  "icons/weight-only-phosphor": [
    { iconWeight: "bold" },
    { iconLibrary: "phosphor", iconWeight: "bold" },
  ],
  "focus/focusOffset-inert": [
    { focusStyle: "duo", focusOffset: "inset" },
    { focusStyle: "halo", focusOffset: "inset" },
  ],
  "focus/focusGap-inert": [
    { focusOffset: "flush", focusGap: 4 },
    { focusGap: 4 },
  ],
  "focus/focusHaloStrength-inert": [
    { focusHaloStrength: 80 },
    { focusStyle: "halo", focusHaloStrength: 80 },
  ],
  "focus/focusInputWidth-inert": [
    { focusInputStyle: "ring", focusInputWidth: 4 },
    { focusInputWidth: 4 },
  ],
  "focus/focusInputStrength-inert": [
    { focusInputStyle: "border", focusInputStrength: 60 },
    { focusInputStrength: 60 },
  ],
  "focus/focusInputBorderWidth-inert": [
    { focusInputBorderWidth: 3 },
    { focusInputStyle: "border", focusInputBorderWidth: 3 },
  ],
  "spinner/curve-only-ring": [
    {
      spinnerStyle: "dots",
      loaderMotion: { ...DEFAULTS.loaderMotion, ease: [0.4, 0, 0.2, 1] },
    },
    { loaderMotion: { ...DEFAULTS.loaderMotion, ease: [0.4, 0, 0.2, 1] } },
  ],
  "input-groups/divider-only-boxed": [
    { addonDivider: "none" },
    { addonLayout: "boxed", addonDivider: "none" },
  ],
}

/** What a state ships beyond Origin. */
function shipped(raw: Raw) {
  const ds = designSystemOf(parseState(raw))
  const origin = designSystemOf(DEFAULT_STATE)
  return {
    tokens: ds.tokens,
    params: Object.fromEntries(
      Object.entries(ds.componentParams).filter(
        ([c, s]) => s !== origin.componentParams[c],
      ),
    ),
    color: sameValue(ds.color, origin.color) ? undefined : ds.color,
    icons: ds.icons,
  }
}

describe("rules", () => {
  it("each has a fixture", () => {
    expect(Object.keys(FIXTURES).sort()).toEqual(RULES.map((r) => r.id).sort())
  })

  for (const rule of RULES) {
    it(`${rule.id}: fires, then holds back`, () => {
      const [fire, hold] = FIXTURES[rule.id] ?? [{}, {}]
      const on = effective(parseState(fire))
      expect(on.explain[rule.target as keyof typeof on.explain]?.rule).toBe(
        rule.id,
      )
      const off = effective(parseState(hold))
      expect(
        off.explain[rule.target as keyof typeof off.explain]?.rule,
      ).toBeUndefined()
      expect(shipped(fire)).toMatchSnapshot()
    })
  }
})

describe("interning", () => {
  it("equal selections are one object, across resolves and edits", () => {
    const a = designSystemOf(DEFAULT_STATE)
    const b = designSystemOf(parseState({ radiusPx: 12 }))
    for (const [component, selections] of Object.entries(a.componentParams))
      expect(b.componentParams[component], component).toBe(selections)
    const menus = designSystemOf(parseState({ menuHighlight: "accent" }))
    expect(menus.componentParams.menu).not.toBe(a.componentParams.menu)
    expect(menus.componentParams.button).toBe(a.componentParams.button)
    expect(Object.isFrozen(a.componentParams.button)).toBe(true)
  })
})
