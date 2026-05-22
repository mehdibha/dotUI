import { DateField } from "@/registry/ui/date-field";
import { Label } from "@/registry/ui/field";
import { DateInput } from "@/registry/ui/input";

export default function Demo() {
	return (
		<DateField isDisabled>
			<Label>Event date</Label>
			<DateInput />
		</DateField>
	);
}
