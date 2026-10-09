"use client"

import { useMemo, useState } from "react"
import { defineChart } from "@tanstack/charts"
import { areaY } from "@tanstack/charts/area"
import { lineY } from "@tanstack/charts/line"
import { decorative } from "@tanstack/charts/mark/decorative"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { fold } from "@tanstack/charts/transform/fold"
import { stackRowsY } from "@tanstack/charts/transform/stack"
import { scaleUtc } from "d3-scale"

import { Chart, chartFades, chartLegend, chartLook } from "@/registry/ui/chart"
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

const devices = { mobile: "Mobile", desktop: "Desktop" }
const fields = ["mobile", "desktop"] as const

const RANGES = { "90d": 90, "30d": 30, "7d": 7 } as const
type Range = keyof typeof RANGES

export default function ChartAreaInteractive() {
  const [range, setRange] = useState<Range>("90d")
  const chart = useMemo(() => {
    const rows = stackRowsY(
      fold(data.slice(-RANGES[range]), {
        fields,
        as: { key: "device", value: "visitors" },
      }),
      { x: "date", y: "visitors", z: "device" },
    )
    const series = {
      x: "date",
      color: (row: (typeof rows)[number]) => devices[row.device],
      curve: chartLook.curve,
    } as const
    return defineChart({
      scales: {
        x: {
          scale: scaleUtc,
          nice: true,
          axis: { ticks: { format: (value) => day.format(value as Date) } },
        },
        y: {
          scale: scaleLinear,
          nice: true,
          grid: true,
          axis: chartLook.valueAxis,
        },
      },
      color: { legend: chartLegend },
      gradients: chartFades,
      marks: [
        decorative(
          areaY(rows, {
            ...series,
            y1: "y1",
            y2: "y2",
            fill: (row) => `url(#chart-fade-${fields.indexOf(row.device)})`,
          }),
        ),
        areaY(rows, { ...series, y1: "y1", y2: "y2", fillOpacity: 0 }),
        decorative(
          lineY(rows, {
            ...series,
            y: "y2",
            strokeWidth: chartLook.strokeWidth,
          }),
        ),
      ],
    })
  }, [range])

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
