import { Checkbox } from "@dotui/registry/ui/checkbox";
import { CheckboxGroup } from "@dotui/registry/ui/checkbox-group";
import { FieldError, FieldGroup, Label } from "@dotui/registry/ui/field";

export default function Demo() {
	return (
		<CheckboxGroup isInvalid>
			<Label>React frameworks</Label>
			<FieldGroup>
				<Checkbox value="nextjs">Next.js</Checkbox>
				<Checkbox value="remix">Remix</Checkbox>
				<Checkbox value="gatsby">Gatsby</Checkbox>
			</FieldGroup>
			<FieldError>Please select a framework.</FieldError>
		</CheckboxGroup>
	);
}
