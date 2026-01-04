import { Label } from "@dotui/registry/ui/field";
import { DateInput } from "@dotui/registry/ui/input";
import { TimeField } from "@dotui/registry/ui/time-field";

export default function Demo() {
	return (
		<div className="flex items-center gap-4">
			<TimeField>
				<Label>small (sm)</Label>
				<DateInput size="sm" />
			</TimeField>
			<TimeField>
				<Label>medium (md)</Label>
				<DateInput size="md" />
			</TimeField>
			<TimeField>
				<Label>large (lg)</Label>
				<DateInput size="lg" />
			</TimeField>
		</div>
	);
}
