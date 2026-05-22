"use client";

import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox";
import { Label } from "@/registry/ui/field";

export default function Demo() {
	return (
		<Checkbox isInvalid>
			<CheckboxControl />
			<Label>Accept terms and conditions</Label>
		</Checkbox>
	);
}
