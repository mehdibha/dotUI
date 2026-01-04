import { DateField } from "@dotui/registry/ui/date-field";
import { Label } from "@dotui/registry/ui/field";
import { DateInput } from "@dotui/registry/ui/input";

export default function Demo() {
	return (
		<DateField isDisabled>
			<Label>Event date</Label>
			<DateInput />
		</DateField>
	);
}
