'use client'

import { RadarChart } from '@/registry/ui/chart-radar'

const data = [
  { month: 'Jan', desktop: 186 },
  { month: 'Feb', desktop: 305 },
  { month: 'Mar', desktop: 237 },
  { month: 'Apr', desktop: 273 },
  { month: 'May', desktop: 209 },
  { month: 'Jun', desktop: 214 },
]

const values = new Map(data.map((row) => [row.month, row.desktop]))

export default function ChartRadarLabelCustom() {
  return (
    <RadarChart
      data={data}
      x="month"
      y="desktop"
      labels={{ desktop: 'Desktop' }}
      legend={false}
      axisDetail={(month) => String(values.get(String(month)) ?? '')}
      ariaLabel="Desktop visitors, January through June"
    />
  )
}
