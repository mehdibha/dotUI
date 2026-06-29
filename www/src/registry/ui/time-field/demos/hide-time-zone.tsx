'use client'

import { parseZonedDateTime } from '@internationalized/date'

import { Label } from '@/registry/ui/field'
import { DateInput } from '@/registry/ui/input'
import { TimeField } from '@/registry/ui/time-field'

export default function Demo() {
  return (
    <TimeField
      className="max-w-xs"
      defaultValue={parseZonedDateTime('2022-11-07T10:45[America/Los_Angeles]')}
      hideTimeZone
    >
      <Label>Appointment time</Label>
      <DateInput />
    </TimeField>
  )
}
