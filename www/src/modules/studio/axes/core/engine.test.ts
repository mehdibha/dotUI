import { isDeepStrictEqual } from "node:util"
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
  overridersOf,
  parseState,
  RULES,
  SCHEMA,
  SCOPES,
  setKey,
} from "../index"
import type { StudioState } from "../index"
import { condKeys, createEngine, findCycle, holds, keyGraph } from "./effective"
import type { Cond } from "./types"

type Raw = Record<string, unknown>

const fired = (state: StudioState) =>
  Object.entries(effective(state).explain)
    .filter(([, e]) => e?.rule)
    .map(([key, e]) => `${key}: ${e?.rule}`)

/** `undefined` when `value` is one a resolver may see: valid, never a follow id. */
const checkConcrete = (key: string, value: unknown) =>
  FOLLOWS[key]?.some((follow) => follow.id === value)
    ? `follow id ${String(value)}`
    : checkKey(key, value)

const enumValues = (key: string) => {
  const schema = SCHEMA[key as keyof typeof SCHEMA]?.value
  return schema?.type === "enum" ? schema.values : undefined
}

/** A key's domain: numbers at min, default, max and every value `named`. */
function sample(key: string, named: unknown[] = []): unknown[] {
  const kind = SCHEMA[key as keyof typeof SCHEMA]?.value
  const fallback = DEFAULTS[key as keyof typeof DEFAULTS]
  if (kind?.type === "enum") return [...kind.values]
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

  it("scoped copies are plain `same` follows over the source's vocabulary", () => {
    const scoped = Object.entries(FOLLOWS).flatMap(([key, list]) =>
      list
        .filter((f) => "scoped" in f && f.scoped)
        .map((f) => [key, f] as const),
    )
    expect(scoped.length).toBeGreaterThan(0)
    for (const [key, follow] of scoped) {
      expect(follow.kind, key).toBe("same")
      if (follow.kind !== "same") continue
      expect(follow.map, key).toBeUndefined()
      expect(DEFAULTS[key as keyof typeof DEFAULTS], key).toBe(follow.id)
      expect(enumValues(key), key).toEqual(enumValues(follow.from))
      expect(SCOPES[follow.from], key).toContain(key)
    }
    const copies = Object.values(SCOPES).flat()
    expect(copies.sort()).toEqual(scoped.map(([key]) => key).sort())
  })

  it("param vars write only their item's own --studio-<item>-* vars", () => {
    for (const item of registryUi)
      for (const [param, def] of Object.entries(item.params ?? {}))
        for (const vars of Object.values(
          ("vars" in def && def.vars) || {},
        ) as Record<string, string>[])
          for (const name of Object.keys(vars))
            expect(name, `${item.name}.${param}`).toMatch(
              new RegExp(`^--studio-${item.name}-`),
            )
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
      if (
        effect.kind === "pin" ||
        (effect.kind === "hide" && "value" in effect)
      )
        expect(
          checkConcrete(rule.target, effect.value),
          rule.id,
        ).toBeUndefined()
      if (effect.kind === "exclude" && "options" in effect) {
        const domain = enumValues(rule.target)
        for (const option of [...effect.options, effect.fallback])
          expect(domain, rule.id).toContain(option)
        expect(
          checkConcrete(rule.target, effect.fallback),
          rule.id,
        ).toBeUndefined()
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
      raw[key] = kind.values[Math.floor(r() * kind.values.length)]
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
      expect(again, `state ${i}`).toEqual(values)
      expect(state).toEqual(copy)
      // Only concrete values reach a resolver.
      for (const [key, value] of Object.entries(values))
        expect([key, checkConcrete(key, value)]).toEqual([key, undefined])
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

describe("scoped copies", () => {
  it("a copy edited away makes its global Custom", () => {
    expect(overridersOf(DEFAULT_STATE, "motion")).toEqual([])
    const state = parseState({ buttonMotion: "expressive", menuMotion: "same" })
    expect(overridersOf(state, "motion")).toEqual(["buttonMotion"])
    // A copy picking the global's value explicitly still overrides it.
    expect(
      overridersOf(parseState({ dialogMotion: "standard" }), "motion"),
    ).toEqual(["dialogMotion"])
    expect(overridersOf(state, "buttonMotion")).toEqual([])
  })

  it("setting the global resets every copy in one edit", () => {
    const state = parseState({
      buttonMotion: "expressive",
      feedbackMotion: "none",
      motionEntrance: "fade",
    })
    const next = setKey(state, "motion", "smooth")
    expect(overridersOf(next, "motion")).toEqual([])
    expect(next).toMatchObject({
      motion: "smooth",
      buttonMotion: "same",
      feedbackMotion: "same",
      motionEntrance: "fade",
    })
    // A copy's own edit leaves the global and its siblings alone.
    expect(setKey(state, "buttonMotion", "none")).toMatchObject({
      motion: "standard",
      buttonMotion: "none",
      feedbackMotion: "none",
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
  "color/white-ink-needs-exact": [
    { solidInk: "white" },
    { preserveSeed: true, solidInk: "white" },
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
  "states/ring-hides-field-weight": [
    { focusInputStyle: "ring", focusInputWeight: "thick" },
    { focusInputStyle: "border", focusInputWeight: "thick" },
  ],
  "states/ring-hides-field-ink": [
    { focusInputStyle: "ring", focusInputColor: "neutral" },
    { focusInputStyle: "border", focusInputColor: "neutral" },
  ],
  "states/neutral-ring-owns-field-ink": [
    { focusColor: "neutral", focusInputColor: "accent" },
    { focusInputColor: "accent" },
  ],
  "motion/menus-none-pins-entrance": [
    { menuMotion: "none", motionEntrance: "fade" },
    { motion: "none", menuMotion: "standard", motionEntrance: "fade" },
  ],
  "dialogs/none-pins-entrance": [
    { motion: "none", dialogEntrance: "drop" },
    { dialogMotion: "smooth", dialogEntrance: "drop" },
  ],
  "charts/motion-off": [{ motion: "none" }, { chartMotion: "ease" }],
  "sliders/handle-needs-track": [
    { sliderThumb: "handle", sliderTrack: "hairline" },
    { sliderTrack: "hairline" },
  ],
  "buttons/solid-needs-brand-primary": [
    { buttonColor: "neutral", buttonSecondary: "solid" },
    { buttonSecondary: "solid" },
  ],
  "toggles/solid-secondary-needs-strong-selected": [
    { buttonSecondary: "solid" },
    { buttonColor: "neutral", buttonSecondary: "solid" },
  ],
  "buttons/closed-style-owns-secondary": [
    { buttonStyle: "bevel", buttonSecondary: "outline" },
    { buttonStyle: "hairline", buttonSecondary: "outline" },
  ],
  "buttons/closed-style-owns-press": [
    { buttonStyle: "ledge", buttonPress: "nudge" },
    { buttonPress: "nudge" },
  ],
  "button-groups/ledge-gaps-groups": [
    { buttonStyle: "ledge", groupSeparator: "divider" },
    { groupSeparator: "divider" },
  ],
  "menus/check-or-fill": [
    { menuIndicator: "none" },
    { menuIndicator: "check-start" },
  ],
  "dialogs/frost-only-frosted": [
    { dialogBackdrop: "scrim", dialogFrost: "subtle" },
    { dialogFrost: "subtle" },
  ],
  "dialogs/bleed-needs-open-footer": [
    { dialogSections: "divided", dialogActions: "bleed" },
    { dialogSections: "on-scroll", dialogActions: "bleed" },
  ],
  "navigation/surface-needs-shell": [
    { navMarker: "surface", shellTone: "subtle" },
    { navMarker: "surface", shellTone: "recessed" },
  ],
  "type/14-is-native": [
    { uiTextSize: "14" },
    { uiTextSize: "14", density: "compact" },
  ],
  "type/field-text-native": [
    { fieldTextSize: "large", density: "touch" },
    { fieldTextSize: "large", density: "spacious" },
  ],
  "otp-field/underline-separates-cells": [
    { inputStyle: "underline" },
    { inputStyle: "filled" },
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
    color: isDeepStrictEqual(ds.color, origin.color) ? undefined : ds.color,
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
