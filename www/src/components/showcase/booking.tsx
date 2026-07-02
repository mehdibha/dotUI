'use client'

import React from 'react'
import { parseDate, Time } from '@internationalized/date'
import type { DateValue } from 'react-aria-components/Calendar'
import type { RangeValue } from 'react-aria-components/RangeCalendar'

import { CalendarIcon, ClockIcon } from '@/registry/__generated__/icons'
import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { RangeCalendar } from '@/registry/ui/calendar'
import { Card, CardContent, CardFooter } from '@/registry/ui/card'
import { DatePicker } from '@/registry/ui/date-picker'
import { DialogContent } from '@/registry/ui/dialog'
import { Label } from '@/registry/ui/field'
import { DateInput, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'
import { TimePicker, TimePickerColumns } from '@/registry/ui/time-picker'

export function Booking({ className, ...props }: React.ComponentProps<'div'>) {
  const [range, setRange] = React.useState<RangeValue<DateValue>>({
    start: parseDate('2026-02-11'),
    end: parseDate('2026-02-19'),
  })
  const [startTime, setStartTime] = React.useState<Time | null>(new Time(14, 0))
  const [endTime, setEndTime] = React.useState<Time | null>(new Time(12, 0))

  return (
    <Card className={cn('', className)} {...props}>
      <CardContent className="space-y-3">
        <RangeCalendar
          className="w-full border-0 bg-transparent p-0"
          value={range}
          onChange={setRange}
        />
        <div className="flex flex-col gap-1.5">
          <Label>Start</Label>
          <div className="flex gap-2">
            <DatePicker
              aria-label="Start date"
              value={range.start}
              onChange={(value) =>
                value && setRange((prev) => ({ ...prev, start: value }))
              }
            >
              <InputGroup>
                <DateInput />
                <InputGroupAddon>
                  <Button variant="default" size="sm" isIconOnly>
                    <CalendarIcon />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
              <Popover>
                <DialogContent>
                  <RangeCalendar value={range} onChange={setRange} />
                </DialogContent>
              </Popover>
            </DatePicker>
            <TimePicker
              aria-label="Start time"
              value={startTime}
              onChange={setStartTime}
            >
              <InputGroup>
                <DateInput />
                <InputGroupAddon>
                  <Button
                    variant="default"
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
                  <TimePickerColumns />
                </DialogContent>
              </Popover>
            </TimePicker>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>End</Label>
          <div className="flex gap-2">
            <DatePicker
              aria-label="End date"
              value={range.end}
              onChange={(value) =>
                value && setRange((prev) => ({ ...prev, end: value }))
              }
            >
              <InputGroup>
                <DateInput />
                <InputGroupAddon>
                  <Button variant="default" size="sm" isIconOnly>
                    <CalendarIcon />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
              <Popover>
                <DialogContent>
                  <RangeCalendar value={range} onChange={setRange} />
                </DialogContent>
              </Popover>
            </DatePicker>
            <TimePicker
              aria-label="End time"
              value={endTime}
              onChange={setEndTime}
            >
              <InputGroup>
                <DateInput />
                <InputGroupAddon>
                  <Button
                    variant="default"
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
                  <TimePickerColumns />
                </DialogContent>
              </Popover>
            </TimePicker>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button>Dismiss</Button>
        <Button variant="primary">Apply</Button>
      </CardFooter>
    </Card>
  )
}
