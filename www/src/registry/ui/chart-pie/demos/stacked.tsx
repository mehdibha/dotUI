"use client"

import { pieRing, PieChart } from "@/registry/ui/chart-pie"

const desktop = [
  { month: "january", desktop: 186 },
  { month: "february", desktop: 305 },
  { month: "march", desktop: 237 },
  { month: "april", desktop: 173 },
  { month: "may", desktop: 209 },
]

const mobile = [
  { month: "january", mobile: 80 },
  { month: "february", mobile: 200 },
  { month: "march", mobile: 120 },
  { month: "april", mobile: 190 },
  { month: "may", mobile: 130 },
]

const labels = {
  january: "January",
  february: "February",
  march: "March",
  april: "April",
  may: "May",
}

/* A second series is a second ring, built at module scope so it keeps its
   identity across renders. Both rings key their colors off the month, so a
   month is one color from the middle out. */
const mobileRing = pieRing({
  id: "mobile",
  data: mobile,
  value: "mobile",
  name: "month",
  labels,
  innerRadius: 0.7,
  outerRadius: 0.95,
})

export default function ChartPieStacked() {
  return (
    <PieChart
      data={desktop}
      value="desktop"
      name="month"
      labels={labels}
      outerRadius={0.6}
      polarMarks={mobileRing}
      ariaLabel="Desktop and mobile visitors by month, as concentric rings"
    />
  )
}
