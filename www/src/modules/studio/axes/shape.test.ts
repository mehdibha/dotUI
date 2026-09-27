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
    // vega: menus md over sm items, in-page containers stay lg, xs buttons
    // don't step down, cards ride panels.
    expect(resolve(vector("crisp")).tokens).toEqual({
      "--studio-radius-surface": "var(--radius-md)",
      "--studio-radius-item": "var(--radius-sm)",
      "--studio-radius-card": "var(--radius-xl)",
      "--studio-radius-control-sm": "var(--radius-md)",
    })
    // luma: big controls turn small parts into pills and cap fields at 2xl.
    expect(resolve(vector("round")).tokens).toEqual({
      "--studio-radius-control": "var(--radius-3xl)",
      "--studio-radius-item": "var(--radius-2xl)",
      "--studio-radius-surface": "var(--radius-2xl)",
      "--studio-radius-panel": "var(--radius-3xl)",
      "--studio-radius-card": "var(--radius-3xl)",
      "--studio-radius-control-sm": "var(--radius-3xl)",
      "--studio-radius-small": "var(--radius-2xl)",
      "--studio-radius-field": "var(--radius-2xl)",
      "--studio-radius-container": "var(--radius-2xl)",
      "--studio-radius-inline-item": "var(--radius-2xl)",
    })
  })

  test("cards step below panels only when controls sit below surfaces", () => {
    expect(resolve({}).tokens).not.toHaveProperty("--studio-radius-card")
    expect(resolve(vector("gentle")).tokens).toMatchObject({
      "--studio-radius-card": "var(--radius-xl)",
      // nova's xs buttons step down from lg.
      "--studio-radius-control-sm": "var(--radius-md)",
    })
  })

  test("square points every role at 0 — the publisher drops the class", () => {
    expect(resolve(vector("square")).tokens).toEqual({
      "--studio-radius-control": "0",
      "--studio-radius-item": "0",
      "--studio-radius-surface": "0",
      "--studio-radius-panel": "0",
      "--studio-radius-card": "0",
      "--studio-radius-control-sm": "0",
      "--studio-radius-detail": "0",
      "--studio-radius-small": "0",
      "--studio-radius-pill": "0",
      "--studio-radius-field": "0",
      "--studio-radius-container": "0",
      "--studio-radius-inline-item": "0",
    })
  })

  test("details cap at sm, whatever Controls ride", () => {
    expect(resolve(vector("round")).tokens).not.toHaveProperty(
      "--studio-radius-detail",
    )
    expect(resolve({ roleControl: "xs" }).tokens).toMatchObject({
      "--studio-radius-control-sm": "0",
      "--studio-radius-detail": "var(--radius-xs)",
      "--studio-radius-small": "var(--radius-xs)",
    })
  })

  test("pill controls keep pill xs buttons", () => {
    expect(resolve({ roleControl: "full" }).tokens).toMatchObject({
      "--studio-radius-control-sm": "var(--radius-full)",
      "--studio-radius-small": "var(--radius-2xl)",
      "--studio-radius-field": "var(--radius-lg)",
    })
  })

  test("a hand-set role reads as custom", () => {
    expect(activeCharacter({ ...DEFAULTS, rolePanel: "2xl" })).toBeUndefined()
    expect(resolve({ rolePanel: "2xl" }).tokens).toEqual({
      "--studio-radius-panel": "var(--radius-2xl)",
      // Auto cards follow, a rung below.
      "--studio-radius-card": "var(--radius-xl)",
    })
  })
})
