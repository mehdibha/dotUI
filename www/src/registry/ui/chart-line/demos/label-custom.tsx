'use client'

import { text } from '@tanstack/charts'
import { dot } from '@tanstack/charts/dot'

import { chartDefaults } from '@/registry/ui/chart'
import { LineChart } from '@/registry/ui/chart-line'

interface Row {
  month: string
  desktop: number
}

const SERIES = 'Desktop'

const chartData: Row[] = [
  { month: 'Jan', desktop: 186 },
  { month: 'Feb', desktop: 305 },
  { month: 'Mar', desktop: 237 },
  { month: 'Apr', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'Jun', desktop: 214 },
]

const pick = (rows: readonly Row[], best: (a: Row, b: Row) => boolean) =>
  rows.reduce((winner, row) => (best(row, winner) ? row : winner))

/* Annotate a chosen few rows, not every point: pick them in data preparation
   so the intent stays auditable. */
const extremes = [
  {
    ...pick(chartData, (a, b) => a.desktop > b.desktop),
    label: 'Peak',
    dy: -16,
  },
  { ...pick(chartData, (a, b) => a.desktop < b.desktop), label: 'Low', dy: 22 },
]

const markers = dot(extremes, {
  x: 'month',
  y: 'desktop',
  z: () => SERIES,
  r: chartDefaults.dotRadius,
})

const callouts = text(extremes, {
  x: 'month',
  y: 'desktop',
  text: (row) => `${row.label} · ${row.desktop}`,
  z: () => SERIES,
  dy: (row) => row.dy,
  fontSize: 12,
  fontWeight: 600,
  fill: 'var(--color-fg)',
})

export default function ChartLineLabelCustom() {
  return (
    <div className="w-full">
      <LineChart
        data={chartData}
        x="month"
        y="desktop"
        marks={[markers, callouts]}
        labels={{ desktop: SERIES }}
        legend={false}
        ariaLabel="Desktop visitors, with the peak and low months annotated"
      />
    </div>
  )
}
