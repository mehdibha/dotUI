import { Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";

export default function Demo() {
	return (
		<TextField defaultValue="Ada">
			<Label>Name</Label>
			<Input />
		</TextField>
	);
}
