import { Label } from "@dotui/registry/ui/field";
import { DateInput } from "@dotui/registry/ui/input";
import { TimeField } from "@dotui/registry/ui/time-field";

export function TimeFieldDemo() {
	return (
		<TimeField>
			<Label>Event time</Label>
			<DateInput className="w-40" />
		</TimeField>
	);
}
