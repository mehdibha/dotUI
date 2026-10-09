"use client"

import { defineChart } from "@tanstack/charts"
import { colorLegend } from "@tanstack/charts/legend"
import { decorative } from "@tanstack/charts/mark/decorative"
import { cell } from "@tanstack/charts/rect"
import { scaleBand } from "@tanstack/charts/scales/band"
import { text } from "@tanstack/charts/text"
import { tooltip } from "@tanstack/charts/tooltip"
import { scaleQuantize } from "d3-scale"

import { Chart, chartLook } from "@/registry/ui/chart"

/* Few, large cells — the only shape where in-cell numbers stay legible. */
const regions = [
  { region: "Americas", quarters: [0.42, 0.48, 0.51, 0.57] },
  { region: "EMEA", quarters: [0.31, 0.29, 0.36, 0.44] },
  { region: "APAC", quarters: [0.18, 0.24, 0.33, 0.39] },
]

const data = regions.flatMap(({ region, quarters }) =>
  quarters.map((share, index) => ({
    region,
    quarter: `Q${index + 1}`,
    share,
  })),
)

const percent = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 0,
})

// Low values fade into the surface, high ones deepen toward the foreground.
const colors = [
  "color-mix(in oklab, var(--chart-1) 20%, var(--surface-bg,var(--color-bg)))",
  "color-mix(in oklab, var(--chart-1) 60%, var(--surface-bg,var(--color-bg)))",
  "var(--chart-1)",
  "color-mix(in oklab, var(--chart-1) 66%, var(--color-fg))",
  "color-mix(in oklab, var(--chart-1) 32%, var(--color-fg))",
]

const shares = data.map((row) => row.share)

// The chart's bins again, so each label knows the color of the cell under it.
const shade = scaleQuantize<string>()
  .domain([Math.min(...shares), Math.max(...shares)])
  .range(colors)
  .nice(5)

const chart = defineChart({
  scales: {
    x: { scale: scaleBand },
    y: { scale: scaleBand },
  },
  color: {
    scale: scaleQuantize<string>,
    range: colors,
    nice: true,
    legend: colorLegend({
      label: "Adoption",
      format: (value) => percent.format(value),
    }),
  },
  marks: [
    cell(data, {
      x: "quarter",
      y: "region",
      color: "share",
      radius: Math.min(chartLook.barRadius, 2),
      inset: 1,
    }),
    decorative(
      text(data, {
        x: "quarter",
        y: "region",
        text: (row) => percent.format(row.share),
        // Black or white from the cell's lightness: at least 4.9:1 on every step.
        fill: (row) =>
          `oklch(from ${shade(row.share)} calc((0.58 - l) * 100) 0 0)`,
        fontSize: 11,
      }),
    ),
  ],
  focus: "nearest",
  tooltip: {
    use: tooltip,
    anchor: "point",
    content: (points) => ({
      title:
        points[0] && `${points[0].datum.quarter} · ${points[0].datum.region}`,
      rows: points.map((point) => ({
        label: "Adoption",
        value: percent.format(point.datum.share),
        color: point.color,
      })),
    }),
  },
})

export default function ChartHeatmapWithValues() {
  return (
    <Chart
      definition={chart}
      height={180}
      ariaLabel="Feature adoption by region and quarter"
    />
  )
}
