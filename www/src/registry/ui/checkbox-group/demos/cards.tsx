import { Checkbox, CheckboxControl, CheckboxIndicator } from "@/registry/ui/checkbox";
import { CheckboxGroup } from "@/registry/ui/checkbox-group";
import { Description, FieldGroup, Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<CheckboxGroup defaultValue={["nextjs"]}>
			<Label>React frameworks</Label>
			<FieldGroup>
				<Checkbox value="nextjs">
					<CheckboxControl className="flex w-52 cursor-pointer items-start gap-3 rounded-lg border border-border p-4 selected:border-primary selected:bg-primary/5">
						<CheckboxIndicator className="mt-0.5" />
						<div className="flex flex-col gap-1">
							<Label>Next.js</Label>
							<Description>The React framework for the web</Description>
						</div>
					</CheckboxControl>
				</Checkbox>
				<Checkbox value="remix">
					<CheckboxControl className="flex w-52 cursor-pointer items-start gap-3 rounded-lg border border-border p-4 selected:border-primary selected:bg-primary/5">
						<CheckboxIndicator className="mt-0.5" />
						<div className="flex flex-col gap-1">
							<Label>Remix</Label>
							<Description>Full stack web framework</Description>
						</div>
					</CheckboxControl>
				</Checkbox>
				<Checkbox value="gatsby">
					<CheckboxControl className="flex w-52 cursor-pointer items-start gap-3 rounded-lg border border-border p-4 selected:border-primary selected:bg-primary/5">
						<CheckboxIndicator className="mt-0.5" />
						<div className="flex flex-col gap-1">
							<Label>Gatsby</Label>
							<Description>Build fast, modern websites</Description>
						</div>
					</CheckboxControl>
				</Checkbox>
			</FieldGroup>
		</CheckboxGroup>
	);
}
