"use client";

import React from "react";
import { parseColor } from "react-aria-components";
import type { Color } from "react-aria-components";

import { ColorEditor } from "@dotui/registry/ui/color-editor";
import { ColorPicker, ColorPickerContent, ColorPickerTrigger } from "@dotui/registry/ui/color-picker";

export default function Demo() {
	const [value, setValue] = React.useState<Color>(parseColor("hsl(26, 33%, 78%)"));

	return (
		<ColorPicker value={value} onChange={setValue}>
			<ColorPickerTrigger />
			<ColorPickerContent>
				<ColorEditor />
			</ColorPickerContent>
		</ColorPicker>
	);
}
