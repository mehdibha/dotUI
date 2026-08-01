'use client'

import { dot } from '@tanstack/charts/dot'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/registry/ui/card'
import { Sparkline } from '@/registry/ui/chart-sparkline'

const chartData = [
  { month: 'Jan', revenue: 18400 },
  { month: 'Feb', revenue: 21600 },
  { month: 'Mar', revenue: 19800 },
  { month: 'Apr', revenue: 24900 },
  { month: 'May', revenue: 27300 },
  { month: 'Jun', revenue: 31250 },
]

const current = chartData.at(-1)?.revenue ?? 0
const previous = chartData.at(-2)?.revenue ?? 0
const delta = (current - previous) / previous

/* Module scope: `marks` is identity-compared, so an inline array would rebuild
   the chart on every render. */
const endDot = [
  dot(chartData.slice(-1), {
    x: 'month',
    y: 'revenue',
    r: 3,
    fill: 'var(--chart-1)',
  }),
]

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})
const percent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
  signDisplay: 'exceptZero',
})

export default function Demo() {
  return (
    <Card className="w-full max-w-64">
      <CardHeader>
        <CardDescription>Monthly revenue</CardDescription>
        <CardTitle className="text-2xl">{currency.format(current)}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Sparkline
          data={chartData}
          x="month"
          y="revenue"
          mode="area"
          fill="gradient"
          height={48}
          marks={endDot}
          ariaLabel="Monthly revenue over the last six months"
        />
        <p className="text-xs text-fg-muted">
          <span className="font-medium text-fg-success">
            {percent.format(delta)}
          </span>{' '}
          vs. last month
        </p>
      </CardContent>
    </Card>
  )
}
