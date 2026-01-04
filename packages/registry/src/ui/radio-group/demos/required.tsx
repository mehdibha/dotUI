import { FieldGroup, Label } from "@dotui/registry/ui/field";
import { Radio, RadioGroup, RadioIndicator } from "@dotui/registry/ui/radio-group";

export default function Demo() {
	return (
		<RadioGroup defaultValue="sm" isRequired>
			<Label>Size</Label>
			<FieldGroup>
				<Radio value="sm">
					<RadioIndicator />
					<Label>Small</Label>
				</Radio>
				<Radio value="lg">
					<RadioIndicator />
					<Label>Large</Label>
				</Radio>
			</FieldGroup>
		</RadioGroup>
	);
}
