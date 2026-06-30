'use client'

import { EventCalendar } from '@/registry/ui/event-calendar'
import type { CalendarEvent } from '@/registry/ui/event-calendar'

const now = new Date()
const day = (offset: number) =>
  new Date(now.getFullYear(), now.getMonth(), offset)

const events: CalendarEvent[] = [
  { id: '1', title: 'Team standup', date: day(4), color: 'primary' },
  { id: '2', title: 'Design review', date: day(12), color: 'accent' },
  { id: '3', title: 'Release v2.0', date: day(12), color: 'success' },
  { id: '4', title: 'On-call rotation', date: day(12), color: 'warning' },
  { id: '5', title: 'Roadmap sync', date: day(12), color: 'info' },
  { id: '6', title: 'Incident retro', date: day(21), color: 'danger' },
]

export default function Demo() {
  return (
    <div className="w-full max-w-2xl">
      <EventCalendar events={events} defaultMonth={now} />
    </div>
  )
}
