import { Group } from "@/registry/ui/group";
import { Input } from "@/registry/ui/input";
import { NumberField, NumberFieldDecrement, NumberFieldIncrement } from "@/registry/ui/number-field";

export default function Demo() {
	return (
		<NumberField aria-label="Width" defaultValue={1024}>
			<Group>
				<NumberFieldDecrement />
				<Input />
				<NumberFieldIncrement />
			</Group>
		</NumberField>
	);
}
