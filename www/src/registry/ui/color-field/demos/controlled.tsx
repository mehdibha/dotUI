"use client";

import React from "react";

import { type Color, parseColor } from "react-aria-components/ColorField";

import { ColorField } from "@/registry/ui/color-field";
import { Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";

export default function Demo() {
	const [color, setColor] = React.useState<Color | null>(parseColor("#7f007f"));

	return (
		<div className="flex w-full flex-col items-center gap-4">
			<ColorField value={color} onChange={setColor}>
				<Label>Color</Label>
				<Input />
			</ColorField>
			<p className="text-sm text-fg-muted">Current color value: {color?.toString("hex")}</p>
		</div>
	);
}
