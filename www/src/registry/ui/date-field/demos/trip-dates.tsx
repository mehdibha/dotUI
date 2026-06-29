'use client'

import { DateField } from '@/registry/ui/date-field'
import { Description, Label } from '@/registry/ui/field'
import { DateInput } from '@/registry/ui/input'

export default function Demo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <DateField name="check-in" granularity="day">
        <Label>Check-in</Label>
        <DateInput />
        <Description>The day your trip starts.</Description>
      </DateField>
      <DateField name="check-out" granularity="day">
        <Label>Check-out</Label>
        <DateInput />
        <Description>The day you head back home.</Description>
      </DateField>
    </div>
  )
}
