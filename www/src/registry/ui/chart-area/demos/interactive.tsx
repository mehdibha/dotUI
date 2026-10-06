"use client"

import { useMemo, useState } from "react"
import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { areaChart } from "@/registry/ui/chart-area"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"

const DAYS = 90
const start = Date.UTC(2024, 3, 1)

// Deterministic, so the server and the client render the same rows.
const data = Array.from({ length: DAYS }, (_, index) => {
  const wave = Math.sin(index / 6) * 0.5 + 0.5
  return {
    date: new Date(start + index * 86_400_000),
    desktop: Math.round(150 + wave * 300 + ((index * 37) % 50)),
    mobile: Math.round(100 + (1 - wave) * 220 + ((index * 53) % 40)),
  }
})

const day = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
})

const RANGES = { "90d": 90, "30d": 30, "7d": 7 } as const
type Range = keyof typeof RANGES

export default function ChartAreaInteractive() {
  const [range, setRange] = useState<Range>("90d")
  // Dates put the x axis on a time scale.
  const chart = useMemo(
    () =>
      defineChart(
        areaChart(data.slice(-RANGES[range]), {
          x: "date",
          y: ["mobile", "desktop"],
          labels: { desktop: "Desktop", mobile: "Mobile" },
          stacked: true,
          fill: "gradient",
          legend: true,
          formatX: (value) => day.format(value as Date),
        }),
      ),
    [range],
  )

  return (
    <div className="flex w-full flex-col gap-4">
      <SegmentedControl
        aria-label="Time range"
        selectedKeys={[range]}
        onSelectionChange={(keys) => {
          const [key] = keys
          if (key !== undefined) setRange(key as Range)
        }}
        className="self-end"
      >
        <SegmentedControlItem id="90d">Last 3 months</SegmentedControlItem>
        <SegmentedControlItem id="30d">Last 30 days</SegmentedControlItem>
        <SegmentedControlItem id="7d">Last 7 days</SegmentedControlItem>
      </SegmentedControl>
      <Chart
        definition={chart}
        ariaLabel="Desktop and mobile visitors per day"
      />
    </div>
  )
}
