"use client";

import { ColorSwatchPicker, ColorSwatchPickerItem } from "@/registry/ui/color-swatch-picker";

interface ColorSwatchPickerPlaygroundProps {
	isDisabled?: boolean;
}

export function ColorSwatchPickerPlayground({ isDisabled = false }: ColorSwatchPickerPlaygroundProps) {
	return (
		<ColorSwatchPicker defaultValue="#ff0000">
			<ColorSwatchPickerItem color="#ff0000" isDisabled={isDisabled} />
			<ColorSwatchPickerItem color="#00ff00" isDisabled={isDisabled} />
			<ColorSwatchPickerItem color="#0000ff" isDisabled={isDisabled} />
			<ColorSwatchPickerItem color="#ffff00" isDisabled={isDisabled} />
			<ColorSwatchPickerItem color="#ff00ff" isDisabled={isDisabled} />
			<ColorSwatchPickerItem color="#00ffff" isDisabled={isDisabled} />
		</ColorSwatchPicker>
	);
}
