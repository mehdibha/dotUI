import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";
import CalendarDemo from "@/registry/ui/calendar/demos/single";

export default function CalendarGroupExamples() {
	return (
		<Examples>
			<Example title="Calendar">
				<CalendarDemo />
			</Example>
		</Examples>
	);
}
