"use client";

import { parseZonedDateTime } from "@internationalized/date";

import { Calendar } from "@/registry/ui/calendar";
import { DatePicker, DatePickerContent, DatePickerInput } from "@/registry/ui/date-picker";
import { Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<DatePicker
			granularity="minute"
			defaultValue={parseZonedDateTime("2022-11-07T10:45[America/Los_Angeles]")}
			hideTimeZone
		>
			<Label>Appointment time</Label>
			<DatePickerInput />
			<DatePickerContent>
				<Calendar />
			</DatePickerContent>
		</DatePicker>
	);
}
