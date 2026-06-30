'use client'

import * as React from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'

import { useStyles } from './styles'

// MARK: eventCalendarStyles

// MARK: Types

type EventColor =
  | 'primary'
  | 'accent'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info'
  | 'neutral'

interface CalendarEvent {
  id: string
  title: string
  date: Date
  color?: EventColor
}

interface EventCalendarContextValue {
  month: Date
  setMonth: (date: Date) => void
  goToPrevious: () => void
  goToNext: () => void
  goToToday: () => void
  weekStartsOn: 0 | 1
  maxEventsPerDay: number
  getEventsForDay: (day: Date) => CalendarEvent[]
}

const EventCalendarContext =
  React.createContext<EventCalendarContextValue | null>(null)

function useEventCalendar(): EventCalendarContextValue {
  const context = React.useContext(EventCalendarContext)
  if (!context) {
    throw new Error(
      'useEventCalendar must be used within an <EventCalendar> provider.',
    )
  }
  return context
}

// MARK: EventCalendar

interface EventCalendarProps extends React.ComponentProps<'div'> {
  /** Events to render across the month grid. */
  events?: CalendarEvent[]
  /** Controlled visible month (any day within it). */
  month?: Date
  /** Initial visible month for uncontrolled usage. @default current month */
  defaultMonth?: Date
  /** Called when the visible month changes. */
  onMonthChange?: (date: Date) => void
  /** First day of the week: 0 = Sunday, 1 = Monday. @default 1 */
  weekStartsOn?: 0 | 1
  /** Maximum event chips shown per day before a "+N more" overflow. @default 3 */
  maxEventsPerDay?: number
}

const EventCalendar = ({
  events = [],
  month: monthProp,
  defaultMonth,
  onMonthChange,
  weekStartsOn = 1,
  maxEventsPerDay = 3,
  className,
  children,
  ...props
}: EventCalendarProps) => {
  const { root } = useStyles()()

  const [internalMonth, setInternalMonth] = React.useState<Date>(
    () => defaultMonth ?? new Date(),
  )
  const month = monthProp ?? internalMonth

  const setMonth = React.useCallback(
    (date: Date) => {
      if (monthProp === undefined) {
        setInternalMonth(date)
      }
      onMonthChange?.(date)
    },
    [monthProp, onMonthChange],
  )

  const goToPrevious = React.useCallback(
    () => setMonth(subMonths(month, 1)),
    [month, setMonth],
  )
  const goToNext = React.useCallback(
    () => setMonth(addMonths(month, 1)),
    [month, setMonth],
  )
  const goToToday = React.useCallback(() => setMonth(new Date()), [setMonth])

  const getEventsForDay = React.useCallback(
    (day: Date) => events.filter((event) => isSameDay(event.date, day)),
    [events],
  )

  const value = React.useMemo<EventCalendarContextValue>(
    () => ({
      month,
      setMonth,
      goToPrevious,
      goToNext,
      goToToday,
      weekStartsOn,
      maxEventsPerDay,
      getEventsForDay,
    }),
    [
      month,
      setMonth,
      goToPrevious,
      goToNext,
      goToToday,
      weekStartsOn,
      maxEventsPerDay,
      getEventsForDay,
    ],
  )

  return (
    <EventCalendarContext.Provider value={value}>
      <div data-event-calendar="" className={root({ className })} {...props}>
        {children ?? (
          <>
            <EventCalendarHeader />
            <EventCalendarGrid />
          </>
        )}
      </div>
    </EventCalendarContext.Provider>
  )
}

// MARK: EventCalendarHeader

interface EventCalendarHeaderProps extends React.ComponentProps<'header'> {}

const EventCalendarHeader = ({
  className,
  children,
  ...props
}: EventCalendarHeaderProps) => {
  const { header } = useStyles()()
  return (
    <header
      data-event-calendar-header=""
      className={header({ className })}
      {...props}
    >
      {children ?? (
        <>
          <EventCalendarHeading />
          <EventCalendarNav />
        </>
      )}
    </header>
  )
}

// MARK: EventCalendarHeading

interface EventCalendarHeadingProps extends React.ComponentProps<'h2'> {}

const EventCalendarHeading = ({
  className,
  children,
  ...props
}: EventCalendarHeadingProps) => {
  const { heading } = useStyles()()
  const { month } = useEventCalendar()
  return (
    <h2
      data-event-calendar-heading=""
      className={heading({ className })}
      {...props}
    >
      {children ?? format(month, 'MMMM yyyy')}
    </h2>
  )
}

// MARK: EventCalendarNav

interface EventCalendarNavProps extends React.ComponentProps<'div'> {}

const EventCalendarNav = ({
  className,
  children,
  ...props
}: EventCalendarNavProps) => {
  const { nav } = useStyles()()
  const { goToPrevious, goToNext, goToToday } = useEventCalendar()
  return (
    <div data-event-calendar-nav="" className={nav({ className })} {...props}>
      {children ?? (
        <>
          <Button variant="quiet" size="sm" onPress={goToToday}>
            Today
          </Button>
          <Button
            variant="quiet"
            isIconOnly
            aria-label="Previous month"
            onPress={goToPrevious}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="quiet"
            isIconOnly
            aria-label="Next month"
            onPress={goToNext}
          >
            <ChevronRightIcon />
          </Button>
        </>
      )}
    </div>
  )
}

// MARK: EventCalendarGrid

interface EventCalendarGridProps extends React.ComponentProps<'div'> {
  /** Render a custom day cell. */
  renderDay?: (day: Date, events: CalendarEvent[]) => React.ReactNode
}

const EventCalendarGrid = ({
  className,
  renderDay,
  ...props
}: EventCalendarGridProps) => {
  const { grid, weekday } = useStyles()()
  const { month, weekStartsOn, getEventsForDay } = useEventCalendar()

  const days = React.useMemo(() => {
    const gridStart = startOfWeek(startOfMonth(month), { weekStartsOn })
    const gridEnd = endOfWeek(endOfMonth(month), { weekStartsOn })
    return eachDayOfInterval({ start: gridStart, end: gridEnd })
  }, [month, weekStartsOn])

  const weekdayLabels = React.useMemo(() => {
    // Build labels from the first rendered week so they honor `weekStartsOn`.
    return days.slice(0, 7).map((day) => format(day, 'EEE'))
  }, [days])

  return (
    <div data-event-calendar-grid="" className={grid({ className })} {...props}>
      {weekdayLabels.map((label) => (
        <div key={label} data-event-calendar-weekday="" className={weekday()}>
          {label}
        </div>
      ))}
      {days.map((day) => {
        const dayEvents = getEventsForDay(day)
        return (
          <React.Fragment key={day.toISOString()}>
            {renderDay ? (
              renderDay(day, dayEvents)
            ) : (
              <EventCalendarDay day={day} events={dayEvents} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// MARK: EventCalendarDay

interface EventCalendarDayProps extends Omit<
  React.ComponentProps<'div'>,
  'children'
> {
  day: Date
  events: CalendarEvent[]
}

const EventCalendarDay = ({
  day,
  events,
  className,
  ...props
}: EventCalendarDayProps) => {
  const { cell, dayNumber, events: eventsList, more } = useStyles()()
  const { month, maxEventsPerDay } = useEventCalendar()

  const isOutside = !isSameMonth(day, month)
  const visible = events.slice(0, maxEventsPerDay)
  const overflow = events.length - visible.length

  return (
    <div
      data-event-calendar-day=""
      data-outside={isOutside ? 'true' : undefined}
      data-today={isToday(day) ? 'true' : undefined}
      className={cell({ className })}
      {...props}
    >
      <span
        data-today={isToday(day) ? 'true' : undefined}
        className={dayNumber()}
      >
        {format(day, 'd')}
      </span>
      <div className={eventsList()}>
        {visible.map((event) => (
          <EventCalendarChip key={event.id} event={event} />
        ))}
        {overflow > 0 && <span className={more()}>+{overflow} more</span>}
      </div>
    </div>
  )
}

// MARK: EventCalendarChip

interface EventCalendarChipProps extends Omit<
  React.ComponentProps<'span'>,
  'color'
> {
  event: CalendarEvent
}

const EventCalendarChip = ({
  event,
  className,
  children,
  ...props
}: EventCalendarChipProps) => {
  const { chip, chipDot, chipLabel } = useStyles()()
  return (
    <span
      data-event-calendar-chip=""
      className={chip({ color: event.color ?? 'primary', className })}
      {...props}
    >
      {children ?? (
        <>
          <span className={chipDot({ color: event.color ?? 'primary' })} />
          <span className={chipLabel()}>{event.title}</span>
        </>
      )}
    </span>
  )
}

// MARK: Separator

export type {
  CalendarEvent,
  EventColor,
  EventCalendarChipProps,
  EventCalendarDayProps,
  EventCalendarGridProps,
  EventCalendarHeaderProps,
  EventCalendarHeadingProps,
  EventCalendarNavProps,
  EventCalendarProps,
}
export {
  EventCalendar,
  EventCalendarChip,
  EventCalendarDay,
  EventCalendarGrid,
  EventCalendarHeader,
  EventCalendarHeading,
  EventCalendarNav,
  useEventCalendar,
}
