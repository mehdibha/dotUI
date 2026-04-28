import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";

export function InputGroupDemo() {
	return (
		<InputGroup className="w-full">
			<InputGroupAddon>@</InputGroupAddon>
			<Input placeholder="username" />
		</InputGroup>
	);
}
