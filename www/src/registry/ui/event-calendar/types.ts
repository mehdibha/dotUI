import type React from 'react'

/**
 * The token-based color of an event chip. Maps to a semantic design-system color.
 */
export type EventColor =
  | 'primary'
  | 'accent'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info'
  | 'neutral'

/**
 * A single event rendered on the calendar grid.
 */
export interface CalendarEvent {
  /** Stable unique identifier, used as the React key. */
  id: string
  /** The text shown on the event chip. */
  title: string
  /** The day the event falls on. Only the date portion is compared. */
  date: Date
  /**
   * The semantic color of the event chip.
   * @default 'primary'
   */
  color?: EventColor
}

/**
 * A month-grid calendar that renders events as colored chips. Composed of a header
 * (heading + navigation) and a 7-column grid of day cells.
 */
export interface EventCalendarProps extends React.ComponentProps<'div'> {
  /** Events to render across the visible month. */
  events?: CalendarEvent[]
  /** The controlled visible month — any `Date` within the month to display. */
  month?: Date
  /**
   * The initial visible month for uncontrolled usage.
   * @default the current month
   */
  defaultMonth?: Date
  /** Called with the new month whenever navigation changes the visible month. */
  onMonthChange?: (date: Date) => void
  /**
   * The first day of the week: `0` for Sunday, `1` for Monday.
   * @default 1
   */
  weekStartsOn?: 0 | 1
  /**
   * The maximum number of event chips shown in a day cell before a
   * "+N more" overflow indicator is rendered.
   * @default 3
   */
  maxEventsPerDay?: number
}

/**
 * The calendar header. Renders the month heading and navigation controls by default.
 */
export interface EventCalendarHeaderProps extends React.ComponentProps<'header'> {}

/**
 * The month/year heading. Falls back to the formatted visible month.
 */
export interface EventCalendarHeadingProps extends React.ComponentProps<'h2'> {}

/**
 * The navigation controls: Today, Previous month, and Next month buttons.
 */
export interface EventCalendarNavProps extends React.ComponentProps<'div'> {}

/**
 * The 7-column month grid: a row of weekday headers followed by day cells.
 */
export interface EventCalendarGridProps extends React.ComponentProps<'div'> {
  /** Render a custom day cell in place of the default one. */
  renderDay?: (day: Date, events: CalendarEvent[]) => React.ReactNode
}

/**
 * A single day cell, showing the day number and its event chips with overflow.
 */
export interface EventCalendarDayProps extends Omit<
  React.ComponentProps<'div'>,
  'children'
> {
  /** The day this cell represents. */
  day: Date
  /** The events that fall on this day. */
  events: CalendarEvent[]
}

/**
 * A colored event chip rendered inside a day cell.
 */
export interface EventCalendarChipProps extends Omit<
  React.ComponentProps<'span'>,
  'color'
> {
  /** The event to render. */
  event: CalendarEvent
}
