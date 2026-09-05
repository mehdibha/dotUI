"use client"

import { BarChart } from "@/registry/ui/chart-bar"

const data = [
  { browser: "chrome", visitors: 275 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 187 },
  { browser: "edge", visitors: 173 },
  { browser: "other", visitors: 90 },
]

export default function ChartBarMixed() {
  return (
    <BarChart
      data={data}
      x="browser"
      y="visitors"
      // One series per category: every bar lands on its own palette slot.
      series="browser"
      labels={{
        chrome: "Chrome",
        safari: "Safari",
        firefox: "Firefox",
        edge: "Edge",
        other: "Other",
      }}
      horizontal
      legend={false}
      focus="group-y"
      axes="y"
      ariaLabel="Visitors by browser"
    />
  )
}
