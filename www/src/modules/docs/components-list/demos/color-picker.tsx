import { ColorEditor } from "@dotui/registry/ui/color-editor";
import { ColorPicker, ColorPickerContent, ColorPickerTrigger } from "@dotui/registry/ui/color-picker";

export function ColorPickerDemo() {
	return (
		<ColorPicker defaultValue="#EBEBEB">
			<ColorPickerTrigger size="lg" />
			<ColorPickerContent>
				<ColorEditor />
			</ColorPickerContent>
		</ColorPicker>
	);
}
