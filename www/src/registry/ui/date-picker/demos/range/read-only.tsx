"use client";

import { parseAbsoluteToLocal } from "@internationalized/date";

import { Calendar } from "@/registry/ui/calendar";
import { DatePicker, DatePickerContent, DatePickerInput } from "@/registry/ui/date-picker";
import { Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<DatePicker
			mode="range"
			value={{
				start: parseAbsoluteToLocal("2021-04-07T18:45:22Z"),
				end: parseAbsoluteToLocal("2021-04-08T20:00:00Z"),
			}}
			isReadOnly
		>
			<Label>Event date</Label>
			<DatePickerInput />
			<DatePickerContent>
				<Calendar />
			</DatePickerContent>
		</DatePicker>
	);
}
