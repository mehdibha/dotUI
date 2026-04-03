"use client";

import { ColorEditor } from "@/registry/ui/color-editor";
import { ColorPicker, ColorPickerContent, ColorPickerTrigger } from "@/registry/ui/color-picker";

export function ColorPickerPlayground() {
	return (
		<ColorPicker defaultValue="#ff0000">
			<ColorPickerTrigger />
			<ColorPickerContent>
				<ColorEditor />
			</ColorPickerContent>
		</ColorPicker>
	);
}
