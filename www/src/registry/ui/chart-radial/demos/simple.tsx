'use client'

import { RadialBarChart } from '@/registry/ui/chart-radial'

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

export default function ChartRadialSimple() {
  return (
    <RadialBarChart
      data={data}
      value="visitors"
      name="browser"
      labels={labels}
      innerRadius={0.3}
      radiusRatio={0.95}
      track
      legend
      ariaLabel="Visitors by browser"
    />
  )
}
