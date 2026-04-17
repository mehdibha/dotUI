"use client";

import React from "react";
import { parseDate } from "@internationalized/date";
import type * as CalendarPrimitives from "react-aria-components/Calendar";

import { DateField } from "@/registry/ui/date-field";
import { DateInput } from "@/registry/ui/input";

export default function Demo() {
	const [value, setValue] = React.useState<CalendarPrimitives.DateValue | null>(parseDate("2020-02-03"));

	return (
		<div className="flex flex-col items-center gap-4">
			<DateField aria-label="Event date" value={value} onChange={setValue}>
				<DateInput />
			</DateField>
			<p className="text-fg-muted text-sm">selected date: {value ? value.toString() : "none"}</p>
		</div>
	);
}
