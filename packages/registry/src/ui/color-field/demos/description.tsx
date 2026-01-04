"use client";

import { ColorField } from "@dotui/registry/ui/color-field";
import { Description, Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";

export default function Demo() {
	return (
		<ColorField>
			<Label>Color</Label>
			<Input />
			<Description>Enter a background color.</Description>
		</ColorField>
	);
}
