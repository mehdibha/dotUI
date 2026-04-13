import type {
	DatePickerProps as AriaDatePickerProps,
	DateRangePickerProps as AriaDateRangePickerProps,
	DateValue,
} from "react-aria-components";

/**
 * A date picker combines a DateField and a Calendar popover to allow users to enter or select a date and time value.
 */
export interface DatePickerProps<T extends DateValue> extends AriaDatePickerProps<T> {}

/**
 * A date range picker combines two DateFields and a RangeCalendar popover to allow users to enter or select a date and time range.
 */
export interface DateRangePickerProps<T extends DateValue> extends AriaDateRangePickerProps<T> {}
