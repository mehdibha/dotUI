import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox";
import { Label } from "@/registry/ui/field";

export function CheckboxDemo() {
	return (
		<Checkbox>
			<CheckboxControl />
			<Label>Accept terms and conditions</Label>
		</Checkbox>
	);
}
