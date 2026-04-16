import { Checkbox, CheckboxControl, CheckboxIndicator } from "@/registry/ui/checkbox";
import { Description, FieldContent, Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<Checkbox className="w-full">
			<CheckboxControl>
				<CheckboxIndicator />
				<FieldContent>
					<Label>I agree to the terms and conditions</Label>
					<Description>Please read the terms before proceeding</Description>
				</FieldContent>
			</CheckboxControl>
		</Checkbox>
	);
}
