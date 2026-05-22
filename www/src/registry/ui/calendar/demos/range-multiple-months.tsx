"use client";

import { CalendarGrid, CalendarHeader, RangeCalendar } from "@/registry/ui/calendar";

export default function Demo() {
	return (
		<RangeCalendar aria-label="Trip dates" visibleDuration={{ months: 2 }}>
			<CalendarHeader />
			<div className="flex items-start gap-4">
				{[0, 1].map((monthOffset) => (
					<CalendarGrid key={`month-${monthOffset}`} offset={{ months: monthOffset }} />
				))}
			</div>
		</RangeCalendar>
	);
}
