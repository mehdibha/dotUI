import { Checkbox, CheckboxIndicator } from "@/registry/ui/checkbox";
import { CheckboxGroup } from "@/registry/ui/checkbox-group";
import { FieldGroup, Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<div className="flex items-center gap-10">
			<CheckboxGroup defaultValue={["nextjs"]}>
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
				</FieldGroup>
			</CheckboxGroup>
		</div>
	);
}
