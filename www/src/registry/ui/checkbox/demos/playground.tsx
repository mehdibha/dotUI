"use client";

import { Checkbox, CheckboxIndicator } from "@/registry/ui/checkbox";
import { Label } from "@/registry/ui/field";

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
