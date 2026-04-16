"use client";

import React from "react";
import * as ColorAreaPrimitives from "react-aria-components/ColorArea";


import { ColorSwatchPicker, ColorSwatchPickerItem } from "@/registry/ui/color-swatch-picker";

export default function Demo() {
	const [value, setValue] = React.useState<ColorAreaPrimitives.Color>(ColorAreaPrimitives.parseColor("#f80"));
	return (
		<ColorSwatchPicker defaultValue="#fff" value={value} onChange={setValue}>
			<ColorSwatchPickerItem color="#fff" />
			<ColorSwatchPickerItem color="#A00" />
			<ColorSwatchPickerItem color="#f80" />
			<ColorSwatchPickerItem color="#080" />
			<ColorSwatchPickerItem color="#08f" />
			<ColorSwatchPickerItem color="#088" />
			<ColorSwatchPickerItem color="#008" />
		</ColorSwatchPicker>
	);
}
