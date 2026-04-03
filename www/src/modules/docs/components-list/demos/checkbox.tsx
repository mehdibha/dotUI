import { Checkbox, CheckboxIndicator } from "@/registry/ui/checkbox";
import { Label } from "@/registry/ui/field";

export function CheckboxDemo() {
	return (
		<Checkbox>
			<CheckboxIndicator />
			<Label>Accept terms and conditions</Label>
		</Checkbox>
	);
}
