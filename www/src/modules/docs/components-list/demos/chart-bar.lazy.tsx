"use client"

import { BarChart } from "@/registry/ui/chart-bar"

const data = [
  { browser: "chrome", visitors: 187 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 275 },
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

export default function ChartBarBrowsers() {
  return (
    <BarChart
      data={data}
      x="browser"
      y="visitors"
      series="browser"
      labels={labels}
      height={96}
      grid={false}
      ariaLabel="Visitors by browser"
    />
  )
}
