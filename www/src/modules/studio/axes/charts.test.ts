import { describe, expect, it } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { DEFAULT_COLOR_CONFIG, resolveColorConfig } from "@/registry/theme"
import { publish, selectPublishable } from "@/publisher/publish"

import { resolveDesignSystem } from "../resolve"
import { DEFAULT_STATE, parseState } from "./index"

describe("charts axes", () => {
  it("defaults keep the recipe untouched", () => {
    const ds = resolveDesignSystem(DEFAULT_STATE)
    expect(ds.color).toEqual(DEFAULT_COLOR_CONFIG)
    expect(ds.componentParams.chart).toBeUndefined()
    expect(Object.keys(ds.tokens).some((k) => k.startsWith("--chart"))).toBe(
      false,
    )
  })

  it("a hue-spread palette rides on the color recipe, completed from the default", () => {
    const { color } = resolveDesignSystem(parseState({ chartPalette: "vivid" }))
    expect(color).toEqual({ ...DEFAULT_COLOR_CONFIG, chartPalette: "vivid" })
    if (!color) throw new Error("unreachable")
    const vivid = resolveColorConfig(color).charts
    const tonal = resolveColorConfig(DEFAULT_COLOR_CONFIG).charts
    expect(vivid.light.categorical).not.toEqual(tonal.light.categorical)
    expect(vivid.dark.categorical).not.toEqual(tonal.dark.categorical)
  })

  it("the chart kit ships with every builder-only var resolved", async () => {
    const ds = resolveDesignSystem(DEFAULT_STATE)
    const preset = {
      density: ds.density,
      componentParams: ds.componentParams,
      tokens: ds.tokens,
    }
    const mod = await publishables["chart"]?.()
    if (!mod) throw new Error("chart is not publishable")
    const { item } = publish({
      publishable: selectPublishable(mod, preset),
      preset,
    })
    const content = item.files?.[0]?.content ?? ""
    expect(content).toContain("export function Chart")
    expect(content).not.toContain("--studio-")
  })
})
