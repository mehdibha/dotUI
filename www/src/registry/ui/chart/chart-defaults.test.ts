import type { SceneNode } from "@tanstack/charts"
import { defineChart } from "@tanstack/charts"
import { ruleY } from "@tanstack/charts/rule"
import { createChartRuntime } from "@tanstack/charts/runtime"
import { describe, expect, it } from "vitest"

import { areaChart } from "../chart-area/base"
import { barChart } from "../chart-bar/base"
import { lineChart } from "../chart-line/base"
import type { ChartDefaults } from "./base"
import { chartDefaults, chartScales, withChartDefaults } from "./base"

const rows = [
  { month: "Jan", desktop: 10, mobile: 30 },
  { month: "Feb", desktop: 20, mobile: 5 },
  { month: "Mar", desktop: 15, mobile: 25 },
]

function render(spec: object, defaults: Partial<ChartDefaults> = {}) {
  const definition = withChartDefaults(defineChart(spec as never) as never, {
    defaults: { ...chartDefaults, ...defaults },
  }) as unknown as {
    scales: Record<string, Record<string, unknown>>
    motion: unknown
  }
  const runtime = createChartRuntime()
  const scene = runtime.render(definition as never, { width: 400, height: 300 })
  runtime.destroy()
  return { definition, scene }
}

function nodes(scene: { nodes: readonly SceneNode[] }, kind: string) {
  const found: Record<string, unknown>[] = []
  const walk = (node: SceneNode) => {
    if (node.kind === kind) found.push(node as never)
    if (node.kind === "group") node.children.forEach(walk)
  }
  scene.nodes.forEach(walk)
  return found
}

const lines = lineChart(rows, { x: "month", y: ["desktop", "mobile"] })

describe("chart defaults", () => {
  it("axes: shows the value axis, on the right, with a baseline", () => {
    expect(render(lines).definition.scales.y?.axis).toBe(false)
    expect(
      render(lines, { axes: "labeled" }).definition.scales.y?.axis,
    ).not.toBe(false)
    const { scales } = render(lines, { axes: "right" }).definition
    expect(scales.y?.side).toBe("right")
    expect(scales.x?.axis).toMatchObject({ line: expect.any(Object) })
  })

  it("axes: never moves y onto a side another scale claims", () => {
    const { scales } = render(
      {
        ...lines,
        scales: {
          ...lines.scales,
          margin: { ...chartScales().y, channel: "y", side: "right" },
        },
      },
      { axes: "right" },
    ).definition
    expect(scales.y?.side).toBeUndefined()
  })

  it("grid: dashes every grid and adds the category grid when full", () => {
    const dashed = render(lines, { grid: "dashed" }).definition.scales
    expect(dashed.y?.grid).toMatchObject({ strokeDasharray: "3 3" })
    const full = render(lines, { grid: "full" }).definition.scales
    expect(full.x?.grid).toBeTruthy()
    const bars = barChart(rows, { x: "month", y: "desktop" })
    // A band scale has no gridline to draw between its bars.
    expect(render(bars, { grid: "full" }).definition.scales.x?.grid).toBe(false)
  })

  it("lines: rebuilds the builder's marks with straight segments", () => {
    const curved = (spec: object, look?: Partial<ChartDefaults>) =>
      nodes(render(spec, look).scene, "polyline").some((line) =>
        String(line.path ?? "").includes("C"),
      )
    expect(curved(lines)).toBe(true)
    expect(curved(lines, { lines: "straight" })).toBe(false)
    const stepped = lineChart(rows, { x: "month", y: "desktop", curve: "step" })
    expect(curved(stepped, { lines: "straight" })).toBe(false)
    expect(
      nodes(render(stepped, { lines: "fine" }).scene, "polyline")[0],
    ).toBeDefined()
  })

  it("keeps the marks a spread spec adds while rebuilding the builder's", () => {
    const target = ruleY([12])
    const spec = { ...lines, marks: [...lines.marks, target] }
    const marks = (
      withChartDefaults(defineChart(spec as never) as never, {
        defaults: { ...chartDefaults, lines: "straight" },
      }) as { marks: readonly object[] }
    ).marks
    expect(marks).toContain(target)
    expect(marks[0]).not.toBe(lines.marks[0])
  })

  it("area: fades toward the baseline from declared gradients", () => {
    const area = areaChart(rows, { x: "month", y: "desktop" })
    const { scene } = render(area, { area: "gradient" })
    const fills = nodes(scene, "area").map((node) =>
      String((node.style as { fill?: string })?.fill),
    )
    expect(fills.some((fill) => fill.startsWith("url(#"))).toBe(true)
    expect(
      (
        render(area, { area: "gradient" }).definition as {
          gradients?: unknown[]
        }
      ).gradients?.length,
    ).toBeGreaterThan(0)
  })

  it("bars: caps slim bars at 16px, squares their corners", () => {
    const bars = barChart(rows, { x: "month", y: "desktop" })
    const rect = (look?: Partial<ChartDefaults>) =>
      nodes(render(bars, look).scene, "rect")[0] as {
        width: number
        radius?: unknown
      }
    expect(rect().width).toBeGreaterThan(16)
    expect(rect({ bars: "slim" }).width).toBeLessThanOrEqual(16)
    expect(
      nodes(
        render(barChart(rows, { x: "month", y: "desktop", maxThickness: 40 }), {
          bars: "slim",
        }).scene,
        "rect",
      )[0]?.width,
    ).toBeGreaterThan(16)
  })

  it("legend: shown for several series, placed where the defaults say", () => {
    const legend = (spec: object, look?: Partial<ChartDefaults>) =>
      (
        render(spec, look).definition as {
          color?: { legend?: { placement?: string } }
        }
      ).color?.legend
    expect(legend(lines)).toBeUndefined()
    expect(legend(lines, { legend: "top" })?.placement).toBe("top")
    const single = lineChart(rows, { x: "month", y: "desktop" })
    expect(legend(single, { legend: "bottom" })).toBeUndefined()
    const off = lineChart(rows, {
      x: "month",
      y: ["desktop", "mobile"],
      legend: false,
    })
    expect(legend(off, { legend: "bottom" })).toBeUndefined()
  })

  it("guide: draws a crosshair only for builders that leave it to the defaults", () => {
    const count = (spec: object, look?: Partial<ChartDefaults>) =>
      (render(spec, look).definition as unknown as { marks: unknown[] }).marks
        .length
    expect(count(lines, { guide: "line" })).toBe(count(lines) + 1)
    const opted = lineChart(rows, {
      x: "month",
      y: "desktop",
      crosshair: false,
    })
    expect(count(opted, { guide: "dashed" })).toBe(count(opted))
    const raw = { scales: lines.scales, marks: lines.marks }
    expect(count(raw, { guide: "line" })).toBe(count(raw))
  })

  it("motion: off removes the transition, a definition's own wins", () => {
    expect(render(lines, { motion: "off" }).definition.motion).toBe(false)
    expect(render(lines).definition.motion).toMatchObject({
      transition: { type: "spring" },
    })
    expect(
      render({ ...lines, motion: false }, { motion: "bouncy" }).definition
        .motion,
    ).toBe(false)
  })
})
