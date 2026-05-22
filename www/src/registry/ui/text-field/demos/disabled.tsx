import { Input } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";

export default function Demo() {
	return (
		<TextField aria-label="Email" value="hello@example.com" isDisabled>
			<Input />
		</TextField>
	);
}
