import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox";
import { CheckboxGroup } from "@/registry/ui/checkbox-group";
import { Description, FieldGroup, Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<CheckboxGroup defaultValue={["nextjs"]}>
			<Label>React frameworks</Label>
			<Description>You can pick any frameworks.</Description>
			<FieldGroup>
				<Checkbox value="nextjs">
					<CheckboxControl />
					<Label>Next.js</Label>
				</Checkbox>
				<Checkbox value="remix">
					<CheckboxControl />
					<Label>Remix</Label>
				</Checkbox>
				<Checkbox value="gatsby">
					<CheckboxControl />
					<Label>Gatsby</Label>
				</Checkbox>
			</FieldGroup>
		</CheckboxGroup>
	);
}
