"use client";

import { CalendarGrid, CalendarHeader, RangeCalendar } from "@/registry/ui/calendar";

export default function Demo() {
	return (
		<RangeCalendar aria-label="Trip dates" visibleDuration={{ months: 2 }}>
			<CalendarHeader />
			<div className="flex items-start gap-4">
				{Array.from({ length: 2 }).map((_, index) => (
					<CalendarGrid key={index} offset={{ months: index }} />
				))}
			</div>
		</RangeCalendar>
	);
}
