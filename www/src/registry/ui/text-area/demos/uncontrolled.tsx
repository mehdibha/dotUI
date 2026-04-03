import { Label } from "@/registry/ui/field";
import { TextArea } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";

export default function Demo() {
	return (
		<TextField defaultValue="Roses are red, violets are blue.">
			<Label>Essay</Label>
			<TextArea />
		</TextField>
	);
}
