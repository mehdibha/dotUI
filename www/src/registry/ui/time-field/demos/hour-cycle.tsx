"use client";

import { Label } from "@/registry/ui/field";
import { DateInput } from "@/registry/ui/input";
import { TimeField } from "@/registry/ui/time-field";

export default function Demo() {
	return (
		<TimeField>
			<Label>Appointment time</Label>
			<DateInput />
		</TimeField>
	);
}
