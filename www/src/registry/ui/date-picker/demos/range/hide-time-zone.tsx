"use client";

import { parseAbsoluteToLocal } from "@internationalized/date";

import { Calendar } from "@/registry/ui/calendar";
import { DatePicker, DatePickerContent, DatePickerInput } from "@/registry/ui/date-picker";
import { Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<DatePicker
			mode="range"
			granularity="minute"
			defaultValue={{
				start: parseAbsoluteToLocal("2021-04-07T18:45:22Z"),
				end: parseAbsoluteToLocal("2021-04-08T20:00:00Z"),
			}}
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
