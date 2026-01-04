import { Calendar, CalendarGrid, CalendarHeader } from "@dotui/registry/ui/calendar";

export default function Demo() {
	return (
		<Calendar aria-label="Appointment date" pageBehavior="single">
			<CalendarHeader />
			<div className="flex gap-2">
				<CalendarGrid />
				<CalendarGrid offset={{ months: 1 }} />
			</div>
		</Calendar>
	);
}
