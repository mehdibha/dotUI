"use client";

import { Checkbox, CheckboxIndicator } from "@/registry/ui/checkbox";
import { Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<Checkbox isIndeterminate>
			<CheckboxIndicator />
			<Label>Select all</Label>
		</Checkbox>
	);
}
