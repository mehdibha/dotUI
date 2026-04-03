"use client";

import { Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { NumberField } from "@/registry/ui/number-field";

interface NumberFieldPlaygroundProps {
	label?: string;
	isDisabled?: boolean;
	isReadOnly?: boolean;
	isInvalid?: boolean;
}

export function NumberFieldPlayground({ label = "Quantity", ...props }: NumberFieldPlaygroundProps) {
	return (
		<NumberField defaultValue={1} {...props}>
			{label && <Label>{label}</Label>}
			<Input />
		</NumberField>
	);
}
