/**
 * Per-token remapping (T5 `overrides`, #457): the semantic resolver applies
 * config remaps, delta re-emits carry them, and migration salvages them.
 */

import { describe, expect, test } from "vitest"

import {
  applyTokenOverrides,
  DEFAULT_COLOR_CONFIG,
  DEFAULT_SEMANTICS,
  emitCss,
  emitDarkOverridesCss,
  migrateColorConfig,
  resolveColorConfig,
  resolveTargetLiteral,
  semanticDelta,
  semanticLiterals,
  semanticsFor,
} from "@/registry/theme"

describe("applyTokenOverrides", () => {
  test("a mode-agnostic remap re-points the token ref", () => {
    const vocab = applyTokenOverrides(DEFAULT_SEMANTICS, {
      "color-card": { palette: "neutral", job: "app-bg" },
    })
    expect(vocab["color-card"]!.target).toEqual({
      ref: { palette: "neutral", step: "25" },
    })
    // Category and picker pool survive the remap.
    expect(vocab["color-card"]!.category).toBe("background")
    expect(vocab["color-card"]!.scales).toEqual(
      DEFAULT_SEMANTICS["color-card"]!.scales,
    )
  })

  test("a per-mode remap keeps the default target on the other mode", () => {
    // The Geist case: dark collapses the subtle background onto the app bg.
    const vocab = applyTokenOverrides(DEFAULT_SEMANTICS, {
      "color-card": { dark: { palette: "neutral", job: "app-bg" } },
    })
    expect(vocab["color-card"]!.target).toEqual({
      light: DEFAULT_SEMANTICS["color-card"]!.target,
      dark: { ref: { palette: "neutral", step: "25" } },
    })
    const darkCss = emitDarkOverridesCss({ "color-card": vocab["color-card"]! })
    expect(darkCss).toContain("--color-card: var(--neutral-25);")
  })

  test("unknown token names are inert", () => {
    const vocab = applyTokenOverrides(DEFAULT_SEMANTICS, {
      "color-does-not-exist": { palette: "neutral", job: "solid" },
    })
    expect(vocab).toEqual(DEFAULT_SEMANTICS)
  })

  test("remapped tokens emit the new var reference", () => {
    const css = emitCss(
      semanticsFor({
        overrides: {
          "color-border": { palette: "accent", job: "border-emphasized" },
        },
      }),
    )
    expect(css).toContain("--color-border: var(--accent-600);")
  })
})

describe("semanticLiterals", () => {
  const theme = resolveColorConfig(DEFAULT_COLOR_CONFIG)

  test("refs, on-labels, and literals resolve per mode", () => {
    const { light, dark } = semanticLiterals(DEFAULT_SEMANTICS, theme)
    expect(light["color-bg"]).toBe(theme.light.scales.neutral!["25"])
    expect(dark["color-bg"]).toBe(theme.dark.scales.neutral!["25"])
    expect(light["color-fg-on-success"]).toBe(theme.light.on.success!["700"])
    expect(light["color-overlay"]).toBe("oklch(0 0 0)")
    expect(Object.keys(light)).toEqual(Object.keys(DEFAULT_SEMANTICS))
  })

  test("a per-mode target picks each mode's own recipe", () => {
    const { light, dark } = semanticLiterals(
      { "color-popover": DEFAULT_SEMANTICS["color-popover"]! },
      theme,
    )
    expect(light["color-popover"]).toBe(theme.light.scales.neutral!["50"])
    // Dark mixes 50 and 100 — a literal strictly between the two rungs.
    const l = (value: string) => Number(value.match(/oklch\(([\d.]+)/)?.[1])
    expect(l(dark["color-popover"]!)).toBeGreaterThan(
      l(theme.dark.scales.neutral!["50"]),
    )
    expect(l(dark["color-popover"]!)).toBeLessThan(
      l(theme.dark.scales.neutral!["100"]),
    )
  })

  test("a mix flattens to an oklch literal", () => {
    const value = resolveTargetLiteral(
      { mix: [{ value: "oklch(0.2 0 0)" }, 50, { value: "oklch(0.8 0 0)" }] },
      theme.light,
    )
    expect(value).toBe("oklch(0.5 0 0)")
  })

  test("a ref to a missing ramp throws instead of shipping an empty var", () => {
    expect(() =>
      resolveTargetLiteral(
        { ref: { palette: "selection", step: "700" } },
        theme.light,
      ),
    ).toThrow(/selection-700/)
  })
})

describe("semanticDelta", () => {
  test("empty for the untouched default config", () => {
    expect(semanticDelta(undefined)).toEqual({})
    expect(semanticDelta(DEFAULT_COLOR_CONFIG)).toEqual({})
  })

  test("an accent primary yields the diverging primary + selection clusters", () => {
    // With no `selection` seed the selection cluster mirrors primary, so it
    // diverges alongside it when the primary source flips.
    const delta = semanticDelta({ primary: "accent" })
    expect(Object.keys(delta).length).toBeGreaterThan(0)
    for (const name of Object.keys(delta))
      expect(
        name.startsWith("color-primary") ||
          name.startsWith("color-selection") ||
          name === "color-fg-on-primary" ||
          name === "color-fg-on-selection" ||
          name === "color-fg-primary-disabled",
        name,
      ).toBe(true)
  })

  test("an override yields exactly that token", () => {
    const delta = semanticDelta({
      overrides: { "color-card": { palette: "neutral", job: "app-bg" } },
    })
    expect(Object.keys(delta)).toEqual(["color-card"])
  })
})

describe("migrateColorConfig overrides salvage", () => {
  test("valid overrides survive, junk entries drop field-by-field", () => {
    const config = migrateColorConfig({
      v: 2,
      seeds: { accent: "#0070f7" },
      overrides: {
        "color-card": { palette: "neutral", job: "app-bg" },
        "color-popover": { dark: { palette: "neutral", job: "app-bg" } },
        "color-bad-job": { palette: "neutral", job: "nope" },
        "color-bad-shape": "neutral-25",
        "color-empty": { light: { palette: "", job: "solid" } },
      },
    })
    expect(config.overrides).toEqual({
      "color-card": { palette: "neutral", job: "app-bg" },
      "color-popover": { dark: { palette: "neutral", job: "app-bg" } },
    })
  })

  test("an all-junk table drops to undefined (default encoding)", () => {
    const config = migrateColorConfig({
      v: 2,
      seeds: { accent: "#0070f7" },
      overrides: { "color-card": { job: "app-bg" } },
    })
    expect(config.overrides).toBeUndefined()
  })
})
