'use client'

import { getLocalTimeZone, today } from '@internationalized/date'

import { Calendar } from '@/registry/ui/calendar'

import { useStepAutoplay } from '../autoplay'

// Mid-month days that exist in every month, so `.set({ day })` always lands on a
// real cell in the currently shown month without spilling into the next one.
const DAYS = [8, 15, 22, 18]
const BASE = today(getLocalTimeZone())

// On hover, the selected day hops across a few dates — driving the calendar's
// controlled `value` (a CalendarDate). Rests on the first day when idle.
export function CalendarDemo() {
  const { index } = useStepAutoplay(DAYS.length, { dwell: 1100 })
  return (
    <Calendar
      aria-label="Select date"
      value={BASE.set({ day: DAYS[index] })}
      onChange={() => {}}
    />
  )
}
