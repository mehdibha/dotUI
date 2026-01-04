import { DateField } from "@dotui/registry/ui/date-field";
import { Label } from "@dotui/registry/ui/field";
import { DateInput } from "@dotui/registry/ui/input";

export default function Demo() {
	return (
		<div className="space-y-4">
			<DateField aria-label="Meeting date">
				<Label>Meeting date</Label>
				<DateInput />
			</DateField>
			<DateField aria-label="Meeting date" />
		</div>
	);
}
