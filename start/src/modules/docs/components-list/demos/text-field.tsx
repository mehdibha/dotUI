import { Description, Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";

export function TextFieldDemo() {
	return (
		<TextField className="w-full">
			<Label>Email</Label>
			<Input placeholder="hello@example.com" />
			<Description>Enter your email.</Description>
		</TextField>
	);
}
