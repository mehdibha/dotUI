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

export default function ChartRadialLabel() {
  return (
    <RadialBarChart
      data={data}
      value="visitors"
      name="browser"
      labels={labels}
      // A full turn starting at twelve o'clock.
      startAngle={-Math.PI / 2}
      endAngle={Math.PI * 1.5}
      innerRadius={0.25}
      radiusRatio={0.95}
      track
      barLabels
      ariaLabel="Visitors by browser, each ring labelled"
    />
  )
}
