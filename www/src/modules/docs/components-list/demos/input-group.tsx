import { Input, InputAddon, InputGroup } from "@dotui/registry/ui/input";

export function InputGroupDemo() {
	return (
		<InputGroup className="w-full">
			<InputAddon>@</InputAddon>
			<Input placeholder="username" />
		</InputGroup>
	);
}
