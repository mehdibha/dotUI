"use client";

import { Time } from "@internationalized/date";

import { Label } from "@/registry/ui/field";
import { DateInput } from "@/registry/ui/input";
import { TimeField } from "@/registry/ui/time-field";

export default function Demo() {
	return (
		<TimeField value={new Time(11)} isReadOnly>
			<Label>Event time</Label>
			<DateInput />
		</TimeField>
	);
}
