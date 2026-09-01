import { getLocalTimeZone, today } from "@internationalized/date"

import { Calendar } from "@/registry/ui/calendar"

export function CalendarDemo() {
  return (
    <Calendar
      aria-label="Select date"
      defaultValue={today(getLocalTimeZone()).set({ day: 15 })}
    />
  )
}
