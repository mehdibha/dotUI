import { FieldGroup, Label } from "@/registry/ui/field";
import { Radio, RadioControl, RadioGroup } from "@/registry/ui/radio-group";

export function RadioGroupDemo() {
	return (
		<RadioGroup defaultValue="sm">
			<Label>Size</Label>
			<FieldGroup>
				<Radio value="sm">
					<RadioControl />
					<Label>Small</Label>
				</Radio>
				<Radio value="md">
					<RadioControl />
					<Label>Medium</Label>
				</Radio>
				<Radio value="lg">
					<RadioControl />
					<Label>Large</Label>
				</Radio>
			</FieldGroup>
		</RadioGroup>
	);
}
