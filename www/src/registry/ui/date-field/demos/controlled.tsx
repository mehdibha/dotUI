'use client'

import React from 'react'
import { parseDate } from '@internationalized/date'
import type * as CalendarPrimitives from 'react-aria-components/Calendar'

import { DateField } from '@/registry/ui/date-field'
import { DateInput } from '@/registry/ui/input'

export default function Demo() {
  const [value, setValue] = React.useState<CalendarPrimitives.DateValue | null>(
    parseDate('2020-02-03'),
  )

  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <DateField aria-label="Event date" value={value} onChange={setValue}>
        <DateInput />
      </DateField>
      <p className="text-sm text-fg-muted">
        selected date: {value ? value.toString() : 'none'}
      </p>
    </div>
  )
}
