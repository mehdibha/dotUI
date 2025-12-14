import { Checkbox, CheckboxIndicator } from "@dotui/registry/ui/checkbox";
import { Label } from "@dotui/registry/ui/field";

export default function Page() {
	return (
		<Checkbox>
			<CheckboxIndicator />
			<Label>Accept terms and conditions</Label>
		</Checkbox>
	);
}
