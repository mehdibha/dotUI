import { DateField } from "@/registry/ui/date-field";
import { Label } from "@/registry/ui/field";
import { DateInput } from "@/registry/ui/input";

export default function Demo() {
	return (
		<>
			<DateField>
				<Label>small (sm)</Label>
				<DateInput />
			</DateField>
			<DateField>
				<Label>medium (md)</Label>
				<DateInput />
			</DateField>
			<DateField>
				<Label>large (lg)</Label>
				<DateInput />
			</DateField>
		</>
	);
}
