"use client"

import React from "react"
import { getLocalTimeZone, parseDate } from "@internationalized/date"
import { useDateFormatter } from "react-aria"
import type * as RangeCalendarPrimitives from "react-aria-components/RangeCalendar"

import { CalendarIcon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import { RangeCalendar } from "@/registry/ui/calendar"
import { DateRangePicker } from "@/registry/ui/date-picker"
import { DialogContent } from "@/registry/ui/dialog"
import { Label } from "@/registry/ui/field"
import { DateInput, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Popover } from "@/registry/ui/popover"

export default function Demo() {
  const [value, setValue] =
    React.useState<RangeCalendarPrimitives.DateRange | null>({
      start: parseDate("2024-02-03"),
      end: parseDate("2024-02-08"),
    })
  const formatter = useDateFormatter({ dateStyle: "long" })

  return (
    <div className="flex w-52 flex-col gap-6">
      <DateRangePicker value={value} onChange={setValue}>
        <Label>Meeting date</Label>
        <InputGroup>
          <DateInput slot="start" />
          <span>–</span>
          <DateInput slot="end" />
          <InputGroupAddon>
            <Button variant="secondary" size="sm" isIconOnly>
              <CalendarIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <Popover>
          <DialogContent>
            <RangeCalendar />
          </DialogContent>
        </Popover>
      </DateRangePicker>
      <p className="text-sm text-fg-muted">
        selected range:{" "}
        {value
          ? `${formatter.format(value.start.toDate(getLocalTimeZone()))} – ${formatter.format(value.end.toDate(getLocalTimeZone()))}`
          : "--"}
      </p>
    </div>
  )
}
