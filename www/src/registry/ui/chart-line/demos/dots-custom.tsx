'use client'

import { dot } from '@tanstack/charts/dot'

import { LineChart } from '@/registry/ui/chart-line'

const SERIES = 'Desktop'

const data = [
  { month: 'Jan', desktop: 186 },
  { month: 'Feb', desktop: 305 },
  { month: 'Mar', desktop: 237 },
  { month: 'Apr', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'Jun', desktop: 214 },
]

/* Ring markers instead of the built-in `points` dots. Reusing the line's `z`
   keeps the pair in one focus group. */
const rings = dot(data, {
  x: 'month',
  y: 'desktop',
  z: () => SERIES,
  r: 5,
  fill: 'var(--color-bg)',
  stroke: 'var(--chart-1)',
  strokeWidth: 2,
})

export default function ChartLineDotsCustom() {
  return (
    <LineChart
      data={data}
      x="month"
      y="desktop"
      marks={[rings]}
      labels={{ desktop: SERIES }}
      legend={false}
      ariaLabel="Desktop visitors, January through June"
    />
  )
}
