import { describe, expect, it } from "vitest"

import { DEFAULT_COLOR_CONFIG, resolveColorConfig } from "@/registry/theme"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

describe("charts axes", () => {
  it("defaults keep the recipe untouched and the grid solid", () => {
    const ds = resolveDesignSystem(DEFAULTS)
    expect(ds.color).toBeUndefined()
    expect(ds.componentParams.chart).toEqual({ grid: "solid" })
    expect(Object.keys(ds.tokens).some((k) => k.startsWith("--chart"))).toBe(
      false,
    )
  })

  it("a hue-spread palette rides on the color recipe, completed from the default", () => {
    const { color } = resolveDesignSystem({
      ...DEFAULTS,
      chartPalette: "vivid",
    })
    expect(color).toEqual({ ...DEFAULT_COLOR_CONFIG, chartPalette: "vivid" })
    if (!color) throw new Error("unreachable")
    const vivid = resolveColorConfig(color).charts
    const tonal = resolveColorConfig(DEFAULT_COLOR_CONFIG).charts
    expect(vivid.light.categorical).not.toEqual(tonal.light.categorical)
    expect(vivid.dark.categorical).not.toEqual(tonal.dark.categorical)
  })

  it("the grid is a param on the chart container", () => {
    for (const chartGrid of ["dashed", "none"]) {
      const ds = resolveDesignSystem({ ...DEFAULTS, chartGrid })
      expect(ds.componentParams.chart).toEqual({ grid: chartGrid })
      expect(ds.color).toBeUndefined()
    }
  })
})
