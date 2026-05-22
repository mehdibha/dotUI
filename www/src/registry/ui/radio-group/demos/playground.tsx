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

export function RadioGroupPlayground({ label = "Select frameworks", ...props }: RadioGroupPlaygroundProps) {
	return (
		<RadioGroup defaultValue="react" {...props}>
			{label && <Label>{label}</Label>}
			<FieldGroup>
				<Radio value="react">
					<RadioControl />
					<Label>React</Label>
				</Radio>
				<Radio value="vue">
					<RadioControl />
					<Label>Vue</Label>
				</Radio>
				<Radio value="angular">
					<RadioControl />
					<Label>Angular</Label>
				</Radio>
			</FieldGroup>
		</RadioGroup>
	);
}
