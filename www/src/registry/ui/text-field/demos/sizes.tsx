import { Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";

export default function Demo() {
	return (
		<div className="flex items-center gap-4">
			<TextField>
				<Label>small (sm)</Label>
				<Input size="sm" />
			</TextField>
			<TextField>
				<Label>medium (md)</Label>
				<Input size="md" />
			</TextField>
			<TextField>
				<Label>large (lg)</Label>
				<Input size="lg" />
			</TextField>
		</div>
	);
}
