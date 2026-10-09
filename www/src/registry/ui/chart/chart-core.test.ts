import type {
  ChartPoint,
  ChartTooltipContentContext,
  ChartTooltipOptions,
} from "@tanstack/charts"
import { defineChart } from "@tanstack/charts"
import { barY } from "@tanstack/charts/bar"
import { pie, polar, radialArc } from "@tanstack/charts/polar"
import { createChartRuntime } from "@tanstack/charts/runtime"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"
import { tooltip } from "@tanstack/charts/tooltip"
import { describe, expect, it } from "vitest"

import type { ChartLook } from "./base"
import {
  chartBand,
  chartLegend,
  chartLook,
  chartSliceTooltip,
  polarDecorative,
  withChartLook,
} from "./base"

const rows = [
  { month: "Jan", desktop: 10 },
  { month: "Feb", desktop: 20 },
]

const bars = defineChart({
  scales: {
    x: { scale: chartBand },
    y: { scale: scaleLinear, grid: true, axis: false },
  },
  marks: [barY(rows, { x: "month", y: "desktop", z: () => "Desktop" })],
})

const context = {
  formatX: (value: unknown) => `x:${value}`,
  formatY: (value: unknown) => `y:${value}`,
} as unknown as ChartTooltipContentContext

type Styled = {
  focus: unknown
  keyboard: unknown
  motion: unknown
  tooltip: ChartTooltipOptions
  scales: Record<string, Record<string, unknown>>
  color?: { legend?: unknown }
}

const style = (definition: object, look?: ChartLook) =>
  withChartLook(definition as typeof bars, look) as unknown as Styled

const point = (fields: Partial<ChartPoint>) =>
  ({ groupLabel: "Desktop", color: "red", ...fields }) as ChartPoint

describe("withChartLook", () => {
  it("fills focus, keyboard, motion and the axis look", () => {
    const { focus, keyboard, motion, scales } = style(bars)
    expect(focus).toBe("group-x")
    expect(keyboard).toBe(true)
    expect(motion).toMatchObject({ transition: chartLook.motion })
    expect(scales.x?.axis).toEqual({
      line: false,
      ticks: { size: 0, padding: 10 },
    })
    expect(scales.y?.axis).toBe(false)
    // The library paints the grid at 11%; the border token is the hairline.
    expect(scales.y?.grid).toEqual({ strokeOpacity: 1 })
  })

  it("keeps what the definition sets", () => {
    const styled = style(
      defineChart(bars, {
        focus: "nearest",
        keyboard: false,
        motion: false,
        tooltip: false,
      }),
    )
    expect(styled.focus).toBe("nearest")
    expect(styled.keyboard).toBe(false)
    expect(styled.motion).toBe(false)
    expect(styled.tooltip).toBe(false)
  })

  it("draws the look's gridlines, legend placement and motion", () => {
    const look: ChartLook = {
      ...chartLook,
      grid: { strokeOpacity: 1, strokeDasharray: "3 3" },
      legend: "top",
      motion: false,
    }
    const styled = style({ ...bars, color: { legend: chartLegend } }, look)
    expect(styled.scales.y?.grid).toEqual(look.grid)
    expect(styled.color?.legend).not.toBe(chartLegend)
    expect(styled.color?.legend).toMatchObject({ placement: "top" })
    expect(styled.motion).toBe(false)
  })

  it("themes responsive definitions on every build", () => {
    const styled = withChartLook(
      defineChart(() => ({
        scales: {
          x: { scale: () => scalePoint() },
          y: { scale: scaleLinear, grid: true },
        },
        marks: [barY(rows, { x: "month", y: "desktop" })],
      })),
    )
    const runtime = createChartRuntime()
    const scene = runtime.render(styled, { width: 300, height: 200 })
    runtime.destroy()
    expect(JSON.stringify(scene.nodes)).toContain("var(--color-border)")
  })
})

describe("the house tooltip", () => {
  const content = (definition: object) => {
    const { tooltip: options } = style(definition)
    return (points: ChartPoint[]) => options.content?.(points, context)
  }

  it("titles a point by its category, with a row per series", () => {
    expect(content(bars)([point({ xValue: "Jan", yValue: 10 })])).toEqual({
      title: "x:Jan",
      rows: [{ label: "Desktop", value: "y:10", color: "red", active: false }],
    })
  })

  it("titles a horizontal point by its category on y", () => {
    const title = content(bars)([point({ xValue: 5, yValue: "Jan" })])?.title
    expect(title).toBe("y:Jan")
  })

  it("reports a stacked segment's own size", () => {
    const segment = point({
      xValue: "Jan",
      yValue: 30,
      y1Value: 10,
      y2Value: 30,
      yInterval: "difference",
    })
    expect(content(bars)([segment])?.rows[0]?.value).toBe("y:20")
  })

  it("prints values the way the axes do", () => {
    const formatted = {
      ...bars,
      scales: {
        ...bars.scales,
        y: {
          ...bars.scales.y,
          axis: { ticks: { format: (v: unknown) => `$${v}` } },
        },
      },
    }
    const rows = content(formatted)([point({ xValue: "Jan", yValue: 10 })])
    expect(rows?.rows[0]?.value).toBe("$10")
  })

  it("prints values with the tooltip's y item", () => {
    const definition = defineChart(bars, {
      tooltip: {
        use: tooltip,
        items: [{ channel: "y", text: (p) => `€${p.yValue}` }],
      },
    })
    const rows = content(definition)([point({ xValue: "Jan", yValue: 10 })])
    expect(rows?.rows[0]?.value).toBe("€10")
  })

  it("keeps a custom tooltip and the surface", () => {
    const { tooltip: options } = style(
      defineChart(bars, {
        tooltip: {
          use: tooltip,
          className: "mine",
          content: () => ({ rows: [] }),
        },
      }),
    )
    expect(options.content?.([], context)).toEqual({ rows: [] })
    expect(options.className).toContain("mine")
    expect(options.className).toContain("--ts-chart-tooltip-background")
  })
})

describe("polar", () => {
  const slices = pie(
    [
      { name: "a", value: 3 },
      { name: "b", value: 1 },
    ],
    { value: "value" },
  )

  it("names slices from their own fields", () => {
    const { content } = chartSliceTooltip("name", "value")
    expect(content([point({ datum: { name: "a", value: 3 } })])).toEqual({
      rows: [{ label: "a", value: "3", color: "red" }],
    })
  })

  it("paints decorations inside polar() without focus", () => {
    const runtime = createChartRuntime()
    const scene = runtime.render(
      defineChart({
        scales: { x: null, y: null },
        marks: [
          polar({
            scales: { angle: null, radius: null },
            marks: [
              radialArc(slices, { id: "arc", key: "name" }),
              polarDecorative(radialArc(slices.slice(0, 1), { id: "active" })),
            ],
          }),
        ],
      }),
      { width: 200, height: 200 },
    )
    runtime.destroy()
    expect(scene.points.map((p) => p.markId)).toEqual(["arc", "arc"])
    expect(JSON.stringify(scene.nodes)).toContain('"active:')
  })
})
