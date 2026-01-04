import { ColorSwatchPicker, ColorSwatchPickerItem } from "@dotui/registry/ui/color-swatch-picker";

export default function Demo() {
	return (
		<ColorSwatchPicker defaultValue="#fff">
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
