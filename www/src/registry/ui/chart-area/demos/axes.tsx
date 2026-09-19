"use client"

import type { ChartValue } from "@tanstack/charts"

import { AreaChart } from "@/registry/ui/chart-area"

const data = [
  { month: "January", desktop: 18600 },
  { month: "February", desktop: 30500 },
  { month: "March", desktop: 23700 },
  { month: "April", desktop: 7300 },
  { month: "May", desktop: 20900 },
  { month: "June", desktop: 21400 },
]

// Module scope: a formatter defined in render would rebuild the scene.
const shortMonth = (value: ChartValue) => String(value).slice(0, 3)
const compact = new Intl.NumberFormat("en-US", { notation: "compact" })
const formatCompact = (value: ChartValue) => compact.format(Number(value))

export default function ChartAreaAxes() {
  return (
    <AreaChart
      data={data}
      x="month"
      y="desktop"
      labels={{ desktop: "Desktop" }}
      axes
      formatX={shortMonth}
      formatY={formatCompact}
      ariaLabel="Desktop visitors, January through June"
    />
  )
}
