"use client"

import { useMemo, useState } from "react"
import { defineChart } from "@tanstack/charts"
import { pie, polar, radialArc } from "@tanstack/charts/polar"

import { Chart, chartSliceTooltip, polarDecorative } from "@/registry/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"

const data = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 173 },
  { month: "May", desktop: 209 },
]

const slices = pie(data, { value: "desktop" })

const ring = {
  color: "month",
  innerRadius: ({ radius }: { radius: number }) => radius * 0.6,
  stroke: "var(--surface-bg,var(--color-bg))",
  strokeWidth: 2,
} as const

export default function ChartPieInteractive() {
  const [month, setMonth] = useState("January")
  const row = data.find((entry) => entry.month === month)
  const chart = useMemo(
    () =>
      defineChart({
        scales: { x: null, y: null },
        marks: [
          polar({
            scales: { angle: null, radius: null },
            radiusRatio: 0.9,
            marks: [
              radialArc(slices, {
                ...ring,
                outerRadius: ({ radius }) => radius * 0.88,
              }),
              polarDecorative(
                radialArc(
                  slices.filter((slice) => slice.month === month),
                  { ...ring, outerRadius: ({ radius }) => radius * 0.96 },
                ),
              ),
            ],
          }),
        ],
        focus: "nearest",
        tooltip: chartSliceTooltip("month", "desktop"),
      }),
    [month],
  )

  return (
    <div className="flex w-full flex-col gap-4">
      <Select
        aria-label="Month"
        value={month}
        onChange={(key) => {
          if (key !== null) setMonth(String(key))
        }}
        className="w-40 self-end"
      >
        <SelectTrigger />
        <SelectContent>
          {data.map((entry) => (
            <SelectItem key={entry.month} id={entry.month}>
              {entry.month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Chart
        definition={chart}
        ariaLabel="Desktop visitors by month, with one month highlighted"
      >
        <div className="flex h-full flex-col items-center justify-center">
          <span className="text-3xl font-bold">
            {row?.desktop.toLocaleString("en-US")}
          </span>
          <span className="text-sm text-fg-muted">Visitors</span>
        </div>
      </Chart>
    </div>
  )
}
