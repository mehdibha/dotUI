'use client'

import { Description, Label } from '@/registry/ui/field'
import { DateInput } from '@/registry/ui/input'
import { TimeField } from '@/registry/ui/time-field'

export default function Demo() {
  return (
    <TimeField className="max-w-xs">
      <Label>Appointment time</Label>
      <DateInput />
      <Description>Please select a time between 9 AM and 5 PM.</Description>
    </TimeField>
  )
}
