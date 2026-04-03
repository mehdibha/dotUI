import { SearchIcon, XIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Input, InputAddon, InputGroup } from "@/registry/ui/input";
import { SearchField } from "@/registry/ui/search-field";

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
