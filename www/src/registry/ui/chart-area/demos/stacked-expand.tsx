"use client"

import { stackY } from "@/registry/ui/chart"
import { AreaChart } from "@/registry/ui/chart-area"

const data = [
  { month: "Jan", desktop: 186, mobile: 80, other: 45 },
  { month: "Feb", desktop: 305, mobile: 200, other: 100 },
  { month: "Mar", desktop: 237, mobile: 120, other: 150 },
  { month: "Apr", desktop: 73, mobile: 190, other: 50 },
  { month: "May", desktop: 209, mobile: 130, other: 100 },
  { month: "Jun", desktop: 214, mobile: 140, other: 160 },
]

/* `normalize` divides each band by its own x-group total, so the stack fills
   the plot and reads as share rather than volume. */
const shares = stackY(data, {
  x: "month",
  y: ["desktop", "mobile", "other"],
  normalize: true,
})

export default function ChartAreaStackedExpand() {
  return (
    <AreaChart
      data={shares}
      x="x"
      y="top"
      y1="base"
      series="series"
      seriesOrder={["desktop", "mobile", "other"]}
      labels={{ desktop: "Desktop", mobile: "Mobile", other: "Other" }}
      formatY={{ locale: "en-US", number: { style: "percent" } }}
      ariaLabel="Share of visitors by device, January through June"
    />
  )
}
