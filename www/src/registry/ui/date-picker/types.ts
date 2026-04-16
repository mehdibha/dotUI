import * as CalendarPrimitives from "react-aria-components/Calendar";
import * as DatePickerPrimitives from "react-aria-components/DatePicker";
import * as DateRangePickerPrimitives from "react-aria-components/DateRangePicker";

/**
 * A date picker combines a DateField and a Calendar popover to allow users to enter or select a date and time value.
 */
export interface DatePickerProps<T extends CalendarPrimitives.DateValue> extends DatePickerPrimitives.DatePickerProps<T> {}

/**
 * A date range picker combines two DateFields and a RangeCalendar popover to allow users to enter or select a date and time range.
 */
export interface DateRangePickerProps<T extends CalendarPrimitives.DateValue> extends DateRangePickerPrimitives.DateRangePickerProps<T> {}
