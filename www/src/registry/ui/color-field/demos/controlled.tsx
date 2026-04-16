"use client";

import React from "react";
import * as ColorAreaPrimitives from "react-aria-components/ColorArea";
import * as InputPrimitives from "react-aria-components/Input";


import { ColorField } from "@/registry/ui/color-field";
import { Label } from "@/registry/ui/field";

export default function Demo() {
	const [color, setColor] = React.useState<ColorAreaPrimitives.Color | null>(ColorAreaPrimitives.parseColor("#7f007f"));

	return (
		<div className="flex flex-col items-center gap-4">
			<ColorField value={color} onChange={setColor}>
				<Label>ColorAreaPrimitives.Color</Label>
				<InputPrimitives.Input />
			</ColorField>
			<p className="text-fg-muted text-sm">Current color value: {color?.toString("hex")}</p>
		</div>
	);
}
