import { Button } from "@/registry/ui/button";
import { ColorEditor } from "@/registry/ui/color-editor";
import { ColorPicker } from "@/registry/ui/color-picker";
import { DialogContent } from "@/registry/ui/dialog";
import { Popover } from "@/registry/ui/popover";

export function ColorPickerDemo() {
	return (
		<ColorPicker defaultValue="#EBEBEB">
			<Button size="lg" />
			<Popover>
				<DialogContent>
					<ColorEditor />
				</DialogContent>
			</Popover>
		</ColorPicker>
	);
}
