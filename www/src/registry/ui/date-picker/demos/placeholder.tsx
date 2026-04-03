"use client";

import { CalendarDate } from "@internationalized/date";

import { Calendar } from "@/registry/ui/calendar";
import { DatePicker, DatePickerContent, DatePickerInput } from "@/registry/ui/date-picker";
import { Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<DatePicker placeholderValue={new CalendarDate(1980, 1, 1)}>
			<Label>Meeting date</Label>
			<DatePickerInput />
			<DatePickerContent>
				<Calendar />
			</DatePickerContent>
		</DatePicker>
	);
}
