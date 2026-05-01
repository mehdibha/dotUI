import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Combobox } from "@/registry/ui/combobox";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";

const placements = ["top", "bottom", "left", "right", "start", "end"] as const;

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"];

export default function Demo() {
	return (
		<div className="flex flex-wrap justify-center gap-2">
			{placements.map((placement) => (
				<Combobox key={placement} aria-label={`framework ${placement}`}>
					<InputGroup className="w-32">
						<Input placeholder={placement} />
						<InputGroupAddon>
							<Button variant="quiet" isIconOnly>
								<ChevronDownIcon />
							</Button>
						</InputGroupAddon>
					</InputGroup>
					<Popover placement={placement}>
						<ListBox>
							{frameworks.map((framework) => (
								<ListBoxItem key={framework}>{framework}</ListBoxItem>
							))}
						</ListBox>
					</Popover>
				</Combobox>
			))}
		</div>
	);
}
