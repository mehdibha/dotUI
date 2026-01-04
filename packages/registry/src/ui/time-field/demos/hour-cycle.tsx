"use client";

import { Label } from "@dotui/registry/ui/field";
import { DateInput } from "@dotui/registry/ui/input";
import { TimeField } from "@dotui/registry/ui/time-field";

export default function Demo() {
	return (
		<TimeField>
			<Label>Appointment time</Label>
			<DateInput />
		</TimeField>
	);
}
