"use client"

import { ScatterChart } from "@/registry/ui/chart-scatter"

/* Deterministic sample: server and client must draw the same cloud. */
function sample(count: number) {
  let seed = 20240517
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
  return Array.from({ length: count }, (_, index) => {
    const latency = 40 + random() ** 2 * 420
    return {
      id: index,
      latency: Math.round(latency),
      errors: Math.round((latency / 90 + random() * 3) * 10) / 1000,
    }
  })
}

const requests = sample(400)

export default function ChartScatterDense() {
  return (
    <ScatterChart
      data={requests}
      x="latency"
      y="errors"
      rowKey="id"
      radius={2.5}
      fillOpacity={0.35}
      // A tight radius keeps a hover from claiming a point on the far side.
      maxFocusDistance={12}
      ariaLabel="Error rate by response time across 400 requests"
      formatX={{
        locale: "en-US",
        number: { style: "unit", unit: "millisecond" },
      }}
      formatY={{
        locale: "en-US",
        number: { style: "percent", maximumFractionDigits: 1 },
      }}
    />
  )
}
