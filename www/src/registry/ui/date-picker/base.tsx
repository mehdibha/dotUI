"use client";

import * as CalendarPrimitives from "react-aria-components/Calendar";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as DatePickerPrimitives from "react-aria-components/DatePicker";
import * as DateRangePickerPrimitives from "react-aria-components/DateRangePicker";


import { useStyles } from "./styles";

// MARK: DatePicker

interface DatePickerProps<T extends CalendarPrimitives.DateValue> extends DatePickerPrimitives.DatePickerProps<T> {}

const DatePicker = <T extends CalendarPrimitives.DateValue>({ className, ...props }: DatePickerProps<T>) => {
	const datePickerStyles = useStyles();
	return (
		<DatePickerPrimitives.DatePicker
			className={composeRenderProps(className, (className) => datePickerStyles({ className }))}
			{...props}
		/>
	);
};

// MARK: DateRangePicker

interface DateRangePickerProps<T extends CalendarPrimitives.DateValue> extends DateRangePickerPrimitives.DateRangePickerProps<T> {}

const DateRangePicker = <T extends CalendarPrimitives.DateValue>({ className, ...props }: DateRangePickerProps<T>) => {
	const datePickerStyles = useStyles();
	return (
		<DateRangePickerPrimitives.DateRangePicker
			className={composeRenderProps(className, (className) => datePickerStyles({ className }))}
			{...props}
		/>
	);
};

// MARK: exports

export type { DatePickerProps, DateRangePickerProps };
export { DatePicker, DateRangePicker };
