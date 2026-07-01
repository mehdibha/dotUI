'use client'

import { CalendarDate } from '@internationalized/date'

import { DateField } from '@/registry/ui/date-field'
import { DateInput } from '@/registry/ui/input'

export default function Demo() {
  return (
    <DateField
      className="max-w-xs"
      aria-label="Event date"
      value={new CalendarDate(1980, 1, 1)}
      isReadOnly
    >
      <DateInput />
    </DateField>
  )
}
