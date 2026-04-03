import { Button } from "@/registry/ui/button";
import { Description, Label } from "@/registry/ui/field";
import { Group } from "@/registry/ui/group";
import { Input } from "@/registry/ui/input";
import { NumberField } from "@/registry/ui/number-field";

export default function Demo() {
	return (
		<NumberField defaultValue={1024}>
			<Label>Width</Label>
			<Group>
				<Button slot="decrement" />
				<Input />
				<Button slot="increment" />
			</Group>
			<Description>Enter the desired width.</Description>
		</NumberField>
	);
}
