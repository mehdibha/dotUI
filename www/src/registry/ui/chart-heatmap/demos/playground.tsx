"use client"

import { HeatmapChart } from "@/registry/ui/chart-heatmap"

const days = [
  { day: "Mon", sessions: [12, 48, 61, 22] },
  { day: "Tue", sessions: [14, 52, 58, 25] },
  { day: "Wed", sessions: [11, 55, 66, 28] },
  { day: "Thu", sessions: [15, 59, 70, 31] },
  { day: "Fri", sessions: [10, 44, 49, 36] },
  { day: "Sat", sessions: [6, 21, 27, 40] },
  { day: "Sun", sessions: [5, 18, 24, 19] },
]

const dayparts = ["Morning", "Afternoon", "Evening", "Night"]

const data = days.flatMap(({ day, sessions }) =>
  sessions.map((value, index) => ({
    day,
    daypart: dayparts[index],
    sessions: value,
  })),
)

export default function Demo({
  values = false,
  legend = true,
  axes = true,
}: {
  values?: boolean
  legend?: boolean
  axes?: boolean
} = {}) {
  return (
    <HeatmapChart
      data={data}
      x="daypart"
      y="day"
      value="sessions"
      values={values}
      legend={legend}
      axes={axes}
      label="Sessions"
      ariaLabel="Sessions by weekday and time of day"
      height={260}
    />
  )
}
