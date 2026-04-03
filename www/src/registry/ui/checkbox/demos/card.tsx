import { Checkbox, CheckboxIndicator } from "@/registry/ui/checkbox";
import { Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<Checkbox
		// appearance="card"
		>
			<CheckboxIndicator />
			<Label>I agree to the terms and conditions</Label>
		</Checkbox>
	);
}
