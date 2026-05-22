import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { NumberField, NumberFieldDecrement, NumberFieldIncrement } from "@/registry/ui/number-field";

export default function Demo() {
	return (
		<NumberField aria-label="Width" defaultValue={1024}>
			<InputGroup>
				<Input />
				<InputGroupAddon>
					<NumberFieldDecrement />
					<NumberFieldIncrement />
				</InputGroupAddon>
			</InputGroup>
		</NumberField>
	);
}
