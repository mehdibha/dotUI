import { Input, InputAddon, InputGroup } from "@dotui/registry/ui/input";

export default function Page() {
	return (
		<InputGroup className="w-full">
			<InputAddon>@</InputAddon>
			<Input placeholder="username" />
		</InputGroup>
	);
}
