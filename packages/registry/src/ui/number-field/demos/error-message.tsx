import { Button } from "@dotui/registry/ui/button";
import { FieldError, Label } from "@dotui/registry/ui/field";
import { Group } from "@dotui/registry/ui/group";
import { Input } from "@dotui/registry/ui/input";
import { NumberField } from "@dotui/registry/ui/number-field";

export default function Demo() {
	return (
		<NumberField defaultValue={1024} isInvalid>
			<Label>Width</Label>
			<Group>
				<Button slot="decrement" />
				<Input />
				<Button slot="increment" />
			</Group>
			<FieldError>Please fill out this field.</FieldError>
		</NumberField>
	);
}
