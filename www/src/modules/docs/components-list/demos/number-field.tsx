import { Button } from "@/registry/ui/button";
import { Label } from "@/registry/ui/field";
import { Group } from "@/registry/ui/group";
import { Input } from "@/registry/ui/input";
import { NumberField } from "@/registry/ui/number-field";

export function NumberFieldDemo() {
	return (
		<NumberField defaultValue={10}>
			<Label>Quantity</Label>
			<Group>
				<Input className="w-16" />
				<Button slot="decrement" />
				<Button slot="increment" />
			</Group>
		</NumberField>
	);
}
