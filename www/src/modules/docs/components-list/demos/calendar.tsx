import { CalendarDate } from "@internationalized/date"

import { Calendar } from "@/registry/ui/calendar"

// Fills the card with its own scale: the default stage's padding would shrink a
// whole month below legibility. A fixed five-week month keeps that scale
// stable year-round.
export function CalendarDemo() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Calendar
        aria-label="Select date"
        className="scale-[0.6]"
        defaultValue={new CalendarDate(2026, 6, 15)}
      />
    </div>
  )
}
