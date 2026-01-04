"use client";

import { Calendar } from "@dotui/registry/ui/calendar";
import { DatePicker, DatePickerContent, DatePickerInput } from "@dotui/registry/ui/date-picker";
import { Description, Label } from "@dotui/registry/ui/field";

export default function Demo() {
	return (
		<DatePicker>
			<Label>Appointment</Label>
			<DatePickerInput />
			<Description>Please select a date.</Description>
			<DatePickerContent>
				<Calendar />
			</DatePickerContent>
		</DatePicker>
	);
}
