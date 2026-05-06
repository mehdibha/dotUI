import { FieldGroup, Label } from "@/registry/ui/field";
import { Radio, RadioControl, RadioGroup } from "@/registry/ui/radio-group";

export default function Demo() {
	return (
		<div className="flex gap-10">
			<RadioGroup defaultValue="sm" isDisabled>
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

			<RadioGroup defaultValue="sm">
				<Label>Size</Label>
				<FieldGroup>
					<Radio value="sm">
						<RadioControl />
						<Label>Small</Label>
					</Radio>
					<Radio value="md" isDisabled>
						<RadioControl />
						<Label>Medium</Label>
					</Radio>
					<Radio value="lg">
						<RadioControl />
						<Label>Large</Label>
					</Radio>
				</FieldGroup>
			</RadioGroup>
		</div>
	);
}
