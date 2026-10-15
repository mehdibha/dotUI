"use client"

import { RadialBarChart } from "@/registry/ui/chart-radial"

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
  track = false,
  barLabels = false,
  legend = false,
  startAngle = 0,
  endAngle = Math.PI * 2,
} = {}) {
  return (
    <RadialBarChart
      data={data}
      value="visitors"
      name="browser"
      labels={labels}
      track={track}
      barLabels={barLabels}
      legend={legend}
      startAngle={startAngle}
      endAngle={endAngle}
      ariaLabel="Visitors by browser"
    />
  )
}
