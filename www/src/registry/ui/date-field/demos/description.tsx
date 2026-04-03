"use client";

import { DateField } from "@/registry/ui/date-field";
import { Description, Label } from "@/registry/ui/field";
import { DateInput } from "@/registry/ui/input";

export default function Demo() {
	return (
		<DateField aria-label="Appointment date">
			<Label>Appointment date</Label>
			<DateInput />
			<Description>Please select a date.</Description>
		</DateField>
	);
}
