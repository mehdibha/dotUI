import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { DEFAULT_COLOR_CONFIG, resolveColorConfig } from "@/registry/theme"
import chartMeta, { chartLooks, lookLine } from "@/registry/ui/chart/meta"
import { publish, selectPublishable } from "@/publisher/publish"

import { designSystemOf } from "../resolve"
import {
  AREA_OPTIONS,
  AXES_OPTIONS,
  BARS_OPTIONS,
  GRID_OPTIONS,
  LEGEND_OPTIONS,
  LINES_OPTIONS,
} from "./charts.meta"
import { DEFAULT_STATE, parseState } from "./index"
import type { StudioState } from "./index"

/** The chart kit as it ships under the studio state. */
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

const LOOKS = {
  axes: ["chartAxes", AXES_OPTIONS],
  grid: ["chartGrid", GRID_OPTIONS],
  lines: ["chartLines", LINES_OPTIONS],
  area: ["chartArea", AREA_OPTIONS],
  bars: ["chartBars", BARS_OPTIONS],
  legend: ["chartLegend", LEGEND_OPTIONS],
} as const

/* The chart motion param each tempo picks. */
const MOTION: Record<string, keyof typeof chartLooks.motion> = {
  none: "none",
  standard: "spring",
  smooth: "ease",
  expressive: "bouncy",
}

const DEFAULT_PARAMS = Object.fromEntries(
  Object.entries(chartMeta.params).map(([key, def]) => [key, def.default]),
)

describe("charts axes", () => {
  it("defaults keep the recipe untouched and every look on its default", () => {
    const ds = designSystemOf(DEFAULT_STATE)
    expect(ds.color).toEqual(DEFAULT_COLOR_CONFIG)
    expect(ds.componentParams.chart).toEqual(DEFAULT_PARAMS)
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

  it("each look's options are its chart param's values", () => {
    for (const [param, [, options]] of Object.entries(LOOKS)) {
      const def = chartMeta.params[param as keyof typeof LOOKS]
      expect(options.map((o) => o.value).sort()).toEqual([...def.values].sort())
    }
    expect(Object.values(MOTION).sort()).toEqual(
      [...chartMeta.params.motion.values].sort(),
    )
  })

  it("each swap names one line of the kit's defaults, unambiguously", () => {
    const base = readFileSync(
      new URL("../../../registry/ui/chart/base.tsx", import.meta.url),
      "utf8",
    )
    const swaps = Object.values(chartMeta.params).flatMap((def) =>
      Object.values(def.source ?? {}).flatMap((swap) => Object.entries(swap)),
    )
    const froms = new Set(swaps.map(([from]) => from))
    for (const from of froms) expect(base.split(from).length).toBe(2)
    for (const [, to] of swaps) {
      for (const from of froms) expect(to.includes(from)).toBe(false)
    }
  })

  it("ships every look as the fields of the kit's look literal", async () => {
    for (const [param, [stateKey, options]] of Object.entries(LOOKS)) {
      for (const { value } of options) {
        const content = await shipped(parseState({ [stateKey]: value }))
        const fields = (
          chartLooks[param as keyof typeof LOOKS] as Record<string, object>
        )[value]
        for (const [key, field] of Object.entries(fields ?? {})) {
          expect(content).toContain(lookLine(key, field))
        }
        expect(content).not.toContain("--studio-")
      }
    }
  })
})

describe("chart motion", () => {
  it("follows the global Motion, else its own pick, as a chart param", () => {
    for (const [tempo, param] of Object.entries(MOTION)) {
      for (const state of [{ motion: tempo }, { chartMotion: tempo }]) {
        const ds = designSystemOf(parseState(state))
        expect(ds.componentParams.chart).toEqual({
          ...DEFAULT_PARAMS,
          motion: param,
        })
      }
    }
    const own = designSystemOf(parseState({ chartMotion: "smooth" }))
    expect(own.tokens).toEqual(designSystemOf(DEFAULT_STATE).tokens)
  })

  it("ships the selected transition in the look literal", async () => {
    for (const [tempo, param] of Object.entries(MOTION)) {
      const content = await shipped(parseState({ chartMotion: tempo }))
      expect(content).toContain(
        lookLine("motion", chartLooks.motion[param].motion),
      )
      expect(content).not.toContain("createParamValue")
      expect(content).not.toContain("--studio-")
    }
  })
})
