import { getLocalTimeZone, today } from "@internationalized/date"

import { Calendar } from "@/registry/ui/calendar"

export function CalendarDemo() {
  return (
    <div className="absolute inset-0 flex justify-center px-4 pt-4">
      <Calendar
        aria-label="Select date"
        defaultValue={today(getLocalTimeZone()).set({ day: 15 })}
      />
    </div>
  )
}
