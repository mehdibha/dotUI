import { Checkbox, CheckboxControl, CheckboxIndicator } from "@/registry/ui/checkbox";
import { CheckboxGroup } from "@/registry/ui/checkbox-group";
import { Description, FieldContent, FieldGroup, Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<CheckboxGroup defaultValue={["nextjs"]} className="w-full max-w-xs">
			<Label>React frameworks</Label>
			<FieldGroup>
				<Checkbox value="nextjs">
					<CheckboxControl>
						<CheckboxIndicator />
						<FieldContent>
							<Label>Next.js</Label>
							<Description>The React framework for the web</Description>
						</FieldContent>
					</CheckboxControl>
				</Checkbox>
				<Checkbox value="remix">
					<CheckboxControl>
						<CheckboxIndicator />
						<FieldContent>
							<Label>Remix</Label>
							<Description>Full stack web framework</Description>
						</FieldContent>
					</CheckboxControl>
				</Checkbox>
				<Checkbox value="gatsby">
					<CheckboxControl>
						<CheckboxIndicator />
						<FieldContent>
							<Label>Gatsby</Label>
							<Description>Build fast, modern websites</Description>
						</FieldContent>
					</CheckboxControl>
				</Checkbox>
			</FieldGroup>
		</CheckboxGroup>
	);
}
