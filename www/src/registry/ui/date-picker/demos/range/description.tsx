"use client";

import { Calendar } from "@/registry/ui/calendar";
import { DatePicker, DatePickerContent, DatePickerInput } from "@/registry/ui/date-picker";
import { Description, Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<DatePicker mode="range">
			<Label>Appointment</Label>
			<DatePickerInput />
			<Description>Please select a date.</Description>
			<DatePickerContent>
				<Calendar />
			</DatePickerContent>
		</DatePicker>
	);
}
