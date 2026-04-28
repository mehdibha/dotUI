import { SearchIcon, XIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { SearchField } from "@/registry/ui/search-field";

export function SearchFieldDemo() {
	return (
		<SearchField aria-label="Search" className="w-full">
			<InputGroup className="w-full">
				<InputGroupAddon>
					<SearchIcon />
				</InputGroupAddon>
				<Input placeholder="Search..." />
				<InputGroupAddon>
					<Button variant="quiet" isIconOnly className="rounded-full">
						<XIcon />
					</Button>
				</InputGroupAddon>
			</InputGroup>
		</SearchField>
	);
}
