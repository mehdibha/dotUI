"use client"

import { HeatmapChart } from "@/registry/ui/chart-heatmap"

/* Contributions per day over sixteen weeks: mostly quiet, busier midweek. */
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const weeks = Array.from({ length: 16 }, (_, index) => `W${index + 1}`)

let seed = 7
const random = () => {
  seed = (seed * 48271) % 2147483647
  return seed / 2147483647
}

const data = weeks.flatMap((week) =>
  days.map((day, index) => {
    const weekend = index >= 5
    const roll = random()
    const contributions =
      roll < (weekend ? 0.7 : 0.4)
        ? 0
        : Math.min(4, Math.ceil(random() * (weekend ? 2 : 4)))
    return { week, day, contributions }
  }),
)

export default function ChartHeatmapContributions() {
  return (
    <HeatmapChart
      data={data}
      x="week"
      y="day"
      value="contributions"
      thresholds={[1, 2, 3, 4]}
      label="Contributions"
      height={96}
      axes={false}
      ariaLabel="Contributions per day over sixteen weeks"
    />
  )
}
