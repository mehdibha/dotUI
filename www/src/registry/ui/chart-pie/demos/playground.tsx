"use client"

import { PieChart, type PieChartProps } from "@/registry/ui/chart-pie"

const data = [
  { browser: "chrome", visitors: 275 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 187 },
  { browser: "edge", visitors: 173 },
  { browser: "other", visitors: 90 },
]

const labels = {
  chrome: "Chrome",
  safari: "Safari",
  firefox: "Firefox",
  edge: "Edge",
  other: "Other",
}

export default function Demo({
  innerRadius = 0,
  padAngle = 0,
  cornerRadius = 0,
  sliceLabel = "none",
  legend = false,
}: {
  innerRadius?: number
  padAngle?: number
  cornerRadius?: number
  sliceLabel?: PieChartProps<object>["sliceLabel"]
  legend?: boolean
} = {}) {
  return (
    <PieChart
      data={data}
      value="visitors"
      name="browser"
      labels={labels}
      innerRadius={innerRadius}
      padAngle={padAngle}
      cornerRadius={cornerRadius}
      sliceLabel={sliceLabel}
      legend={legend}
      ariaLabel="Visitors by browser"
    />
  )
}
