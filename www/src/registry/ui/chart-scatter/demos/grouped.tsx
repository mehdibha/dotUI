"use client"

import { ScatterChart } from "@/registry/ui/chart-scatter"

const accounts = [
  { id: "a1", plan: "starter", seats: 3, spend: 57 },
  { id: "a2", plan: "starter", seats: 5, spend: 95 },
  { id: "a3", plan: "starter", seats: 8, spend: 152 },
  { id: "a4", plan: "starter", seats: 11, spend: 209 },
  { id: "a5", plan: "starter", seats: 6, spend: 114 },
  { id: "b1", plan: "growth", seats: 12, spend: 348 },
  { id: "b2", plan: "growth", seats: 18, spend: 522 },
  { id: "b3", plan: "growth", seats: 25, spend: 725 },
  { id: "b4", plan: "growth", seats: 31, spend: 899 },
  { id: "b5", plan: "growth", seats: 22, spend: 638 },
  { id: "c1", plan: "scale", seats: 44, spend: 1716 },
  { id: "c2", plan: "scale", seats: 60, spend: 2340 },
  { id: "c3", plan: "scale", seats: 78, spend: 3042 },
  { id: "c4", plan: "scale", seats: 95, spend: 3705 },
  { id: "c5", plan: "scale", seats: 52, spend: 2028 },
]

export default function ChartScatterGrouped() {
  return (
    <ScatterChart
      data={accounts}
      x="seats"
      y="spend"
      series="plan"
      seriesOrder={["starter", "growth", "scale"]}
      labels={{ starter: "Starter", growth: "Growth", scale: "Scale" }}
      rowKey="id"
      formatY={{
        locale: "en-US",
        number: {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        },
      }}
      ariaLabel="Monthly spend by seat count, grouped by plan"
    />
  )
}
