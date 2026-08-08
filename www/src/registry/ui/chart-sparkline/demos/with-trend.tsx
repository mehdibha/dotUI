"use client"

import { ruleY } from "@tanstack/charts/rule"

import { Sparkline } from "@/registry/ui/chart-sparkline"

const data = [
  { week: "W1", latency: 284 },
  { week: "W2", latency: 341 },
  { week: "W3", latency: 262 },
  { week: "W4", latency: 398 },
  { week: "W5", latency: 305 },
  { week: "W6", latency: 227 },
  { week: "W7", latency: 261 },
  { week: "W8", latency: 198 },
]

const mean = data.reduce((total, row) => total + row.latency, 0) / data.length

/* Module scope: mark arrays are identity-compared. */
const meanRule = [
  ruleY([mean], { stroke: "var(--color-border)", strokeDasharray: "3 3" }),
]

export default function ChartSparklineWithTrend() {
  return (
    <div className="w-full max-w-56">
      <Sparkline
        data={data}
        x="week"
        y="latency"
        height={56}
        marksBefore={meanRule}
        ariaLabel={`Weekly latency, averaging ${Math.round(mean)} milliseconds`}
      />
    </div>
  )
}
