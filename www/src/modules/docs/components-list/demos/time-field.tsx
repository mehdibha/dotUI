import { Label } from "@/registry/ui/field";
import { DateInput } from "@/registry/ui/input";
import { TimeField } from "@/registry/ui/time-field";

export function TimeFieldDemo() {
	return (
		<TimeField>
			<Label>Event time</Label>
			<DateInput className="w-40" />
		</TimeField>
	);
}
