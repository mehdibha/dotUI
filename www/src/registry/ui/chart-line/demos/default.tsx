'use client'

import { LineChart } from '@/registry/ui/chart-line'

const chartData = [
  { month: 'Jan', desktop: 186 },
  { month: 'Feb', desktop: 305 },
  { month: 'Mar', desktop: 237 },
  { month: 'Apr', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'Jun', desktop: 214 },
]

export default function ChartLineDefault() {
  return (
    <div className="w-full">
      <LineChart
        data={chartData}
        x="month"
        y="desktop"
        labels={{ desktop: 'Desktop' }}
        legend={false}
        ariaLabel="Desktop visitors, January through June"
      />
    </div>
  )
}
