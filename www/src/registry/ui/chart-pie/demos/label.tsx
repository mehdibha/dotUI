"use client"

import { PieChart } from "@/registry/ui/chart-pie"

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

export default function ChartPieLabel() {
  return (
    <PieChart
      data={data}
      value="visitors"
      name="browser"
      labels={labels}
      sliceLabel="value"
      sliceLabelRadius={0.72}
      stroke="var(--color-bg)"
      strokeWidth={2}
      ariaLabel="Visitors by browser, with values on the slices"
    />
  )
}
