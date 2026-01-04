import { ColorField } from "@dotui/registry/ui/color-field";
import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";

export default function Demo() {
	return (
		<div className="space-y-4">
			<ColorField>
				<Label>Background</Label>
				<Input />
			</ColorField>
			<ColorField aria-label="Background">
				<Input placeholder="Hidden label" />
			</ColorField>
		</div>
	);
}
