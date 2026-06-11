'use client'

import { getLocalTimeZone, today } from '@internationalized/date'

import { Calendar } from '@/registry/ui/calendar'

export default function Demo() {
  return (
    <Calendar
      aria-label="Date"
      defaultValue={today(getLocalTimeZone())}
      isDisabled
    />
  )
}
