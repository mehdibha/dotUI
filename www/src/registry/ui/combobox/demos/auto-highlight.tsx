import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Combobox } from "@/registry/ui/combobox";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"];

export default function Demo() {
	return (
		<Combobox aria-label="framework" defaultValue="Next.js">
			<InputGroup>
				<Input placeholder="Select a framework" />
				<InputGroupAddon>
					<Button variant="quiet" isIconOnly>
						<ChevronDownIcon />
					</Button>
				</InputGroupAddon>
			</InputGroup>
			<Popover>
				<ListBox items={frameworks.map((id) => ({ id }))}>{(item) => <ListBoxItem id={item.id}>{item.id}</ListBoxItem>}</ListBox>
			</Popover>
		</Combobox>
	);
}
