'use client'

import { Time } from '@internationalized/date'

import { DateInput } from '@/registry/ui/input'
import { TimeField } from '@/registry/ui/time-field'

export default function Demo() {
  return (
    <TimeField
      aria-label="Appointment time"
      defaultValue={new Time(18, 45)}
      hourCycle={24}
      className="w-auto max-w-xs"
    >
      <DateInput />
    </TimeField>
  )
}
