import { Button } from "@/registry/ui/button";
import { InputGroup, InputGroupAddon, TextArea } from "@/registry/ui/input";

export default function Demo() {
	return (
		<InputGroup orientation="vertical">
			<TextArea placeholder="Write a comment..." />
			<InputGroupAddon>
				<span className="text-xs">Markdown supported</span>
				<Button size="sm" variant="primary">
					Comment
				</Button>
			</InputGroupAddon>
		</InputGroup>
	);
}
