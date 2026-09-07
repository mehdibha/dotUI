"use client"

import { RadialBarChart } from "@/registry/ui/chart-radial"

const data = [{ browser: "safari", visitors: 1260 }]

const deg = (value: number) => (value * Math.PI) / 180

export default function ChartRadialText() {
  return (
    <RadialBarChart
      data={data}
      value="visitors"
      name="browser"
      labels={{ safari: "Safari" }}
      endAngle={deg(250)}
      innerRadius={0.78}
      outerRadius={0.95}
      radiusRatio={0.9}
      cornerRadius={999}
      track
      max={1600}
      ariaLabel="Safari visitors as a progress ring"
    >
      <div className="flex h-full flex-col items-center justify-center">
        <span className="text-2xl font-bold">1,260</span>
        <span className="text-sm text-fg-muted">Visitors</span>
      </div>
    </RadialBarChart>
  )
}
