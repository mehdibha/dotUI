"use client"

import { lineY } from "@tanstack/charts/line"

import { ScatterChart } from "@/registry/ui/chart-scatter"

interface Campaign {
  campaign: string
  spend: number
  signups: number
}

const campaigns: Campaign[] = [
  { campaign: "c01", spend: 1200, signups: 41 },
  { campaign: "c02", spend: 1850, signups: 58 },
  { campaign: "c03", spend: 2400, signups: 62 },
  { campaign: "c04", spend: 3100, signups: 94 },
  { campaign: "c05", spend: 3600, signups: 88 },
  { campaign: "c06", spend: 4200, signups: 121 },
  { campaign: "c07", spend: 4800, signups: 132 },
  { campaign: "c08", spend: 5300, signups: 126 },
  { campaign: "c09", spend: 6100, signups: 168 },
  { campaign: "c10", spend: 6900, signups: 171 },
  { campaign: "c11", spend: 7400, signups: 205 },
  { campaign: "c12", spend: 8200, signups: 214 },
]

/* The fit is derived data: the application computes it, the chart only draws
   the two endpoints as their own layer. */
function regression(rows: readonly Campaign[]) {
  const n = rows.length
  const sum = (read: (row: Campaign) => number) =>
    rows.reduce((total, row) => total + read(row), 0)
  const sumX = sum((row) => row.spend)
  const sumY = sum((row) => row.signups)
  const slope =
    (n * sum((row) => row.spend * row.signups) - sumX * sumY) /
    (n * sum((row) => row.spend * row.spend) - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  const spends = rows.map((row) => row.spend)
  return [Math.min(...spends), Math.max(...spends)].map((spend) => ({
    spend,
    signups: intercept + slope * spend,
  }))
}

const fit = regression(campaigns)

/* Module scope: the mark list is compared by identity. */
const trend = [
  lineY(fit, {
    x: "spend",
    y: "signups",
    stroke: "var(--color-fg-muted)",
    strokeWidth: 1.5,
    strokeDasharray: "4 4",
  }),
]

export default function ChartScatterWithRegression() {
  return (
    <ScatterChart
      data={campaigns}
      x="spend"
      y="signups"
      rowKey="campaign"
      marksBefore={trend}
      ariaLabel="Signups by campaign spend, with a fitted trend line"
      formatX={{
        locale: "en-US",
        number: { style: "currency", currency: "USD", notation: "compact" },
      }}
    />
  )
}
