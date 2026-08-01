'use client'

import { HeatmapChart } from '@/registry/ui/chart-heatmap'

/* Sessions per weekday and hour: a daily shape scaled by how busy the day is. */
const hours = [
  { hour: '08', base: 14 },
  { hour: '09', base: 32 },
  { hour: '10', base: 58 },
  { hour: '11', base: 74 },
  { hour: '12', base: 61 },
  { hour: '13', base: 42 },
  { hour: '14', base: 66 },
  { hour: '15', base: 88 },
  { hour: '16', base: 71 },
  { hour: '17', base: 39 },
]

const days = [
  { day: 'Mon', weight: 1 },
  { day: 'Tue', weight: 0.94 },
  { day: 'Wed', weight: 1.06 },
  { day: 'Thu', weight: 1.12 },
  { day: 'Fri', weight: 0.87 },
  { day: 'Sat', weight: 0.42 },
  { day: 'Sun', weight: 0.31 },
]

const chartData = days.flatMap(({ day, weight }) =>
  hours.map(({ hour, base }) => ({
    day,
    hour,
    sessions: Math.round(base * weight),
  })),
)

export default function Demo() {
  return (
    <HeatmapChart
      data={chartData}
      x="hour"
      y="day"
      value="sessions"
      label="Sessions"
      labelX="Hour"
      labelY="Day"
      ariaLabel="Sessions by weekday and hour"
    />
  )
}
