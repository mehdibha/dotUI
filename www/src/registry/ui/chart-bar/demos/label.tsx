'use client'

import { text } from '@tanstack/charts/text'

import { BarChart } from '@/registry/ui/chart-bar'

const data = [
  { month: 'Jan', desktop: 186 },
  { month: 'Feb', desktop: 305 },
  { month: 'Mar', desktop: 237 },
  { month: 'Apr', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'Jun', desktop: 214 },
]

// Same `z` as the bars, so grouped focus keeps one tooltip row per month.
const labels = [
  text(data, {
    x: 'month',
    y: 'desktop',
    text: 'desktop',
    z: () => 'Desktop',
    fill: 'var(--color-fg-muted)',
    fontSize: 12,
    dy: -10,
  }),
]

export default function ChartBarLabel() {
  return (
    <BarChart
      data={data}
      x="month"
      y="desktop"
      labels={{ desktop: 'Desktop' }}
      legend={false}
      marks={labels}
      ariaLabel="Desktop visitors per month, labelled"
    />
  )
}
