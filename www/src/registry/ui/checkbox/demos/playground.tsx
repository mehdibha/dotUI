"use client";

import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox";
import { Label } from "@/registry/ui/field";

export default function Demo({
	label = "Accept terms",
	isDisabled = false,
	isReadOnly = false,
	isInvalid = false,
	isIndeterminate = false,
} = {}) {
	return (
		<Checkbox isDisabled={isDisabled} isReadOnly={isReadOnly} isInvalid={isInvalid} isIndeterminate={isIndeterminate}>
			<CheckboxControl />
			{label && <Label>{label}</Label>}
		</Checkbox>
	);
}
