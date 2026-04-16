import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox";
import { CheckboxGroup } from "@/registry/ui/checkbox-group";
import { FieldGroup, Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<div className="flex items-start gap-10">
			<CheckboxGroup defaultValue={["nextjs"]}>
				<Label>React frameworks</Label>
				<FieldGroup>
					<Checkbox value="nextjs">
						<CheckboxControl />
						<Label>Next.js</Label>
					</Checkbox>
					<Checkbox value="remix">
						<CheckboxControl />
						<Label>Remix</Label>
					</Checkbox>
				</FieldGroup>
			</CheckboxGroup>
			<CheckboxGroup defaultValue={["nextjs"]} aria-label="React frameworks">
				<FieldGroup>
					<Checkbox value="nextjs">
						<CheckboxControl />
						<Label>Next.js</Label>
					</Checkbox>
					<Checkbox value="remix">
						<CheckboxControl />
						<Label>Remix</Label>
					</Checkbox>
				</FieldGroup>
			</CheckboxGroup>
		</div>
	);
}
