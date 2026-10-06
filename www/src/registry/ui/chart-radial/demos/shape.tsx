"use client"

import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { radialChart } from "@/registry/ui/chart-radial"

const data = [{ browser: "safari", visitors: 1260 }]

const deg = (value: number) => (value * Math.PI) / 180

const chart = defineChart(
  radialChart(data, {
    value: "visitors",
    name: "browser",
    labels: { safari: "Safari" },
    endAngle: deg(100),
    innerRadius: 0.66,
    outerRadius: 0.95,
    radiusRatio: 0.9,
    cornerRadius: 999,
    track: true,
    max: 1600,
    grid: true,
  }),
)

export default function ChartRadialShape() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Safari visitors against a 1,600 target"
    >
      <div className="flex h-full flex-col items-center justify-center">
        <span className="text-2xl font-bold">1,260</span>
        <span className="text-sm text-fg-muted">Visitors</span>
      </div>
    </Chart>
  )
}
