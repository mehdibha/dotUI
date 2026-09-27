import { describe, expect, it } from "vitest"

import { DEFAULT_COLOR_CONFIG } from "@/registry/theme"

import { DEFAULT_STATE, DEFAULTS, parseState } from "."
import { resolveDesignSystem } from "../resolve"
import { buildColorConfig, SOLID_LEAVES, withSource } from "./color"

describe("color axis", () => {
  it("the defaults are the shipped palette, resolved explicitly", () => {
    expect(buildColorConfig(DEFAULT_STATE)).toEqual(DEFAULT_COLOR_CONFIG)
    expect(resolveDesignSystem(DEFAULT_STATE).color).toEqual(
      DEFAULT_COLOR_CONFIG,
    )
  })

  it("maps seeds and engine axes onto ColorConfig, absent when default", () => {
    const { color } = resolveDesignSystem(
      parseState({
        brand: "#5e6ad2",
        ...withSource(SOLID_LEAVES, "accent"),
        successSeed: "#16a34a",
        selectionSeed: "#0072f5",
        neutralHue: 250,
        neutralTint: 2,
        vividness: 1.3,
        preserveSeed: true,
      }),
    )
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

  it("stores the selection source only when it leaves the primary's", () => {
    const source = (state: Partial<typeof DEFAULTS>) =>
      buildColorConfig(parseState({ ...state })).selection
    expect(source({ selectionColor: "accent" })).toBeUndefined()
    expect(source({ selectionColor: "neutral" })).toBe("neutral")
    expect(source(withSource(SOLID_LEAVES, "neutral"))).toBeUndefined()
    expect(source({ buttonColor: "neutral", selectionColor: "accent" })).toBe(
      "accent",
    )
  })

  it("maps the backgrounds onto per-polarity backgrounds (0 dark = OLED)", () => {
    expect(
      resolveDesignSystem(parseState({ lightBg: 97, darkBg: 0 })).color
        ?.background,
    ).toEqual({ light: 97, dark: "oled" })
  })

  it("keeps a neutral primary off the accent default", () => {
    const { color } = resolveDesignSystem(
      parseState(withSource(SOLID_LEAVES, "neutral")),
    )
    expect(color).toBeDefined()
    expect(color?.primary).toBeUndefined()
  })
})
