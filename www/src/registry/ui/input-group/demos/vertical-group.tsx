import { Button } from "@/registry/ui/button";
import { InputGroup, InputGroupAddon, TextArea } from "@/registry/ui/input";

export default function Demo() {
	return (
		<InputGroup>
			<TextArea placeholder="Write a comment..." />
			<InputGroupAddon>
				<Button size="sm" variant="primary" className="ml-auto">
					Comment
				</Button>
			</InputGroupAddon>
		</InputGroup>
	);
}
