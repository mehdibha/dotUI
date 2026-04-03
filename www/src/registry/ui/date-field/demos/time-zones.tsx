"use client";

import { parseZonedDateTime } from "@internationalized/date";

import { DateField } from "@/registry/ui/date-field";
import { DateInput } from "@/registry/ui/input";

export default function Demo() {
	return (
		<DateField
			aria-label="Meeting time"
			defaultValue={parseZonedDateTime("2022-11-07T00:45[America/Los_Angeles]")}
			className="w-auto"
		>
			<DateInput />
		</DateField>
	);
}
