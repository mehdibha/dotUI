import { Checkbox } from "@/registry/ui/checkbox";
import { CheckboxGroup } from "@/registry/ui/checkbox-group";
import { Description, FieldGroup, Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<CheckboxGroup defaultValue={["nextjs"]}>
			<Label>React frameworks</Label>
			<Description>You can pick any frameworks.</Description>
			<FieldGroup>
				<Checkbox value="nextjs">Next.js</Checkbox>
				<Checkbox value="remix">Remix</Checkbox>
				<Checkbox value="gatsby">Gatsby</Checkbox>
			</FieldGroup>
		</CheckboxGroup>
	);
}
