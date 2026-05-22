import { Description, Label } from "@/registry/ui/field";
import { Group } from "@/registry/ui/group";
import { Input } from "@/registry/ui/input";
import { NumberField, NumberFieldDecrement, NumberFieldIncrement } from "@/registry/ui/number-field";

export default function Demo() {
	return (
		<NumberField defaultValue={1024}>
			<Label>Width</Label>
			<Group>
				<NumberFieldDecrement />
				<Input />
				<NumberFieldIncrement />
			</Group>
			<Description>Enter the desired width.</Description>
		</NumberField>
	);
}
