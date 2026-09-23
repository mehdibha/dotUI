import { describe, expect, it } from "vitest"

import { DEFAULT_COLOR_CONFIG } from "@/registry/theme"

import { DEFAULTS } from "."
import { resolveDesignSystem } from "../resolve"
import {
  buildColorConfig,
  isDefaultColorConfig,
  SOLID_LEAVES,
  withSource,
} from "./color"

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
      ...withSource(SOLID_LEAVES, "accent"),
      successSeed: "#16a34a",
      selectionSeed: "#0072f5",
      neutralHue: 250,
      neutralTint: 2,
      vividness: 1.3,
      preserveSeed: true,
    })
    expect(color).toEqual({
      v: 2,
      seeds: { accent: "#5e6ad2", success: "#16a34a", selection: "#0072f5" },
      background: { dark: 2 },
      vividness: 1.3,
      neutralTint: 2,
      neutralHue: 250,
      preserveSeed: true,
      primary: "accent",
    })
  })

  it("derives the selection source from the checks' majority", () => {
    const source = (state: Partial<typeof DEFAULTS>) =>
      buildColorConfig({ ...DEFAULTS, ...state }).selection
    expect(source({ switchColor: "accent" })).toBeUndefined()
    expect(source({ radioColor: "accent", switchColor: "accent" })).toBe(
      "accent",
    )
    expect(source(withSource(SOLID_LEAVES, "accent"))).toBeUndefined()
    expect(source({ buttonColor: "accent" })).toBe("neutral")
    expect(source({ buttonColor: "accent", checkboxColor: "accent" })).toBe(
      "neutral",
    )
  })

  it("maps the mode pair onto per-polarity backgrounds (0 dark = OLED)", () => {
    expect(
      resolveDesignSystem(withModes({ bg: 97 }, { bg: 0 })).color?.background,
    ).toEqual({ light: 97, dark: "oled" })
  })

  it("reads a deep-merged default recipe as untouched", () => {
    expect(
      isDefaultColorConfig({
        ...DEFAULT_COLOR_CONFIG,
        overrides: {},
      }),
    ).toBe(true)
    expect(
      isDefaultColorConfig({ ...DEFAULT_COLOR_CONFIG, primary: "accent" }),
    ).toBe(false)
  })
})
