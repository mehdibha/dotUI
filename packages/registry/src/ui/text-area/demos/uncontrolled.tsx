import { Label } from "@dotui/registry/ui/field";
import { TextArea } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";

export default function Demo() {
	return (
		<TextField defaultValue="Roses are red, violets are blue.">
			<Label>Essay</Label>
			<TextArea />
		</TextField>
	);
}
