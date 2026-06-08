import { Label } from "@/registry/ui/field";
import { Group } from "@/registry/ui/group";
import { Input } from "@/registry/ui/input";
import { NumberField, NumberFieldDecrement, NumberFieldIncrement } from "@/registry/ui/number-field";

export function NumberFieldDemo() {
	return (
		<NumberField defaultValue={10}>
			<Label>Quantity</Label>
			<Group>
				<NumberFieldDecrement />
				<Input className="w-16" />
				<NumberFieldIncrement />
			</Group>
		</NumberField>
	);
}
