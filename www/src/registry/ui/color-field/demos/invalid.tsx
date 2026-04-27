"use client";

import { ColorField } from "@/registry/ui/color-field";
import { FieldError, Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";

export default function Demo() {
	return (
		<ColorField isInvalid>
			<Label>Color</Label>
			<Input />
			<FieldError>Please fill out this field.</FieldError>
		</ColorField>
	);
}
