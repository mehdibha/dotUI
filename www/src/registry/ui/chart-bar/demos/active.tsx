"use client"

import { useMemo, useState } from "react"
import { barY } from "@tanstack/charts/bar"

import { chartDefaults } from "@/registry/ui/chart"
import { BarChart } from "@/registry/ui/chart-bar"

const data = [
  { browser: "chrome", visitors: 187 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 275 },
  { browser: "edge", visitors: 173 },
  { browser: "other", visitors: 90 },
]

const LABELS: Record<string, string> = {
  chrome: "Chrome",
  safari: "Safari",
  firefox: "Firefox",
  edge: "Edge",
  other: "Other",
}

const labelOf = (row: (typeof data)[number]) => LABELS[row.browser]

export default function ChartBarActive() {
  const [active, setActive] = useState<string | null>(null)

  /* The focused bar is repainted by a second layer at full opacity: `marks` is
     identity-compared, so a new array is what rebuilds the chart. */
  const highlight = useMemo(
    () =>
      active === null
        ? []
        : [
            barY(
              data.filter((row) => row.browser === active),
              {
                x: "browser",
                y: "visitors",
                z: labelOf,
                color: labelOf,
                radius: chartDefaults.barRadius,
              },
            ),
          ],
    [active],
  )

  return (
    <BarChart
      data={data}
      x="browser"
      y="visitors"
      series="browser"
      labels={LABELS}
      fillOpacity={active === null ? 1 : 0.3}
      legend={false}
      marks={highlight}
      animate={false}
      onFocusChange={(point) => setActive(point?.datum.browser ?? null)}
      ariaLabel="Visitors by browser, with the focused bar highlighted"
    />
  )
}
