"use client";

import { Checkbox, CheckboxIndicator } from "@dotui/registry/ui/checkbox";
import { CheckboxGroup } from "@dotui/registry/ui/checkbox-group";
import { FieldGroup, Label } from "@dotui/registry/ui/field";

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
					<CheckboxIndicator />
					<Label>React</Label>
				</Checkbox>
				<Checkbox value="vue">
					<CheckboxIndicator />
					<Label>Vue</Label>
				</Checkbox>
				<Checkbox value="angular">
					<CheckboxIndicator />
					<Label>Angular</Label>
				</Checkbox>
			</FieldGroup>
		</CheckboxGroup>
	);
}
