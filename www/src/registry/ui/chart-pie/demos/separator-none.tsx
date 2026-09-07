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

/* No stroke and no pad angle: the slices meet edge to edge. Compare with the
   donut demo, which separates them with a background-colored stroke. */
export default function ChartPieSeparatorNone() {
  return (
    <PieChart
      data={data}
      value="visitors"
      name="browser"
      labels={labels}
      padAngle={0}
      ariaLabel="Visitors by browser, without slice separators"
    />
  )
}
