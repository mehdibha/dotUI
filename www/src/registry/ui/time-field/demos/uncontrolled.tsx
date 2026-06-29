'use client'

import { Time } from '@internationalized/date'

import { DateInput } from '@/registry/ui/input'
import { TimeField } from '@/registry/ui/time-field'

export default function Demo() {
  return (
    <TimeField
      className="max-w-xs"
      aria-label="Event time"
      defaultValue={new Time(11, 45)}
    >
      <DateInput />
    </TimeField>
  )
}
