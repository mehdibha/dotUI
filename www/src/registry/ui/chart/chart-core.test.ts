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

import {
  chartScales,
  chartSeries,
  chartTheme,
  chartTooltipContent,
  polarDecorative,
  withChartDefaults,
} from "./base"

const rows = [
  { month: "Jan", desktop: 10, mobile: 30 },
  { month: "Feb", desktop: 20, mobile: null },
]

describe("chartSeries", () => {
  it("names a single field's series with its label", () => {
    const { rows: out, names } = chartSeries(rows, {
      x: "month",
      y: "desktop",
      labels: { desktop: "Desktop" },
    })
    expect(names).toEqual(["Desktop"])
    expect(out.map((row) => [row.x, row.y, row.series])).toEqual([
      ["Jan", 10, "Desktop"],
      ["Feb", 20, "Desktop"],
    ])
    expect(out[0]?.datum).toBe(rows[0])
  })

  it("folds wide rows into one row per field, in field order", () => {
    const { rows: out, names } = chartSeries(rows, {
      x: "month",
      y: ["mobile", "desktop"],
    })
    expect(names).toEqual(["mobile", "desktop"])
    expect(out.map((row) => [row.x, row.series, row.y])).toEqual([
      ["Jan", "mobile", 30],
      ["Jan", "desktop", 10],
      ["Feb", "mobile", null],
      ["Feb", "desktop", 20],
    ])
  })

  it("reads long rows' series in order of appearance", () => {
    const long = [
      { day: "Mon", channel: "paid", visits: 3 },
      { day: "Mon", channel: "organic", visits: 5 },
      { day: "Tue", channel: "paid", visits: Number.NaN },
    ]
    const { rows: out, names } = chartSeries(long, {
      x: "day",
      y: "visits",
      series: "channel",
      labels: { organic: "Organic" },
    })
    expect(names).toEqual(["paid", "Organic"])
    expect(out.map((row) => row.y)).toEqual([3, 5, null])
  })

  it("leads with the listed order, then data order", () => {
    expect(
      chartSeries(rows, {
        x: "month",
        y: ["desktop", "mobile"],
        order: ["mobile"],
      }).names,
    ).toEqual(["mobile", "desktop"])
    const long = [
      { day: "Mon", channel: "paid", visits: 3 },
      { day: "Mon", channel: "organic", visits: 5 },
    ]
    expect(
      chartSeries(long, {
        x: "day",
        y: "visits",
        series: "channel",
        order: ["organic", "missing"],
      }).names,
    ).toEqual(["organic", "paid"])
  })

  it("keys rows by x, timestamps for dates, or by the key field", () => {
    const date = new Date(Date.UTC(2024, 0, 1))
    expect(
      chartSeries([{ date, v: 1 }], { x: "date", y: "v" }).rows[0]?.key,
    ).toBe(+date)
    expect(
      chartSeries([{ id: "a", x: 1, v: 1 }], { x: "x", y: "v", key: "id" })
        .rows[0]?.key,
    ).toBe("a")
  })
})

describe("chartScales", () => {
  it("shows the x axis, grids the y axis, and nicens linear scales", () => {
    const { x, y } = chartScales()
    expect(x.axis).toEqual({})
    expect(x.grid).toBe(false)
    expect(y.axis).toBe(false)
    expect(y.grid).toBe(true)
    expect(y.nice).toBe(true)
  })

  it("passes formats and labels to the axis, and scale options through", () => {
    const format = (value: unknown) => String(value)
    const { y } = chartScales({
      y: { kind: "linear", format, label: "Visitors", reverse: true },
      axes: true,
    })
    expect(y.axis).toEqual({ ticks: { format }, label: "Visitors" })
    expect(y.reverse).toBe(true)
  })
})

const bars = defineChart({
  scales: {
    x: {
      scale: () => scalePoint(),
      axis: { ticks: { format: (v) => `~${v}` } },
    },
    y: {
      scale: scaleLinear,
      grid: true,
      axis: { line: true, ticks: { format: (v) => `$${v}` } },
    },
  },
  marks: [barY(rows, { x: "month", y: "desktop" })],
})

function tooltipOf(definition: { tooltip?: unknown }) {
  return definition.tooltip as ChartTooltipOptions
}

const plainContext = {
  formatX: String,
  formatY: String,
} as unknown as ChartTooltipContentContext

describe("withChartDefaults", () => {
  it("fills what the definition leaves unset", () => {
    const themed = withChartDefaults(bars) as unknown as {
      focus: unknown
      keyboard: unknown
      motion: unknown
      theme: unknown
      scales: Record<string, Record<string, unknown>>
    }
    expect(themed.focus).toBe("group-x")
    expect(themed.keyboard).toBe(true)
    expect(themed.motion).toBeTruthy()
    expect(themed.theme).toEqual(chartTheme)
    const { x, y } = themed.scales
    // The library paints the grid at 11%; the border token is the hairline.
    expect(y?.grid).toEqual({ strokeOpacity: 1 })
    expect(x?.axis).toMatchObject({
      line: false,
      ticks: { size: 0, padding: 10 },
    })
    expect(y?.axis).toMatchObject({ line: true })
  })

  it("keeps what the definition sets", () => {
    const themed = withChartDefaults(
      defineChart(bars, {
        focus: "nearest",
        keyboard: false,
        motion: false,
        tooltip: false,
      }),
    )
    expect(themed.focus).toBe("nearest")
    expect(themed.keyboard).toBe(false)
    expect(themed.motion).toBe(false)
    expect(themed.tooltip).toBe(false)
  })

  it("reads tooltip values the way the axes print them", () => {
    const themed = withChartDefaults(bars)
    const point = {
      xValue: "Jan",
      yValue: 10,
      groupLabel: "Desktop",
      color: "red",
    } as ChartPoint
    const content = tooltipOf(themed).content?.([point], plainContext)
    expect(content).toEqual({
      title: "~Jan",
      rows: [{ label: "Desktop", value: "$10", color: "red", active: false }],
    })
  })

  it("reads the format of a hidden axis", () => {
    const themed = withChartDefaults(
      defineChart({
        scales: chartScales({ y: { format: (value) => `$${value}` } }),
        marks: [barY(rows, { x: "month", y: "desktop" })],
      }),
    )
    const point = {
      xValue: "Jan",
      yValue: 10,
      groupLabel: "Desktop",
    } as ChartPoint
    expect(
      tooltipOf(themed).content?.([point], plainContext).rows[0]?.value,
    ).toBe("$10")
  })

  it("passes the axis formats to a custom tooltip and keeps the surface", () => {
    let seen: ChartTooltipContentContext | undefined
    const themed = withChartDefaults(
      defineChart(bars, {
        tooltip: {
          use: tooltip,
          className: "mine",
          content: (_, context) => {
            seen = context
            return { rows: [] }
          },
        },
      }),
    )
    const options = tooltipOf(themed)
    options.content?.([], plainContext)
    expect(seen?.formatY(5)).toBe("$5")
    expect(options.className).toContain("mine")
    expect(options.className).toContain("--ts-chart-tooltip-background")
  })

  it("themes responsive definitions on every build", () => {
    const themed = withChartDefaults(
      defineChart(() => ({
        scales: {
          x: { scale: () => scalePoint() },
          y: { scale: scaleLinear, grid: true },
        },
        marks: [barY(rows, { x: "month", y: "desktop" })],
      })),
    )
    const runtime = createChartRuntime()
    const scene = runtime.render(themed, { width: 300, height: 200 })
    runtime.destroy()
    expect(JSON.stringify(scene.nodes)).toContain("var(--color-border)")
  })
})

describe("chartTooltipContent", () => {
  const context = {
    formatX: (value: unknown) => `x:${value}`,
    formatY: (value: unknown) => `y:${value}`,
  } as unknown as ChartTooltipContentContext

  it("titles a horizontal point by its category on y", () => {
    const point = { xValue: 5, yValue: "Jan", groupLabel: "A" } as ChartPoint
    expect(chartTooltipContent([point], context).title).toBe("y:Jan")
  })

  it("reports a stacked segment's own size", () => {
    const point = {
      xValue: "Jan",
      yValue: 30,
      y1Value: 10,
      y2Value: 30,
      yInterval: "difference",
      groupLabel: "A",
    } as ChartPoint
    expect(chartTooltipContent([point], context).rows[0]?.value).toBe("y:20")
  })
})

describe("polarDecorative", () => {
  const slices = pie(
    [
      { name: "a", value: 3 },
      { name: "b", value: 1 },
    ],
    { value: "value" },
  )

  it("paints inside polar() without becoming a focus target", () => {
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
    expect(scene.points.map((point) => point.markId)).toEqual(["arc", "arc"])
    expect(JSON.stringify(scene.nodes)).toContain('"active:')
  })
})
