"use client";

import { Calendar } from "@dotui/registry/ui/calendar";
import { DatePicker, DatePickerContent, DatePickerInput } from "@dotui/registry/ui/date-picker";
import { Label } from "@dotui/registry/ui/field";

interface DateRangePickerPlaygroundProps {
	label?: string;
	isDisabled?: boolean;
	isReadOnly?: boolean;
}

export function DateRangePickerPlayground({
	label = "Date range",
	isDisabled = false,
	isReadOnly = false,
}: DateRangePickerPlaygroundProps) {
	return (
		<DatePicker mode="range" isDisabled={isDisabled} isReadOnly={isReadOnly}>
			{label && <Label>{label}</Label>}
			<DatePickerInput />
			<DatePickerContent>
				<Calendar mode="range" />
			</DatePickerContent>
		</DatePicker>
	);
}
