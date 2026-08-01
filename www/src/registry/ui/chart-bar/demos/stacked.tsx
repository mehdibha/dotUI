'use client'

import { stackY } from '@/registry/ui/chart'
import { BarChart } from '@/registry/ui/chart-bar'

const rows = [
  { month: 'Jan', desktop: 186, mobile: 80, tablet: 45 },
  { month: 'Feb', desktop: 305, mobile: 200, tablet: 90 },
  { month: 'Mar', desktop: 237, mobile: 120, tablet: 60 },
  { month: 'Apr', desktop: 73, mobile: 190, tablet: 110 },
  { month: 'May', desktop: 209, mobile: 130, tablet: 70 },
  { month: 'Jun', desktop: 214, mobile: 140, tablet: 85 },
]

// Module scope: the stacked rows keep one identity for the whole session.
const data = stackY(rows, {
  x: 'month',
  y: ['desktop', 'mobile', 'tablet'],
})

export default function ChartBarStacked() {
  return (
    <BarChart
      data={data}
      x="x"
      y="top"
      y1="base"
      series="series"
      seriesOrder={['desktop', 'mobile', 'tablet']}
      labels={{ desktop: 'Desktop', mobile: 'Mobile', tablet: 'Tablet' }}
      radius={2}
      ariaLabel="Visitors per month by device, stacked"
    />
  )
}
