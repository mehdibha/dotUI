import { ColorEditor } from "@dotui/registry/ui/color-editor";
import { ColorPicker, ColorPickerContent, ColorPickerTrigger } from "@dotui/registry/ui/color-picker";
import { ColorSwatch } from "@dotui/registry/ui/color-swatch";
import { ColorSwatchPicker, ColorSwatchPickerItem } from "@dotui/registry/ui/color-swatch-picker";

export default function Demo() {
	return (
		<ColorPicker defaultValue="#5100FF">
			<ColorPickerTrigger>
				<ColorSwatch />
			</ColorPickerTrigger>
			<ColorPickerContent>
				<ColorEditor />
				<ColorSwatchPicker className="mt-2 justify-between">
					<ColorSwatchPickerItem color="#A00" />
					<ColorSwatchPickerItem color="#f80" />
					<ColorSwatchPickerItem color="#080" />
					<ColorSwatchPickerItem color="#08f" />
					<ColorSwatchPickerItem color="#008" />
					<ColorSwatchPickerItem color="#fff" />
				</ColorSwatchPicker>
			</ColorPickerContent>
		</ColorPicker>
	);
}
