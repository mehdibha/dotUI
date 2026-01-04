"use client";

import { parseDate } from "@internationalized/date";

import { Calendar } from "@dotui/registry/ui/calendar";
import { DatePicker, DatePickerContent, DatePickerInput } from "@dotui/registry/ui/date-picker";

export default function Demo() {
	return (
		<DatePicker aria-label="Meeting date" defaultValue={parseDate("2020-02-03")}>
			<DatePickerInput />
			<DatePickerContent>
				<Calendar />
			</DatePickerContent>
		</DatePicker>
	);
}
