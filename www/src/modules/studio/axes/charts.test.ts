import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { DEFAULT_COLOR_CONFIG, resolveColorConfig } from "@/registry/theme"
import chartMeta from "@/registry/ui/chart/meta"
import { publish, selectPublishable } from "@/publisher/publish"

import { resolveDesignSystem } from "../resolve"
import {
  gridOption,
  motionOption,
  MOTION_OPTIONS,
  paletteOption,
} from "./charts"
import { DEFAULTS } from "./index"
import type { StudioState } from "./index"

/** What the chart container ships under the studio state. */
async function shipped(state: StudioState = DEFAULTS) {
  const ds = resolveDesignSystem(state)
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
  return item.files?.[0]?.content ?? ""
}

describe("charts axes", () => {
  it("defaults keep the recipe untouched and the grid solid", () => {
    const ds = resolveDesignSystem(DEFAULTS)
    expect(ds.color).toBeUndefined()
    expect(ds.componentParams.chart).toEqual({
      grid: "solid",
      motion: "spring",
    })
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

  it("a stored value outside the options (the pre-rename `auto`) reads as the default", () => {
    const ds = resolveDesignSystem({
      ...DEFAULTS,
      chartPalette: "auto",
      chartGrid: "dotted",
      chartMotion: "bouncy",
    })
    expect(ds).toEqual(resolveDesignSystem(DEFAULTS))
    expect(paletteOption("auto")).toBe("mono")
    expect(gridOption("dotted")).toBe("solid")
    expect(motionOption("bouncy")).toBe("spring")
  })

  it("the grid is a param on the chart container", () => {
    for (const chartGrid of ["dashed", "none"]) {
      const ds = resolveDesignSystem({ ...DEFAULTS, chartGrid })
      expect(ds.componentParams.chart).toEqual({
        grid: chartGrid,
        motion: "spring",
      })
      expect(ds.color).toBeUndefined()
    }
  })
})

/* The transition each option ships, as `ui/chart/base.tsx` writes it. */
function transitionSource(option: (typeof MOTION_OPTIONS)[number]): string {
  const { curve } = option
  if (!curve) return "false"
  if (curve.type === "physics")
    return `{ type: "spring", stiffness: ${curve.stiffness}, damping: ${curve.damping} }`
  return `{ type: "tween", duration: 400, easing: "ease" }`
}

describe("chart motion", () => {
  it("the options are the chart's motion param, specimens included", () => {
    expect(MOTION_OPTIONS.map((o) => o.value)).toEqual([
      ...chartMeta.params.motion.values,
    ])
    expect(DEFAULTS.chartMotion).toBe(chartMeta.params.motion.default)
    const base = readFileSync(
      new URL("../../../registry/ui/chart/base.tsx", import.meta.url),
      "utf8",
    )
    for (const option of MOTION_OPTIONS)
      expect(base).toContain(`${option.value}: ${transitionSource(option)},`)
  })

  it("a pick is a chart param, never a token", () => {
    const ds = resolveDesignSystem({ ...DEFAULTS, chartMotion: "wobbly" })
    expect(ds.componentParams.chart).toEqual({
      grid: "solid",
      motion: "wobbly",
    })
    expect(ds.tokens).toEqual(resolveDesignSystem(DEFAULTS).tokens)
  })

  it("ships the selected transition as a literal", async () => {
    for (const option of MOTION_OPTIONS) {
      const content = await shipped({ ...DEFAULTS, chartMotion: option.value })
      expect(content).toContain(
        `const systemMotion: Exclude<ChartAnimate, true> = ${transitionSource(option)}`,
      )
      expect(content).not.toContain("createParamValue")
      expect(content).not.toContain("--studio-")
    }
  })
})
