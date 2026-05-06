"use client";

import { Time } from "@internationalized/date";

import { Label } from "@/registry/ui/field";
import { DateInput } from "@/registry/ui/input";
import { TimeField } from "@/registry/ui/time-field";

export default function Demo() {
	return (
		<TimeField placeholderValue={new Time(9)}>
			<Label>Event time</Label>
			<DateInput />
		</TimeField>
	);
}
