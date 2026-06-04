"use client";

import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox";
import { CheckboxGroup } from "@/registry/ui/checkbox-group";
import { FieldGroup, Label } from "@/registry/ui/field";

export default function Demo({
	label = "Select frameworks",
	isDisabled = false,
	isReadOnly = false,
	isInvalid = false,
} = {}) {
	return (
		<CheckboxGroup defaultValue={["react"]} isDisabled={isDisabled} isReadOnly={isReadOnly} isInvalid={isInvalid}>
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
