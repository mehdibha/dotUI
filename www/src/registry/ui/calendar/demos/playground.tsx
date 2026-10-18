"use client"

import type { DateValue } from "react-aria-components/Calendar"

import {
  Calendar,
  CalendarGrid,
  CalendarHeader,
  type CalendarProps,
} from "@/registry/ui/calendar"

interface PlaygroundProps extends Omit<
  CalendarProps<DateValue>,
  "visibleDuration"
> {
  visibleDuration?: number
}

export default function Demo({
  firstDayOfWeek = "sun",
  visibleDuration = 1,
  pageBehavior = "visible",
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
}: PlaygroundProps = {}) {
  return (
    <Calendar
      aria-label="Date"
      firstDayOfWeek={firstDayOfWeek}
      visibleDuration={{ months: visibleDuration }}
      pageBehavior={pageBehavior}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={isInvalid}
    >
      <CalendarHeader />
      <div className="flex flex-wrap items-start gap-4">
        <CalendarGrid />
        {visibleDuration > 1 && <CalendarGrid offset={{ months: 1 }} />}
        {visibleDuration > 2 && <CalendarGrid offset={{ months: 2 }} />}
      </div>
    </Calendar>
  )
}
