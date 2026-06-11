'use client'

import { parseZonedDateTime } from '@internationalized/date'

import { DateInput } from '@/registry/ui/input'
import { TimeField } from '@/registry/ui/time-field'

export default function Demo() {
  return (
    <TimeField
      aria-label="Meeting time"
      defaultValue={parseZonedDateTime('2022-11-07T00:45[America/Los_Angeles]')}
    >
      <DateInput />
    </TimeField>
  )
}
