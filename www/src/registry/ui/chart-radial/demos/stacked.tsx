"use client"

import { RadialBarChart } from "@/registry/ui/chart-radial"

const data = [{ month: "january", desktop: 1260, mobile: 570 }]

export default function ChartRadialStacked() {
  return (
    <RadialBarChart
      data={data}
      // An array of fields stacks one ring, cumulative from `startAngle`.
      value={["desktop", "mobile"]}
      name="month"
      labels={{ desktop: "Desktop", mobile: "Mobile" }}
      max={2200}
      startAngle={-Math.PI / 2}
      endAngle={Math.PI / 2}
      innerRadius={0.7}
      outerRadius={0.98}
      cornerRadius={5}
      barPadding={0.06}
      radiusRatio={0.9}
      ariaLabel="Desktop and mobile visitors in January, stacked"
    >
      <div className="flex h-full flex-col items-center justify-center pb-6">
        <span className="text-2xl font-bold">1,830</span>
        <span className="text-sm text-fg-muted">Visitors</span>
      </div>
    </RadialBarChart>
  )
}
