import { describe, expect, it } from "vitest"

import { DEFAULT_COLOR_CONFIG } from "@/registry/theme"

import { DEFAULTS } from "."
import { resolveDesignSystem } from "../resolve"
import { buildColorConfig, isDefaultColorConfig } from "./color"

const withModes = (
  light: Partial<(typeof DEFAULTS.modes)[number]>,
  dark: Partial<(typeof DEFAULTS.modes)[number]> = {},
) => ({
  ...DEFAULTS,
  modes: DEFAULTS.modes.map((mode) => ({
    ...mode,
    ...(mode.polarity === "light" ? light : dark),
  })),
})

describe("color axis", () => {
  it("the defaults are the shipped palette, and resolve to no recipe", () => {
    expect(buildColorConfig(DEFAULTS)).toEqual(DEFAULT_COLOR_CONFIG)
    expect(resolveDesignSystem(DEFAULTS).color).toBeUndefined()
  })

  it("maps seeds and engine axes onto ColorConfig, absent when default", () => {
    const { color } = resolveDesignSystem({
      ...DEFAULTS,
      brand: "#5e6ad2",
      primary: "accent",
      successSeed: "#16a34a",
      selectionSeed: "#0072f5",
      neutralHue: 250,
      neutralTint: 2,
      vividness: 1.3,
      preserveSeed: true,
      guarantees: "relaxed",
    })
    expect(color).toEqual({
      v: 2,
      seeds: { accent: "#5e6ad2", success: "#16a34a", selection: "#0072f5" },
      background: { dark: 2 },
      vividness: 1.3,
      neutralTint: 2,
      neutralHue: 250,
      preserveSeed: true,
      guaranteePolicy: "relaxed",
      primary: "accent",
    })
  })

  it("maps the mode pair onto per-polarity backgrounds (0 dark = OLED)", () => {
    expect(
      resolveDesignSystem(withModes({ bg: 97 }, { bg: 0 })).color?.background,
    ).toEqual({ light: 97, dark: "oled" })
  })

  it("high contrast on one mode: strict policy, floors on that mode only", () => {
    const { color } = resolveDesignSystem(withModes({ contrast: "high" }))
    expect(color?.guaranteePolicy).toBe("strict")
    expect(color?.borders).toEqual({
      "*": { "400": { light: 2 }, "500": { light: 3 }, "600": { light: 4.5 } },
    })
    const both = resolveDesignSystem(
      withModes({ contrast: "high" }, { contrast: "high" }),
    ).color
    expect(both?.borders).toEqual({ "*": { "400": 2, "500": 3, "600": 4.5 } })
  })

  it("custom borders fill the modes high contrast does not floor", () => {
    const { color } = resolveDesignSystem({
      ...withModes({}, { contrast: "high" }),
      borderContrast: true,
      border400: 1.5,
    })
    expect(color?.borders).toEqual({
      "*": {
        "400": { light: 1.5, dark: 2 },
        "500": { dark: 3 },
        "600": { dark: 4.5 },
      },
    })
  })

  it("reads a deep-merged default recipe as untouched", () => {
    expect(
      isDefaultColorConfig({
        ...DEFAULT_COLOR_CONFIG,
        borders: {},
        overrides: {},
      }),
    ).toBe(true)
    expect(
      isDefaultColorConfig({ ...DEFAULT_COLOR_CONFIG, primary: "accent" }),
    ).toBe(false)
  })
})
