'use client'

import { getLocalTimeZone, today } from '@internationalized/date'

import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeaderCell,
  CalendarHeading,
} from '@/registry/ui/calendar'

export default function Demo() {
  return (
    <Calendar aria-label="Date" defaultValue={today(getLocalTimeZone())}>
      <CalendarHeader>
        <Button slot="previous" variant="quiet" isIconOnly>
          <ChevronLeftIcon />
        </Button>
        <CalendarHeading />
        <Button slot="next" variant="quiet" isIconOnly>
          <ChevronRightIcon />
        </Button>
      </CalendarHeader>
      <CalendarGrid>
        <CalendarGridHeader>
          {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => <CalendarCell date={date} />}
        </CalendarGridBody>
      </CalendarGrid>
    </Calendar>
  )
}
