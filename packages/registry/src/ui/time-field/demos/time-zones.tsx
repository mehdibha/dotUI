"use client";

import { parseAbsoluteToLocal } from "@internationalized/date";

import { DateInput } from "@dotui/registry/ui/input";
import { TimeField } from "@dotui/registry/ui/time-field";

export default function Demo() {
	return (
		<TimeField aria-label="Event time" defaultValue={parseAbsoluteToLocal("2021-11-07T07:45:00Z")}>
			<DateInput />
		</TimeField>
	);
}
