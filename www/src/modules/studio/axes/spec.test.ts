import { describe, expect, test } from "vitest"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"
import type { StudioState } from "./index"
import { checkAxisValue } from "./spec"
import type { ChapterSpec } from "./spec"

const modules = import.meta.glob<Record<string, unknown>>(
  ["./*.ts", "!./*.test.ts", "!./index.ts", "!./spec.ts", "!./pick.ts"],
  { eager: true },
)

const specs = Object.entries(modules).flatMap(([path, mod]) =>
  Object.entries(mod)
    .filter(([name]) => name.endsWith("_SPEC"))
    .map(([name, spec]) => ({ path, name, spec: spec as ChapterSpec })),
)

const resolved = (state: StudioState) =>
  JSON.stringify(resolveDesignSystem(state))

describe.each(specs)("$name", ({ spec }) => {
  const axes = Object.entries(spec.axes)
  // Options can coincide with a context-dependent default (Items' auto is md
  // under lg Surfaces), so an option is dead only when it changes nothing
  // here and with the chapter's other enums moved off their defaults too.
  const moved = { ...DEFAULTS }
  for (const [key, axis] of axes) {
    if (axis.value.type !== "enum") continue
    const other = axis.value.options.find(
      (option) => option.value !== DEFAULTS[key as keyof StudioState],
    )
    if (other) Object.assign(moved, { [key]: other.value })
  }

  test.each(axes)("%s: its default fits the spec", (key, axis) => {
    expect(checkAxisValue(axis, DEFAULTS[key as keyof StudioState])).toBe(
      undefined,
    )
  })

  test.each(axes)("%s: every other option changes the output", (key, axis) => {
    if (axis.value.type !== "enum") return
    const inert = (base: StudioState, value: string) =>
      resolved({ ...base, [key]: value }) === resolved(base)
    const dead = axis.value.options
      .filter((option) => option.value !== DEFAULTS[key as keyof StudioState])
      .filter(
        (option) =>
          inert(DEFAULTS, option.value) &&
          inert(
            { ...moved, [key]: DEFAULTS[key as keyof StudioState] },
            option.value,
          ),
      )
      .map((option) => option.value)
    expect(dead).toEqual([])
  })

  test.each(spec.recipes ?? [])("recipe $id sets valid values", (recipe) => {
    for (const [key, value] of Object.entries(recipe.set)) {
      const axis = (spec.axes as Record<string, ChapterSpec["axes"][never]>)[
        key
      ]
      expect(axis, `${recipe.id}: ${key} is not an axis`).toBeDefined()
      expect(checkAxisValue(axis!, value)).toBe(undefined)
    }
  })
})

test("every state key has exactly one spec", () => {
  const owners = new Map<string, string[]>()
  for (const { name, spec } of specs)
    for (const key of Object.keys(spec.axes))
      owners.set(key, [...(owners.get(key) ?? []), name])
  const missing = Object.keys(DEFAULTS).filter((key) => !owners.has(key))
  const shared = [...owners].filter(([, names]) => names.length > 1)
  const unknown = [...owners.keys()].filter((key) => !(key in DEFAULTS))
  expect({ missing, shared, unknown }).toEqual({
    missing: [],
    shared: [],
    unknown: [],
  })
})
