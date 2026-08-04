"use client"

import { RadialBarChart } from "@/registry/ui/chart-radial"

const data = [{ browser: "safari", visitors: 1260 }]

const deg = (value: number) => (value * Math.PI) / 180

export default function ChartRadialShape() {
  return (
    <RadialBarChart
      data={data}
      value="visitors"
      name="browser"
      labels={{ safari: "Safari" }}
      max={1600}
      endAngle={deg(100)}
      innerRadius={0.66}
      outerRadius={0.95}
      cornerRadius={999}
      radiusRatio={0.9}
      track
      grid
      ariaLabel="Safari visitors against a 1,600 target"
    >
      <div className="flex h-full flex-col items-center justify-center">
        <span className="text-2xl font-bold">1,260</span>
        <span className="text-sm text-fg-muted">Visitors</span>
      </div>
    </RadialBarChart>
  )
}
