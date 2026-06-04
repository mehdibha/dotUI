"use client";

import { ColorField } from "@/registry/ui/color-field";
import { Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";

export default function Demo({ label = "Color", isDisabled = false, isReadOnly = false } = {}) {
	return (
		<ColorField defaultValue="#ff0000" isDisabled={isDisabled} isReadOnly={isReadOnly}>
			{label && <Label>{label}</Label>}
			<Input />
		</ColorField>
	);
}
