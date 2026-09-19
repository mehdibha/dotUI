"use client"

import { useState } from "react"
import type { ChartValue } from "@tanstack/charts"

import { BarChart } from "@/registry/ui/chart-bar"
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
    date: new Date(start + index * 86_400_000).toISOString().slice(0, 10),
    desktop: Math.round(150 + wave * 300 + ((index * 37) % 50)),
    mobile: Math.round(100 + (1 - wave) * 220 + ((index * 53) % 40)),
  }
})

const day = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" })
const formatDay = (value: ChartValue) => day.format(new Date(String(value)))

const labels = { desktop: "Desktop", mobile: "Mobile" }
type Series = keyof typeof labels

const totals = {
  desktop: data.reduce((sum, row) => sum + row.desktop, 0),
  mobile: data.reduce((sum, row) => sum + row.mobile, 0),
}

export default function ChartBarInteractive() {
  const [series, setSeries] = useState<Series>("desktop")

  return (
    <div className="flex w-full flex-col gap-4">
      <SegmentedControl
        aria-label="Series"
        selectedKeys={[series]}
        onSelectionChange={(keys) => {
          const [key] = keys
          if (key !== undefined) setSeries(key as Series)
        }}
        className="self-end"
      >
        {(Object.keys(labels) as Series[]).map((key) => (
          <SegmentedControlItem key={key} id={key}>
            {labels[key]}
            <span className="ml-2 text-fg-muted tabular-nums">
              {totals[key].toLocaleString("en-US")}
            </span>
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
      <BarChart
        data={data}
        x="date"
        y={series}
        labels={labels}
        radius={2}
        formatX={formatDay}
        ariaLabel={`${labels[series]} visitors per day`}
      />
    </div>
  )
}
