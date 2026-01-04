import { Button } from "@dotui/registry/ui/button";
import { Label } from "@dotui/registry/ui/field";
import { Group } from "@dotui/registry/ui/group";
import { Input } from "@dotui/registry/ui/input";
import { NumberField } from "@dotui/registry/ui/number-field";

export default function Demo() {
	return (
		<div className="space-y-4">
			<NumberField defaultValue={1024}>
				<Label>Width</Label>
				<Group>
					<Button slot="decrement" />
					<Input placeholder="Visible label" />
					<Button slot="increment" />
				</Group>
			</NumberField>
			<NumberField defaultValue={1024} aria-label="Width">
				<Group>
					<Button slot="decrement" />
					<Input placeholder="Hidden label" />
					<Button slot="increment" />
				</Group>
			</NumberField>
		</div>
	);
}
