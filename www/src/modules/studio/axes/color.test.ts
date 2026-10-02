import { describe, expect, it } from "vitest"

import {
  CVD_GATE,
  deltaEok,
  previewSolid,
  STATUS_SEEDS,
  toOklch,
} from "@dotui/colors"

import { DEFAULT_COLOR_CONFIG, resolveColorConfig } from "@/registry/theme"
import { ORIGIN } from "@/modules/presets/presets-data"

import { DEFAULTS } from "."
import type { StudioState } from "."
import { resolveDesignSystem } from "../resolve"
import {
  buildColorConfig,
  isDefaultColorConfig,
  SEMANTIC_PICKS,
  SEMANTIC_ROLES,
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

  it("stores the selection source only when it leaves the primary's", () => {
    const source = (state: Partial<typeof DEFAULTS>) =>
      buildColorConfig({ ...DEFAULTS, ...state }).selection
    expect(source({ selectionColor: "neutral" })).toBeUndefined()
    expect(source({ selectionColor: "accent" })).toBe("accent")
    expect(source(withSource(SOLID_LEAVES, "accent"))).toBeUndefined()
    expect(source({ buttonColor: "accent", selectionColor: "neutral" })).toBe(
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

describe("semantic picks", () => {
  const bases: [string, StudioState][] = [
    ["the defaults", DEFAULTS],
    ["Origin", ORIGIN.state],
  ]

  for (const [name, base] of bases) {
    it(`each ships clean alone on ${name}`, () => {
      for (const role of SEMANTIC_ROLES) {
        for (const pick of SEMANTIC_PICKS[role.palette]) {
          const { report } = resolveColorConfig(
            buildColorConfig({ ...base, [role.key]: pick.hex }),
          )
          expect(report.warnings, `${role.label} ${pick.name}`).toEqual([])
        }
      }
    })
  }

  it("keep Selection clear of Success and Danger", () => {
    const solid = (hex: string) => toOklch(previewSolid(hex).solid)
    const statuses = (["success", "danger"] as const).flatMap((palette) => [
      STATUS_SEEDS[palette],
      ...SEMANTIC_PICKS[palette].map((pick) => pick.hex),
    ])
    for (const pick of SEMANTIC_PICKS.selection)
      for (const status of statuses)
        expect(
          deltaEok(solid(pick.hex), solid(status)),
          `${pick.name} ~ ${status}`,
        ).toBeGreaterThanOrEqual(CVD_GATE.normal)
  })

  it("are distinct within a role", () => {
    for (const role of SEMANTIC_ROLES) {
      const solids = SEMANTIC_PICKS[role.palette].map((pick) => {
        const { light } = resolveColorConfig(
          buildColorConfig({ ...DEFAULTS, [role.key]: pick.hex }),
        )
        return toOklch(light.scales[role.palette]?.["700"] ?? "")
      })
      for (const [i, a] of solids.entries())
        for (const b of solids.slice(i + 1))
          expect(deltaEok(a, b)).toBeGreaterThanOrEqual(0.03)
    }
  })
})
