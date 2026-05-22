import { FieldError, Label } from "@/registry/ui/field";
import { Group } from "@/registry/ui/group";
import { Input } from "@/registry/ui/input";
import { NumberField, NumberFieldDecrement, NumberFieldIncrement } from "@/registry/ui/number-field";

export default function Demo() {
	return (
		<NumberField defaultValue={1024} isInvalid>
			<Label>Width</Label>
			<Group>
				<NumberFieldDecrement />
				<Input />
				<NumberFieldIncrement />
			</Group>
			<FieldError>Please fill out this field.</FieldError>
		</NumberField>
	);
}
