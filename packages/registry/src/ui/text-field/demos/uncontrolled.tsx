import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";

export default function Demo() {
	return (
		<TextField defaultValue="Mehdi">
			<Label>Name</Label>
			<Input />
		</TextField>
	);
}
