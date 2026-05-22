"use client";

import { getLocalTimeZone, today } from "@internationalized/date";

import { Calendar, CalendarGrid, CalendarHeader } from "@/registry/ui/calendar";

export default function Demo() {
	return (
		<Calendar aria-label="Date" defaultValue={today(getLocalTimeZone())}>
			<CalendarHeader />
			<CalendarGrid weekdayStyle="short" />
		</Calendar>
	);
}
