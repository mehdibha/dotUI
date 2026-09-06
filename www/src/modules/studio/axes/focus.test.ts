import { describe, expect, test } from "vitest"

import { DEFAULT_COLOR_CONFIG } from "@/registry/theme"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

const resolve = (overrides: Partial<typeof DEFAULTS>) =>
  resolveDesignSystem({ ...DEFAULTS, ...overrides })

describe("focus axis", () => {
  test("defaults emit nothing", () => {
    const system = resolve({})
    expect(system.tokens).toEqual({})
    expect(system.color).toBeUndefined()
  })

  test("ring geometry lands on the ring tokens", () => {
    expect(resolve({ focusWidth: 3 }).tokens).toEqual({
      "--focus-ring-width": "3px",
    })
    expect(resolve({ focusOffset: "flush" }).tokens).toEqual({
      "--focus-ring-offset": "0px",
    })
    expect(resolve({ focusOffset: "inset" }).tokens).toEqual({
      "--focus-ring-inset": "inset",
      "--focus-ring-offset": "0px",
    })
    expect(resolve({ focusGap: 4 }).tokens).toEqual({
      "--focus-ring-offset": "4px",
    })
  })

  test("halo mixes the ring color; duo adds the inner stroke", () => {
    expect(
      resolve({ focusStyle: "halo", focusHaloStrength: 60 }).tokens,
    ).toEqual({
      "--focus-ring-color":
        "color-mix(in oklab, var(--color-border-focus) 60%, transparent)",
    })
    expect(resolve({ focusStyle: "duo", focusOffset: "inset" }).tokens).toEqual(
      { "--focus-ring-inner": "1px", "--focus-ring-offset": "0px" },
    )
  })

  test("input styles ride the input tokens", () => {
    expect(
      resolve({ focusInputWidth: 4, focusInputStrength: 50 }).tokens,
    ).toEqual({
      "--focus-input-width": "4px",
      "--focus-input-color":
        "color-mix(in oklab, var(--color-border-focus) 50%, transparent)",
    })
    expect(
      resolve({ focusInputStyle: "ring", focusOffset: "inset" }).tokens,
    ).toEqual({
      "--focus-ring-inset": "inset",
      "--focus-ring-offset": "0px",
      "--focus-input-width": "var(--focus-ring-width)",
      "--focus-input-offset": "var(--focus-ring-offset)",
      "--focus-input-inner": "var(--focus-ring-inner)",
      "--focus-input-color": "var(--focus-ring-color)",
      "--focus-input-inset": "inset",
    })
    expect(
      resolve({ focusInputStyle: "border", focusInputBorderWidth: 2 }).tokens,
    ).toEqual({
      "--focus-input-inset": "inset",
      "--focus-input-offset": "0px",
      "--focus-input-width": "1px",
      "--focus-input-color": "var(--color-border-focus)",
    })
  })

  test("neutral re-points the focus pair over the default recipe", () => {
    const system = resolve({ focusColor: "neutral" })
    expect(system.tokens).toEqual({})
    expect(system.color).toEqual({
      ...DEFAULT_COLOR_CONFIG,
      overrides: {
        "color-border-focus": { palette: "neutral", job: "solid" },
        "color-border-focus-muted": { palette: "neutral", job: "ui-active" },
      },
    })
  })
})
