"use client";

import { Calendar } from "@dotui/registry/ui/calendar";
import { DatePicker, DatePickerContent, DatePickerInput } from "@dotui/registry/ui/date-picker";
import { Label } from "@dotui/registry/ui/field";

interface DatePickerPlaygroundProps {
	label?: string;
	isDisabled?: boolean;
	isReadOnly?: boolean;
}

export function DatePickerPlayground({
	label = "Date",
	isDisabled = false,
	isReadOnly = false,
}: DatePickerPlaygroundProps) {
	return (
		<DatePicker isDisabled={isDisabled} isReadOnly={isReadOnly}>
			{label && <Label>{label}</Label>}
			<DatePickerInput />
			<DatePickerContent>
				<Calendar />
			</DatePickerContent>
		</DatePicker>
	);
}
