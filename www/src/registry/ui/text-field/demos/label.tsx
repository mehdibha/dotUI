import { Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";

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
