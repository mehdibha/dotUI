'use client'

import { getLocalTimeZone, today } from '@internationalized/date'

import { Calendar } from '@/registry/ui/calendar'

export default function Demo() {
  const now = today(getLocalTimeZone())
  return (
    <Calendar
      aria-label="Date"
      defaultValue={now}
      minValue={now.subtract({ days: 3 })}
      maxValue={now.add({ days: 14 })}
    />
  )
}
