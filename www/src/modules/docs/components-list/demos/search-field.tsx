import { SearchIcon, XIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Input, InputAddon, InputGroup } from "@dotui/registry/ui/input";
import { SearchField } from "@dotui/registry/ui/search-field";

export function SearchFieldDemo() {
	return (
		<SearchField aria-label="Search" className="w-full">
			<InputGroup className="w-full">
				<InputAddon>
					<SearchIcon />
				</InputAddon>
				<Input placeholder="Search..." />
				<InputAddon>
					<Button variant="quiet" className="rounded-full">
						<XIcon />
					</Button>
				</InputAddon>
			</InputGroup>
		</SearchField>
	);
}
