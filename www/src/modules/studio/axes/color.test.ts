import { describe, expect, it } from "vitest"

import {
  CVD_GATE,
  deltaEok,
  previewSolid,
  STATUS_SEEDS,
  toOklch,
} from "@dotui/colors"

import { DEFAULT_COLOR_CONFIG, resolveColorConfig } from "@/registry/theme"
import { ORIGIN } from "@/modules/presets"

import { DEFAULT_STATE, DEFAULTS, parseState } from "."
import type { StudioState } from "."
import { resolveDesignSystem } from "../resolve"
import {
  buildColorConfig,
  SEMANTIC_PICKS,
  SEMANTIC_ROLES,
  SOLID_LEAVES,
  withSource,
} from "./color"

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

describe("semantic picks", () => {
  const bases: [string, StudioState][] = [
    ["the defaults", DEFAULT_STATE],
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
          buildColorConfig({ ...DEFAULT_STATE, [role.key]: pick.hex }),
        )
        return toOklch(light.scales[role.palette]?.["700"] ?? "")
      })
      for (const [i, a] of solids.entries())
        for (const b of solids.slice(i + 1))
          expect(deltaEok(a, b)).toBeGreaterThanOrEqual(0.03)
    }
  })
})
