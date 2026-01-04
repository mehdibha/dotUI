"use client";

import { Checkbox, CheckboxIndicator } from "@dotui/registry/ui/checkbox";
import { Label } from "@dotui/registry/ui/field";

interface CheckboxPlaygroundProps {
	label?: string;
	isDisabled?: boolean;
	isReadOnly?: boolean;
	isInvalid?: boolean;
	isIndeterminate?: boolean;
}

export function CheckboxPlayground({ label = "Accept terms", ...props }: CheckboxPlaygroundProps) {
	return (
		<Checkbox {...props}>
			<CheckboxIndicator />
			<Label>{label}</Label>
		</Checkbox>
	);
}
