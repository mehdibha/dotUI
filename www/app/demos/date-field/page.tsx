import { DateField } from "@dotui/registry/ui/date-field";
import { Label } from "@dotui/registry/ui/field";
import { DateInput } from "@dotui/registry/ui/input";

export default function Page() {
	return (
		<DateField>
			<Label>Meeting date</Label>
			<DateInput className="w-40" />
		</DateField>
	);
}
