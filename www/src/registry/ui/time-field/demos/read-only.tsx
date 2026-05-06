"use client";

import { Time } from "@internationalized/date";

import { DateInput } from "@/registry/ui/input";
import { TimeField } from "@/registry/ui/time-field";

export default function Demo() {
	return (
		<TimeField aria-label="Event time" value={new Time(11)} isReadOnly>
			<DateInput />
		</TimeField>
	);
}
