import { Label } from "@/registry/ui/field";
import { Group } from "@/registry/ui/group";
import { Input } from "@/registry/ui/input";
import { NumberField, NumberFieldDecrement, NumberFieldIncrement } from "@/registry/ui/number-field";

interface NumberFieldPlaygroundProps {
	label?: string;
	isDisabled?: boolean;
	isReadOnly?: boolean;
	isInvalid?: boolean;
}

export function NumberFieldPlayground({ label = "Quantity", ...props }: NumberFieldPlaygroundProps) {
	return (
		<NumberField defaultValue={1} {...props}>
			{label && <Label>{label}</Label>}
			<Group>
				<NumberFieldDecrement />
				<Input />
				<NumberFieldIncrement />
			</Group>
		</NumberField>
	);
}
