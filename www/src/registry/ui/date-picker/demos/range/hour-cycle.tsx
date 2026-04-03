"use client";

import { Calendar } from "@/registry/ui/calendar";
import { DatePicker, DatePickerContent, DatePickerInput } from "@/registry/ui/date-picker";
import { Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<DatePicker mode="range" aria-label="Appointment date" granularity="minute" hourCycle={24}>
			<Label>Appointment date</Label>
			<DatePickerInput />
			<DatePickerContent>
				<Calendar />
			</DatePickerContent>
		</DatePicker>
	);
}
