import { DateField } from "@/registry/ui/date-field";
import { Label } from "@/registry/ui/field";
import { DateInput } from "@/registry/ui/input";

export function DateFieldDemo() {
	return (
		<DateField>
			<Label>Meeting date</Label>
			<DateInput className="w-40" />
		</DateField>
	);
}
