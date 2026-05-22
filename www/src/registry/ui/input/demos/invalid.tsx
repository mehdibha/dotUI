import { Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";

export default function Demo() {
	return (
		<TextField>
			<Label>Invalid</Label>
			<Input placeholder="Invalid input" />
		</TextField>
	);
}
