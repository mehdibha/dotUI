"use client";

import { ColorField } from "@dotui/registry/ui/color-field";
import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";

export default function Demo() {
	return (
		<ColorField>
			<Label>Color</Label>
			<Input />
		</ColorField>
	);
}
