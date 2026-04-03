import { Button } from "@/registry/ui/button";
import { Group } from "@/registry/ui/group";
import { Input } from "@/registry/ui/input";
import { NumberField } from "@/registry/ui/number-field";

export default function Demo() {
	return (
		<NumberField aria-label="Width" isReadOnly value={69}>
			<Group>
				<Button slot="decrement" />
				<Input />
				<Button slot="increment" />
			</Group>
		</NumberField>
	);
}
