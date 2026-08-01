'use client'

import { Sparkline } from '@/registry/ui/chart-sparkline'

const chartData = [
  { day: 'Mon', requests: 1240 },
  { day: 'Tue', requests: 1810 },
  { day: 'Wed', requests: 1520 },
  { day: 'Thu', requests: 2260 },
  { day: 'Fri', requests: 2040 },
  { day: 'Sat', requests: 2890 },
  { day: 'Sun', requests: 3410 },
]

export default function Demo() {
  return (
    <div className="w-full max-w-56">
      <Sparkline
        data={chartData}
        x="day"
        y="requests"
        mode="area"
        fill="gradient"
        height={56}
        ariaLabel="Requests over the last seven days"
      />
    </div>
  )
}
