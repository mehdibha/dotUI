'use client'

import { Sparkline } from '@/registry/ui/chart-sparkline'

const chartData = [
  { day: 'Mon', visitors: 186 },
  { day: 'Tue', visitors: 205 },
  { day: 'Wed', visitors: 173 },
  { day: 'Thu', visitors: 241 },
  { day: 'Fri', visitors: 209 },
  { day: 'Sat', visitors: 264 },
  { day: 'Sun', visitors: 312 },
]

export default function Demo() {
  return (
    <div className="w-full max-w-56">
      <Sparkline
        data={chartData}
        x="day"
        y="visitors"
        ariaLabel="Visitors over the last seven days"
      />
    </div>
  )
}
