'use client'

import { text } from '@tanstack/charts'

import { LineChart } from '@/registry/ui/chart-line'

const SERIES = 'Desktop'

const chartData = [
  { month: 'Jan', desktop: 186 },
  { month: 'Feb', desktop: 305 },
  { month: 'Mar', desktop: 237 },
  { month: 'Apr', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'Jun', desktop: 214 },
]

const labels = text(chartData, {
  x: 'month',
  y: 'desktop',
  text: 'desktop',
  z: () => SERIES,
  dy: -12,
  fontSize: 12,
  fill: 'var(--color-fg-muted)',
})

export default function ChartLineLabel() {
  return (
    <div className="w-full">
      <LineChart
        data={chartData}
        x="month"
        y="desktop"
        points
        marks={[labels]}
        labels={{ desktop: SERIES }}
        legend={false}
        ariaLabel="Desktop visitors, January through June"
      />
    </div>
  )
}
