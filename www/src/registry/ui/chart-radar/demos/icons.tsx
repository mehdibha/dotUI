"use client"

import { MonitorIcon, SmartphoneIcon } from "lucide-react"

import { RadarChart } from "@/registry/ui/chart-radar"

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 273, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
]

const labels = { desktop: "Desktop", mobile: "Mobile" }

/* An icon legend is HTML beside the chart, not a chart legend: the SVG legend
   draws color swatches. */
export default function ChartRadarIcons() {
  return (
    <div>
      <RadarChart
        data={data}
        x="month"
        y={["desktop", "mobile"]}
        labels={labels}
        legend={false}
        ariaLabel="Desktop and mobile visitors, January through June"
      />
      <div className="mt-2 flex items-center justify-center gap-4 text-sm text-fg-muted">
        <span className="flex items-center gap-1.5">
          <MonitorIcon className="size-4" />
          {labels.desktop}
        </span>
        <span className="flex items-center gap-1.5">
          <SmartphoneIcon className="size-4" />
          {labels.mobile}
        </span>
      </div>
    </div>
  )
}
