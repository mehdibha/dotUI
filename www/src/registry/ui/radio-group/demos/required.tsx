import { FieldGroup, Label } from "@/registry/ui/field";
import { Radio, RadioControl, RadioGroup } from "@/registry/ui/radio-group";

export default function Demo() {
	return (
		<RadioGroup defaultValue="sm" isRequired>
			<Label>Size</Label>
			<FieldGroup>
				<Radio value="sm">
					<RadioControl />
					<Label>Small</Label>
				</Radio>
				<Radio value="lg">
					<RadioControl />
					<Label>Large</Label>
				</Radio>
			</FieldGroup>
		</RadioGroup>
	);
}
