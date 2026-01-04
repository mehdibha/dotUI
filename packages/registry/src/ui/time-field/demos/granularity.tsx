"use client";

import { parseAbsoluteToLocal } from "@internationalized/date";

import { DateInput } from "@dotui/registry/ui/input";
import { TimeField } from "@dotui/registry/ui/time-field";

export default function Demo() {
	return (
		<TimeField
			aria-label="Event time"
			granularity="second"
			defaultValue={parseAbsoluteToLocal("2021-04-07T18:45:22Z")}
			className="w-40"
		>
			<DateInput />
		</TimeField>
	);
}
