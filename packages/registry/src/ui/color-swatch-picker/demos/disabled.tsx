import { ColorSwatchPicker, ColorSwatchPickerItem } from "@dotui/registry/ui/color-swatch-picker";

export default function Demo() {
	return (
		<ColorSwatchPicker>
			<ColorSwatchPickerItem color="#fff" isDisabled />
			<ColorSwatchPickerItem color="#A00" />
			<ColorSwatchPickerItem color="#f80" isDisabled />
			<ColorSwatchPickerItem color="#080" />
			<ColorSwatchPickerItem color="#08f" isDisabled />
			<ColorSwatchPickerItem color="#088" />
			<ColorSwatchPickerItem color="#008" />
		</ColorSwatchPicker>
	);
}
