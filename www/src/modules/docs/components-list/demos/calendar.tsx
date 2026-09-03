import { getLocalTimeZone, today } from "@internationalized/date"

import { Calendar } from "@/registry/ui/calendar"

export function CalendarDemo() {
  return (
    <div className="absolute inset-0 flex items-start justify-center px-6 pt-6">
      <Calendar
        aria-label="Select date"
        defaultValue={today(getLocalTimeZone()).set({ day: 15 })}
      />
    </div>
  )
}
