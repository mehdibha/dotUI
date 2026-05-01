"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as DatePickerPrimitive from "react-aria-components/DatePicker";
import * as DateRangePickerPrimitive from "react-aria-components/DateRangePicker";

import { useStyles } from "@/registry/ui/field/styles";

// MARK: DatePicker

interface DatePickerProps<T extends DatePickerPrimitive.DateValue> extends DatePickerPrimitive.DatePickerProps<T> {}

const DatePicker = <T extends DatePickerPrimitive.DateValue>({ className, ...props }: DatePickerProps<T>) => {
	const fieldStyles = useStyles();
	return (
		<DatePickerPrimitive.DatePicker
			className={composeRenderProps(className, (className) => fieldStyles().field({ className }))}
			{...props}
		/>
	);
};

// MARK: DateRangePicker

interface DateRangePickerProps<T extends DateRangePickerPrimitive.DateValue>
	extends DateRangePickerPrimitive.DateRangePickerProps<T> {}

const DateRangePicker = <T extends DateRangePickerPrimitive.DateValue>({
	className,
	...props
}: DateRangePickerProps<T>) => {
	const fieldStyles = useStyles();
	return (
		<DateRangePickerPrimitive.DateRangePicker
			className={composeRenderProps(className, (className) => fieldStyles().field({ className }))}
			{...props}
		/>
	);
};

// MARK: exports

export type { DatePickerProps, DateRangePickerProps };
export { DatePicker, DateRangePicker };
