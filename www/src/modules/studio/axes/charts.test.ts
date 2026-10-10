import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { DEFAULT_COLOR_CONFIG, resolveColorConfig } from "@/registry/theme"
import chartMeta from "@/registry/ui/chart/meta"
import { publish, selectPublishable } from "@/publisher/publish"

import { designSystemOf } from "../resolve"
import { MOTION_OPTIONS } from "./charts.meta"
import { DEFAULT_STATE, DEFAULTS, parseState } from "./index"
import type { StudioState } from "./index"

/** What the chart container ships under the studio state. */
async function shipped(state: StudioState = DEFAULT_STATE) {
  const ds = designSystemOf(state)
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
    const ds = designSystemOf(DEFAULT_STATE)
    expect(ds.color).toEqual(DEFAULT_COLOR_CONFIG)
    expect(ds.componentParams.chart).toEqual({
      grid: "solid",
      motion: "spring",
    })
    expect(Object.keys(ds.tokens).some((k) => k.startsWith("--chart"))).toBe(
      false,
    )
  })

  it("a hue-spread palette rides on the color recipe, completed from the default", () => {
    const { color } = designSystemOf(parseState({ chartPalette: "vivid" }))
    expect(color).toEqual({ ...DEFAULT_COLOR_CONFIG, chartPalette: "vivid" })
    if (!color) throw new Error("unreachable")
    const vivid = resolveColorConfig(color).charts
    const tonal = resolveColorConfig(DEFAULT_COLOR_CONFIG).charts
    expect(vivid.light.categorical).not.toEqual(tonal.light.categorical)
    expect(vivid.dark.categorical).not.toEqual(tonal.dark.categorical)
  })

  it("the grid is a param on the chart container", () => {
    for (const chartGrid of ["dashed", "none"]) {
      const ds = designSystemOf(parseState({ chartGrid }))
      expect(ds.componentParams.chart).toEqual({
        grid: chartGrid,
        motion: "spring",
      })
      expect(ds.color).toEqual(DEFAULT_COLOR_CONFIG)
    }
  })
})

/* The transition each option ships, as `ui/chart/base.tsx` writes it. */
const TRANSITIONS: Record<string, string> = {
  spring: `{ type: "spring", stiffness: 170, damping: 26 }`,
  ease: `{ type: "tween", duration: 400, easing: "ease" }`,
  none: "false",
}

describe("chart motion", () => {
  it("the options are the chart's motion param", () => {
    expect(MOTION_OPTIONS.map((o) => o.value)).toEqual([
      ...chartMeta.params.motion.values,
    ])
    expect(DEFAULTS.chartMotion).toBe(chartMeta.params.motion.default)
    const base = readFileSync(
      new URL("../../../registry/ui/chart/base.tsx", import.meta.url),
      "utf8",
    )
    for (const option of MOTION_OPTIONS)
      expect(base).toContain(`${option.value}: ${TRANSITIONS[option.value]},`)
  })

  it("a pick is a chart param, never a token", () => {
    const ds = designSystemOf(parseState({ chartMotion: "ease" }))
    expect(ds.componentParams.chart).toEqual({ grid: "solid", motion: "ease" })
    expect(ds.tokens).toEqual(designSystemOf(DEFAULT_STATE).tokens)
  })

  it("ships the selected transition as a literal", async () => {
    for (const option of MOTION_OPTIONS) {
      const content = await shipped(parseState({ chartMotion: option.value }))
      expect(content).toContain(
        `const systemMotion: Exclude<ChartAnimate, true> = ${TRANSITIONS[option.value]}`,
      )
      expect(content).not.toContain("createParamValue")
      expect(content).not.toContain("--studio-")
    }
  })
})
