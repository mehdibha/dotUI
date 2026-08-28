"use client"

import { AreaChart } from "@/registry/ui/chart-area"

/* Long format: one row per series per x value, with the series key in a field. */
const data = [
  { month: "Jan", channel: "organic_search", visitors: 186 },
  { month: "Jan", channel: "paid_social", visitors: 80 },
  { month: "Feb", channel: "organic_search", visitors: 305 },
  { month: "Feb", channel: "paid_social", visitors: 200 },
  { month: "Mar", channel: "organic_search", visitors: 237 },
  { month: "Mar", channel: "paid_social", visitors: 120 },
  { month: "Apr", channel: "organic_search", visitors: 173 },
  { month: "Apr", channel: "paid_social", visitors: 190 },
  { month: "May", channel: "organic_search", visitors: 209 },
  { month: "May", channel: "paid_social", visitors: 130 },
  { month: "Jun", channel: "organic_search", visitors: 214 },
  { month: "Jun", channel: "paid_social", visitors: 140 },
]

export default function ChartAreaLabels() {
  return (
    <AreaChart
      data={data}
      x="month"
      y="visitors"
      series="channel"
      seriesOrder={["paid_social", "organic_search"]}
      labels={{ organic_search: "Organic search", paid_social: "Paid social" }}
      axes="x"
      ariaLabel="Visitors by acquisition channel, January through June"
    />
  )
}
