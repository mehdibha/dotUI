'use client'

import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeaderCell,
} from '@/registry/ui/calendar'

export default function Demo() {
  return (
    <Calendar aria-label="Date">
      <CalendarHeader />
      <CalendarGrid>
        <CalendarGridHeader>
          {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => (
            <CalendarCell date={date}>
              {({ formattedDate, isToday }) => (
                <>
                  <span>{formattedDate}</span>
                  {isToday && (
                    <span className="absolute bottom-1 left-1/2 size-0.75 -translate-x-1/2 rounded-full bg-accent" />
                  )}
                </>
              )}
            </CalendarCell>
          )}
        </CalendarGridBody>
      </CalendarGrid>
    </Calendar>
  )
}
