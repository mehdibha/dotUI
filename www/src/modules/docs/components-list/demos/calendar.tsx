import { getLocalTimeZone, today } from '@internationalized/date'

import { Calendar } from '@/registry/ui/calendar'

// Mid-month day, so it always lands on a real cell in the current month.
export function CalendarDemo() {
  return (
    <Calendar
      aria-label="Select date"
      defaultValue={today(getLocalTimeZone()).set({ day: 15 })}
    />
  )
}
