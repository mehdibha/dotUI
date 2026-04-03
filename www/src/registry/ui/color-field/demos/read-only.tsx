import { ColorField } from "@/registry/ui/color-field";
import { Input } from "@/registry/ui/input";

export default function Demo() {
	return (
		<ColorField aria-label="Color" isReadOnly value="#121212">
			<Input />
		</ColorField>
	);
}
