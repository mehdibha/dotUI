"use client"

import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { heatmapChart } from "@/registry/ui/chart-heatmap"

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

const chart = defineChart(
  heatmapChart(data, {
    x: "quarter",
    y: "region",
    value: "share",
    label: "Adoption",
    dataLabels: true,
    formatValue: (value) => percent.format(Number(value)),
  }),
)

export default function ChartHeatmapWithValues() {
  return (
    <Chart
      definition={chart}
      height={180}
      ariaLabel="Feature adoption by region and quarter"
    />
  )
}
