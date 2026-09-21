import { describe, expect, test } from "vitest"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"
import { activeCharacter, SHAPE_CHARACTERS } from "./shape"

const resolve = (overrides: Partial<typeof DEFAULTS>) =>
  resolveDesignSystem({ ...DEFAULTS, ...overrides })

const vector = (id: string) =>
  SHAPE_CHARACTERS.find((character) => character.id === id)!.vector

describe("shape axis", () => {
  test("defaults emit nothing", () => {
    expect(resolve({}).tokens).toEqual({})
    expect(activeCharacter(DEFAULTS)).toBe("standard")
  })

  test("the base lands on --radius in rem", () => {
    expect(resolve({ radiusPx: 12 }).tokens).toEqual({ "--radius": "0.75rem" })
  })

  test("a character retargets only the roles it moves", () => {
    expect(resolve(vector("crisp")).tokens).toEqual({
      "--studio-radius-surface": "var(--radius-md)",
      // Items follow Surfaces one rung down: md → sm.
      "--studio-radius-item": "var(--radius-sm)",
    })
    expect(resolve(vector("pill")).tokens).toEqual({
      "--studio-radius-control": "var(--radius-full)",
    })
  })

  test("square points every role at 0 — the publisher drops the class", () => {
    expect(resolve(vector("square")).tokens).toEqual({
      "--studio-radius-control": "0",
      "--studio-radius-item": "0",
      "--studio-radius-surface": "0",
      "--studio-radius-panel": "0",
    })
  })

  test("a hand-set role reads as custom", () => {
    expect(activeCharacter({ ...DEFAULTS, rolePanel: "2xl" })).toBeUndefined()
    expect(resolve({ rolePanel: "2xl" }).tokens).toEqual({
      "--studio-radius-panel": "var(--radius-2xl)",
    })
  })

  test("corner shape ships as its own token", () => {
    expect(resolve({ cornerShape: "squircle" }).tokens).toEqual({
      "--corner-shape": "squircle",
    })
  })
})
