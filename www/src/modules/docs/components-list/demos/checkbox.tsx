import { Checkbox, CheckboxIndicator } from "@dotui/registry/ui/checkbox";
import { Label } from "@dotui/registry/ui/field";

export function CheckboxDemo() {
	return (
		<Checkbox>
			<CheckboxIndicator />
			<Label>Accept terms and conditions</Label>
		</Checkbox>
	);
}
