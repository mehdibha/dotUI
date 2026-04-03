import { Input, InputAddon, InputGroup } from "@/registry/ui/input";

export function InputGroupDemo() {
	return (
		<InputGroup className="w-full">
			<InputAddon>@</InputAddon>
			<Input placeholder="username" />
		</InputGroup>
	);
}
