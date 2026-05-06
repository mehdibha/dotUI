import { FieldError, FieldGroup, Label } from "@/registry/ui/field";
import { Radio, RadioControl, RadioGroup } from "@/registry/ui/radio-group";

export default function Demo() {
	return (
		<RadioGroup defaultValue={null} isInvalid>
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
			<FieldError>Please select a product size.</FieldError>
		</RadioGroup>
	);
}
