"use client";

import type { DateValue } from "react-aria";

import { createDynamicComponent } from "@dotui/core/components/create-dynamic-component";

import * as Default from "./basic";
import type { DatePickerContentProps, DatePickerInputProps, DatePickerProps } from "./types";

export const DatePicker = <T extends DateValue>(props: DatePickerProps<T>) => {
	const Component = createDynamicComponent<DatePickerProps<T>>("date-picker", "DatePicker", Default.DatePicker, {});

	return <Component {...props} />;
};

export const DatePickerContent = createDynamicComponent<DatePickerContentProps>(
	"date-picker",
	"DatePickerContent",
	Default.DatePickerContent,
	{},
);

export const DatePickerInput = createDynamicComponent<DatePickerInputProps>(
	"date-picker",
	"DatePickerInput",
	Default.DatePickerInput,
	{},
);

export type { DatePickerProps, DatePickerContentProps, DatePickerInputProps };
