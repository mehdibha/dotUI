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
      // Small controls step one rung down from Controls: full → 3xl.
      "--studio-radius-control-sm": "var(--radius-3xl)",
    })
  })

  test("square points every role at 0 — the publisher drops the class", () => {
    expect(resolve(vector("square")).tokens).toEqual({
      "--studio-radius-control": "0",
      "--studio-radius-item": "0",
      "--studio-radius-surface": "0",
      "--studio-radius-panel": "0",
      "--studio-radius-control-sm": "0",
      "--studio-radius-detail": "0",
      "--studio-radius-pill": "0",
    })
  })

  test("details cap at sm, whatever Controls ride", () => {
    expect(resolve(vector("round")).tokens).not.toHaveProperty(
      "--studio-radius-detail",
    )
    expect(resolve({ roleControl: "xs" }).tokens).toMatchObject({
      "--studio-radius-control-sm": "0",
      "--studio-radius-detail": "var(--radius-xs)",
    })
  })

  test("a hand-set role reads as custom", () => {
    expect(activeCharacter({ ...DEFAULTS, rolePanel: "2xl" })).toBeUndefined()
    expect(resolve({ rolePanel: "2xl" }).tokens).toEqual({
      "--studio-radius-panel": "var(--radius-2xl)",
    })
  })
})
