import { Input, InputAddon, InputGroup } from "@/registry/ui/input";

export default function Demo() {
	return (
		<InputGroup>
			<InputAddon>https://</InputAddon>
			<Input placeholder="example.com" />
		</InputGroup>
	);
}
