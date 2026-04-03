import { Checkbox, CheckboxIndicator } from "@/registry/ui/checkbox";
import { CheckboxGroup } from "@/registry/ui/checkbox-group";
import { FieldGroup, Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<CheckboxGroup defaultValue={["nextjs"]} isRequired>
			<Label>React frameworks</Label>
			<FieldGroup>
				<Checkbox value="nextjs">
					<CheckboxIndicator />
					<Label>Next.js</Label>
				</Checkbox>
				<Checkbox value="remix">
					<CheckboxIndicator />
					<Label>Remix</Label>
				</Checkbox>
				<Checkbox value="gatsby">
					<CheckboxIndicator />
					<Label>Gatsby</Label>
				</Checkbox>
			</FieldGroup>
		</CheckboxGroup>
	);
}
