import { ColorField } from "@dotui/registry/ui/color-field";
import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";

export function ColorFieldDemo() {
	return (
		<ColorField defaultValue="#7f007f">
			<Label>Color</Label>
			<Input className="w-36" />
		</ColorField>
	);
}
