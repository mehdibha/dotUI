"use client";

import { DateField } from "@dotui/registry/ui/date-field";
import { Description, Label } from "@dotui/registry/ui/field";
import { DateInput } from "@dotui/registry/ui/input";

export default function Demo() {
	return (
		<DateField aria-label="Appointment date">
			<Label>Appointment date</Label>
			<DateInput />
			<Description>Please select a date.</Description>
		</DateField>
	);
}
