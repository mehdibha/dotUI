"use client";

import { FieldGroup, Label } from "@/registry/ui/field";
import { Radio, RadioControl, RadioGroup } from "@/registry/ui/radio-group";

interface RadioGroupPlaygroundProps {
	label?: string;
	isDisabled?: boolean;
	isReadOnly?: boolean;
	isInvalid?: boolean;
	orientation?: "horizontal" | "vertical";
}

export function RadioGroupPlayground({ label = "Select size", ...props }: RadioGroupPlaygroundProps) {
	return (
		<RadioGroup defaultValue="md" {...props}>
			{label && <Label>{label}</Label>}
			<FieldGroup>
				<Radio value="sm">
					<RadioControl />
					<Label>Small</Label>
				</Radio>
				<Radio value="md">
					<RadioControl />
					<Label>Medium</Label>
				</Radio>
				<Radio value="lg">
					<RadioControl />
					<Label>Large</Label>
				</Radio>
			</FieldGroup>
		</RadioGroup>
	);
}
