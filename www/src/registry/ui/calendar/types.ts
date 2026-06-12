import type * as CalendarPrimitives from 'react-aria-components/Calendar'
import type * as RangeCalendarPrimitives from 'react-aria-components/RangeCalendar'

/**
 * A calendar displays one or more date grids and allows users to select a single date.
 */
export interface CalendarProps<
  T extends CalendarPrimitives.DateValue,
> extends CalendarPrimitives.CalendarProps<T> {}

/**
 * A range calendar displays one or more date grids and allows users to select a contiguous range of dates.
 */
export interface RangeCalendarProps<
  T extends CalendarPrimitives.DateValue,
> extends RangeCalendarPrimitives.RangeCalendarProps<T> {}

/**
 * The header of a calendar, containing the navigation buttons and the heading.
 */
export interface CalendarHeaderProps extends React.ComponentProps<'header'> {}

/**
 * A calendar grid displays a single grid of days within a calendar or range calendar
 * which can be keyboard navigated and selected by the user.
 */
export interface CalendarGridProps extends React.ComponentProps<
  typeof CalendarPrimitives.CalendarGrid
> {}

/**
 * A calendar grid header displays a row of week day names at the top of a month.
 */
export interface CalendarGridHeaderProps extends React.ComponentProps<
  typeof CalendarPrimitives.CalendarGridHeader
> {}

/**
 * A calendar header cell displays a week day name at the top of a column within a calendar.
 */
export interface CalendarHeaderCellProps extends React.ComponentProps<
  typeof CalendarPrimitives.CalendarHeaderCell
> {}

/**
 * A calendar grid body displays a grid of calendar cells within a month.
 */
export interface CalendarGridBodyProps extends React.ComponentProps<
  typeof CalendarPrimitives.CalendarGridBody
> {}

/**
 * A calendar cell displays a date cell within a calendar grid which can be selected by the user.
 */
export interface CalendarCellProps extends React.ComponentProps<
  typeof CalendarPrimitives.CalendarCell
> {
  /**
   * The color variant of the selected cell.
   * @default 'accent'
   */
  variant?: 'primary' | 'accent'
}
