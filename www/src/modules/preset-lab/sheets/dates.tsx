import { getLocalTimeZone, today } from "@internationalized/date"

import { Calendar, RangeCalendar } from "@/registry/ui/calendar"
import { DateField } from "@/registry/ui/date-field"
import { Label } from "@/registry/ui/field"
import { DateInput } from "@/registry/ui/input"

import { Cell, Sheet } from "./layout"

export function DatesSheet() {
  const now = today(getLocalTimeZone())
  return (
    <Sheet className="grid-cols-3 items-start">
      <Cell label="calendar · today, selected day">
        <Calendar aria-label="Due date" defaultValue={now.add({ days: 3 })} />
      </Cell>
      <Cell label="range calendar">
        <RangeCalendar
          aria-label="Trip dates"
          defaultValue={{
            start: now.add({ days: 5 }),
            end: now.add({ days: 11 }),
          }}
        />
      </Cell>
      <Cell label="date field" className="flex-col items-stretch">
        <DateField defaultValue={now}>
          <Label>Start date</Label>
          <DateInput />
        </DateField>
      </Cell>
    </Sheet>
  )
}
