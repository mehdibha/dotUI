'use client'

import { PieChart } from '@/registry/ui/chart-pie'

const data = [
  { browser: 'chrome', visitors: 275 },
  { browser: 'safari', visitors: 200 },
  { browser: 'firefox', visitors: 187 },
  { browser: 'edge', visitors: 173 },
  { browser: 'other', visitors: 90 },
]

const labels = {
  chrome: 'Chrome',
  safari: 'Safari',
  firefox: 'Firefox',
  edge: 'Edge',
  other: 'Other',
}

export default function ChartPieDonutActive() {
  return (
    <PieChart
      data={data}
      value="visitors"
      name="browser"
      labels={labels}
      innerRadius={0.55}
      outerRadius={0.88}
      // Static, so the highlighted slice reads without hovering.
      activeIndex={0}
      activeOffset={0.12}
      stroke="var(--color-bg)"
      strokeWidth={2}
      ariaLabel="Visitors by browser, with Chrome highlighted"
    />
  )
}
