import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { DEFAULT_COLOR_CONFIG, resolveColorConfig } from "@/registry/theme"
import chartMeta from "@/registry/ui/chart/meta"
import { publish, selectPublishable } from "@/publisher/publish"

import { designSystemOf } from "../resolve"
import { DEFAULT_STATE, parseState } from "./index"
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

/* The transition each chart param value ships, as `ui/chart/base.tsx` writes it. */
const TRANSITIONS: Record<string, string> = {
  spring: `{ type: "spring", stiffness: 170, damping: 26 }`,
  ease: `{ type: "tween", duration: 400, easing: "ease" }`,
  bouncy: `{ type: "spring", stiffness: 170, damping: 16 }`,
  none: "false",
}

/* The chart param each tempo picks. */
const PARAM: Record<string, string> = {
  none: "none",
  standard: "spring",
  smooth: "ease",
  expressive: "bouncy",
}

describe("chart motion", () => {
  it("every param value is the chart's own", () => {
    expect(Object.keys(TRANSITIONS).sort()).toEqual(
      [...chartMeta.params.motion.values].sort(),
    )
    expect(PARAM.standard).toBe(chartMeta.params.motion.default)
    const base = readFileSync(
      new URL("../../../registry/ui/chart/base.tsx", import.meta.url),
      "utf8",
    )
    for (const [value, transition] of Object.entries(TRANSITIONS))
      expect(base).toContain(`${value}: ${transition},`)
  })

  it("follows the global Motion, else its own pick, as a chart param", () => {
    for (const [tempo, param] of Object.entries(PARAM)) {
      for (const state of [{ motion: tempo }, { chartMotion: tempo }]) {
        const ds = designSystemOf(parseState(state))
        expect(ds.componentParams.chart).toEqual({
          grid: "solid",
          motion: param,
        })
      }
    }
    const own = designSystemOf(parseState({ chartMotion: "smooth" }))
    expect(own.tokens).toEqual(designSystemOf(DEFAULT_STATE).tokens)
  })

  it("ships the selected transition as a literal", async () => {
    for (const [tempo, param] of Object.entries(PARAM)) {
      const content = await shipped(parseState({ chartMotion: tempo }))
      expect(content).toContain(
        `const systemMotion: Exclude<ChartAnimate, true> = ${TRANSITIONS[param]}`,
      )
      expect(content).not.toContain("createParamValue")
      expect(content).not.toContain("--studio-")
    }
  })
})
