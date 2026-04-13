import { CalendarGrid, CalendarHeader, RangeCalendar } from "@/registry/ui/calendar";

export default function Demo() {
	return (
		<RangeCalendar aria-label="Trip dates">
			<CalendarHeader />
			<div className="flex gap-2">
				<CalendarGrid />
				<CalendarGrid offset={{ months: 1 }} />
			</div>
		</RangeCalendar>
	);
}
