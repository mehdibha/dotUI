"use client";

import { parseDate } from "@internationalized/date";

import { Calendar } from "@dotui/registry/ui/calendar";
import { DatePicker, DatePickerContent, DatePickerInput } from "@dotui/registry/ui/date-picker";

export default function Demo() {
	return (
		<DatePicker
			mode="range"
			aria-label="Meeting date"
			defaultValue={{
				start: parseDate("2020-02-03"),
				end: parseDate("2020-02-12"),
			}}
		>
			<DatePickerInput />
			<DatePickerContent>
				<Calendar />
			</DatePickerContent>
		</DatePicker>
	);
}
