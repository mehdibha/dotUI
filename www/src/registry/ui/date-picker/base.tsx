"use client";

import {
	DateRangePicker as AriaDateRangePicker,
	DatePicker as AriaDatePicker,
	composeRenderProps,
} from "react-aria-components";
import type {
	DateRangePickerProps as AriaDateRangePickerProps,
	DatePickerProps as AriaDatePickerProps,
	DateValue,
} from "react-aria-components";

import { useStyles } from "./styles";

// MARK: DatePicker

interface DatePickerProps<T extends DateValue> extends AriaDatePickerProps<T> {}

const DatePicker = <T extends DateValue>({ className, ...props }: DatePickerProps<T>) => {
	const datePickerStyles = useStyles();
	return (
		<AriaDatePicker
			className={composeRenderProps(className, (className) => datePickerStyles({ className }))}
			{...props}
		/>
	);
};

// MARK: DateRangePicker

interface DateRangePickerProps<T extends DateValue> extends AriaDateRangePickerProps<T> {}

const DateRangePicker = <T extends DateValue>({ className, ...props }: DateRangePickerProps<T>) => {
	const datePickerStyles = useStyles();
	return (
		<AriaDateRangePicker
			className={composeRenderProps(className, (className) => datePickerStyles({ className }))}
			{...props}
		/>
	);
};

// MARK: exports

export type { DatePickerProps, DateRangePickerProps };
export { DatePicker, DateRangePicker };
