import { DateField } from "@dotui/registry/ui/date-field";
import { Label } from "@dotui/registry/ui/field";
import { DateInput } from "@dotui/registry/ui/input";

export default function Demo() {
	return (
		<div className="flex items-center gap-4">
			<DateField>
				<Label>small (sm)</Label>
				<DateInput size="sm" />
			</DateField>
			<DateField>
				<Label>medium (md)</Label>
				<DateInput />
			</DateField>
			<DateField>
				<Label>large (lg)</Label>
				<DateInput />
			</DateField>
		</div>
	);
}
