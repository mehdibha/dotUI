"use client";

import { CalendarDate } from "@internationalized/date";

import { DateField } from "@dotui/registry/ui/date-field";
import { DateInput } from "@dotui/registry/ui/input";

export default function Demo() {
	return (
		<DateField aria-label="Event date" value={new CalendarDate(1980, 1, 1)} isReadOnly>
			<DateInput />
		</DateField>
	);
}
