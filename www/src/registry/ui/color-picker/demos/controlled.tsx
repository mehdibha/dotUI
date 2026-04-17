"use client";

import React from "react";
import * as ColorAreaPrimitives from "react-aria-components/ColorArea";

import { ColorEditor } from "@/registry/ui/color-editor";
import { ColorPicker, ColorPickerContent, ColorPickerTrigger } from "@/registry/ui/color-picker";

export default function Demo() {
	const [value, setValue] = React.useState<ColorAreaPrimitives.Color>(
		ColorAreaPrimitives.parseColor("hsl(26, 33%, 78%)"),
	);

	return (
		<ColorPicker value={value} onChange={setValue}>
			<ColorPickerTrigger />
			<ColorPickerContent>
				<ColorEditor />
			</ColorPickerContent>
		</ColorPicker>
	);
}
