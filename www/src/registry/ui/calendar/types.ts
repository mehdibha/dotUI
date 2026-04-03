import type {
	CalendarCell as AriaCalendarCell,
	CalendarGrid as AriaCalendarGrid,
	CalendarGridBody as AriaCalendarGridBody,
	CalendarGridHeader as AriaCalendarGridHeader,
	CalendarHeaderCell as AriaCalendarHeaderCell,
	CalendarProps as AriaCalendarProps,
	RangeCalendarProps as AriaRangeCalendarProps,
	DateValue,
} from "react-aria-components";

/**
 * A calendar displays one or more date grids and allows users to select a single date.
 * When mode is "range", it allows users to select a contiguous range of dates.
 */
export type CalendarProps<T extends DateValue> =
	| ({
			mode?: "single";
	  } & AriaCalendarProps<T>)
	| ({
			mode: "range";
	  } & AriaRangeCalendarProps<T>);

/**
 * Missing description.
 */
export interface CalendarHeaderProps extends React.ComponentProps<"header"> {}

/**
 * A calendar grid displays a single grid of days within a calendar or range calendar
 * which can be keyboard navigated and selected by the user.
 */
export interface CalendarGridProps extends React.ComponentProps<typeof AriaCalendarGrid> {}

/**
 * A calendar grid header displays a row of week day names at the top of a month.
 */
export interface CalendarGridHeaderProps extends React.ComponentProps<typeof AriaCalendarGridHeader> {}

/**
 * A calendar header cell displays a week day name at the top of a column within a calendar.
 */
export interface CalendarHeaderCellProps extends React.ComponentProps<typeof AriaCalendarHeaderCell> {}

/**
 * A calendar grid body displays a grid of calendar cells within a month.
 */
export interface CalendarGridBodyProps extends React.ComponentProps<typeof AriaCalendarGridBody> {}

/**
 * A calendar cell displays a date cell within a calendar grid which can be selected by the user.
 */
export interface CalendarCellProps extends React.ComponentProps<typeof AriaCalendarCell> {
	/**
	 * The color variant of the selected cell.
	 * @default 'accent'
	 */
	variant?: "primary" | "accent";
}
