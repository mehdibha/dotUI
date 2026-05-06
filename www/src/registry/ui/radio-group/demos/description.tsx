import { Description, FieldGroup, Label } from "@/registry/ui/field";
import { Radio, RadioControl, RadioGroup } from "@/registry/ui/radio-group";

export default function Demo() {
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
			<Description>Select a product size.</Description>
		</RadioGroup>
	);
}
