"use client";

import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox";
import { Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<Checkbox isIndeterminate>
			<CheckboxControl />
			<Label>Select all</Label>
		</Checkbox>
	);
}
