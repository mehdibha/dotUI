"use client";

import { parseDate } from "@internationalized/date";

import { Calendar } from "@dotui/registry/ui/calendar";

export default function Demo() {
	return (
		<Calendar
			mode="range"
			aria-label="Trip dates"
			isReadOnly
			value={{
				start: parseDate("2020-02-03"),
				end: parseDate("2020-02-12"),
			}}
		/>
	);
}
