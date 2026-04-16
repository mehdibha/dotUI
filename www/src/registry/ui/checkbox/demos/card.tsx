import { Checkbox, CheckboxControl, CheckboxIndicator } from "@/registry/ui/checkbox";
import { Description, Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<Checkbox>
			<CheckboxControl className="flex w-52 cursor-pointer items-start gap-3 rounded-lg border border-border p-4 selected:border-primary selected:bg-primary/5">
				<CheckboxIndicator className="mt-0.5" />
				<div className="flex flex-col gap-1">
					<Label>I agree to the terms and conditions</Label>
					<Description>Please read the terms before proceeding</Description>
				</div>
			</CheckboxControl>
		</Checkbox>
	);
}
