import { DateField } from "@dotui/registry/ui/date-field";
import { FieldError, Label } from "@dotui/registry/ui/field";
import { DateInput } from "@dotui/registry/ui/input";

export default function Demo() {
	return (
		<DateField isInvalid>
			<Label>Event date</Label>
			<DateInput />
			<FieldError>Please select a date.</FieldError>
		</DateField>
	);
}
