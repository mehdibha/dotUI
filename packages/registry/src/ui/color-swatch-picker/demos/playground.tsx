"use client";

import { ColorSwatchPicker, ColorSwatchPickerItem } from "@dotui/registry/ui/color-swatch-picker";

export function ColorSwatchPickerPlayground() {
	return (
		<ColorSwatchPicker>
			<ColorSwatchPickerItem color="#ff0000" />
			<ColorSwatchPickerItem color="#00ff00" />
			<ColorSwatchPickerItem color="#0000ff" />
			<ColorSwatchPickerItem color="#ffff00" />
			<ColorSwatchPickerItem color="#ff00ff" />
			<ColorSwatchPickerItem color="#00ffff" />
		</ColorSwatchPicker>
	);
}
