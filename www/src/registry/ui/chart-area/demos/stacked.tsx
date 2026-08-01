'use client'

import { stackY } from '@/registry/ui/chart'
import { AreaChart } from '@/registry/ui/chart-area'

const data = [
  { month: 'Jan', desktop: 186, mobile: 80, other: 45 },
  { month: 'Feb', desktop: 305, mobile: 200, other: 100 },
  { month: 'Mar', desktop: 237, mobile: 120, other: 150 },
  { month: 'Apr', desktop: 73, mobile: 190, other: 50 },
  { month: 'May', desktop: 209, mobile: 130, other: 100 },
  { month: 'Jun', desktop: 214, mobile: 140, other: 160 },
]

/* Stacking is a data transform, not a chart flag: wide rows in, one long row
   per band out, carrying `base`/`top` plus its own `value` for the tooltip. */
const stacked = stackY(data, {
  x: 'month',
  y: ['desktop', 'mobile', 'other'],
})

export default function ChartAreaStacked() {
  return (
    <AreaChart
      data={stacked}
      x="x"
      y="top"
      y1="base"
      series="series"
      seriesOrder={['desktop', 'mobile', 'other']}
      labels={{ desktop: 'Desktop', mobile: 'Mobile', other: 'Other' }}
      ariaLabel="Visitors by device, stacked, January through June"
    />
  )
}
