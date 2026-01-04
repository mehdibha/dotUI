import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";

export default function Demo() {
	return (
		<div className="space-y-4">
			<TextField>
				<Label>Email</Label>
				<Input />
			</TextField>
			<TextField>
				<Label>Email</Label>
				<Input />
			</TextField>
		</div>
	);
}
