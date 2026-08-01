'use client'

import { dot } from '@tanstack/charts/dot'

import { chartDefaults } from '@/registry/ui/chart'
import { LineChart } from '@/registry/ui/chart-line'

const SERIES = 'Visitors'

const chartData = [
  { browser: 'Chrome', visitors: 275, color: 'var(--chart-1)' },
  { browser: 'Safari', visitors: 200, color: 'var(--chart-2)' },
  { browser: 'Firefox', visitors: 187, color: 'var(--chart-3)' },
  { browser: 'Edge', visitors: 173, color: 'var(--chart-4)' },
  { browser: 'Other', visitors: 90, color: 'var(--chart-5)' },
]

/* `dot.fill` is a constant, so per-point color means one mark per color. Each
   reuses the line's `z` so grouped focus still shows a single tooltip row. */
const dots = chartData.map((row) =>
  dot([row], {
    x: 'browser',
    y: 'visitors',
    z: () => SERIES,
    fill: row.color,
    r: chartDefaults.dotRadius,
  }),
)

export default function ChartLineDotsColors() {
  return (
    <div className="w-full">
      <LineChart
        data={chartData}
        x="browser"
        y="visitors"
        marks={dots}
        labels={{ visitors: SERIES }}
        legend={false}
        ariaLabel="Visitors by browser"
      />
    </div>
  )
}
