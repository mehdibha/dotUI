"use client";

import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox";
import { CheckboxGroup } from "@/registry/ui/checkbox-group";
import { FieldGroup, Label } from "@/registry/ui/field";

interface CheckboxGroupPlaygroundProps {
	label?: string;
	isDisabled?: boolean;
	isReadOnly?: boolean;
	isInvalid?: boolean;
	orientation?: "horizontal" | "vertical";
}

export function CheckboxGroupPlayground({ label = "Select frameworks", ...props }: CheckboxGroupPlaygroundProps) {
	return (
		<CheckboxGroup defaultValue={["react"]} {...props}>
			{label && <Label>{label}</Label>}
			<FieldGroup>
				<Checkbox value="react">
					<CheckboxControl />
					<Label>React</Label>
				</Checkbox>
				<Checkbox value="vue">
					<CheckboxControl />
					<Label>Vue</Label>
				</Checkbox>
				<Checkbox value="angular">
					<CheckboxControl />
					<Label>Angular</Label>
				</Checkbox>
			</FieldGroup>
		</CheckboxGroup>
	);
}
