'use client'

import { Button } from '@/registry/ui/button'
import { DateField } from '@/registry/ui/date-field'
import { Description, Label } from '@/registry/ui/field'
import { DateInput } from '@/registry/ui/input'

export default function Demo() {
  return (
    <form
      className="flex w-full max-w-xs flex-col gap-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <DateField name="event-date" granularity="day" isRequired>
        <Label>Event date</Label>
        <DateInput />
      </DateField>
      <DateField name="event-time" granularity="minute">
        <Label>Start time (optional)</Label>
        <DateInput />
        <Description>Leave empty for an all-day event.</Description>
      </DateField>
      <Button type="submit" className="w-full">
        Book event
      </Button>
    </form>
  )
}
