'use client'

import { CalendarDate } from '@internationalized/date'

import { DateField } from '@/registry/ui/date-field'
import { Label } from '@/registry/ui/field'
import { DateInput } from '@/registry/ui/input'

export default function Demo() {
  return (
    <DateField
      className="max-w-xs"
      placeholderValue={new CalendarDate(1980, 1, 1)}
    >
      <Label>Meeting date</Label>
      <DateInput />
    </DateField>
  )
}
