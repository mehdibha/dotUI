import { parseDate, Time } from "@internationalized/date"

import { CalendarIcon, ClockIcon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import { RangeCalendar } from "@/registry/ui/calendar"
import { DateRangePicker } from "@/registry/ui/date-picker"
import { DialogContent } from "@/registry/ui/dialog"
import { Label } from "@/registry/ui/field"
import { DateInput, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Popover } from "@/registry/ui/popover"
import { TimePicker, TimePickerColumns } from "@/registry/ui/time-picker"

export function DatesScene() {
  return (
    <div className="flex w-full max-w-72 flex-col gap-4">
      <DateRangePicker
        defaultValue={{
          start: parseDate("2026-11-12"),
          end: parseDate("2026-11-15"),
        }}
      >
        <Label>Trip dates</Label>
        <InputGroup>
          <DateInput slot="start" />
          <span aria-hidden>–</span>
          <DateInput slot="end" />
          <InputGroupAddon>
            <Button variant="quiet" size="sm" isIconOnly aria-label="Calendar">
              <CalendarIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <Popover>
          <DialogContent>
            {/* In a sheet the calendar fills the width: bigger days, easier taps. */}
            <RangeCalendar className="in-data-sheet:w-full" />
          </DialogContent>
        </Popover>
      </DateRangePicker>
      <TimePicker defaultValue={new Time(15, 30)}>
        <Label>Check-in</Label>
        <InputGroup>
          <DateInput />
          <InputGroupAddon>
            <Button
              variant="quiet"
              size="sm"
              isIconOnly
              aria-label="Choose time"
            >
              <ClockIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <Popover>
          <DialogContent>
            <TimePickerColumns className="in-data-sheet:h-64 in-data-sheet:*:flex-1" />
          </DialogContent>
        </Popover>
      </TimePicker>
    </div>
  )
}
