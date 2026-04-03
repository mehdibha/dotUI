import { Checkbox, CheckboxIndicator } from "@/registry/ui/checkbox";
import { Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<Checkbox defaultSelected>
			<CheckboxIndicator />
			<Label>I accept the terms and conditions</Label>
		</Checkbox>
	);
}
