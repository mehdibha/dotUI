import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Combobox } from "@/registry/ui/combobox";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";

const placements = [
	{
		placement: "top",
		icon: <ChevronUpIcon />,
	},
	{
		placement: "bottom",
		icon: <ChevronDownIcon />,
	},
	{
		placement: "left",
		icon: <ChevronLeftIcon />,
	},
	{
		placement: "right",
		icon: <ChevronRightIcon />,
	},
] as const;

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"];

export default function Demo() {
	return (
		<div className="flex flex-wrap justify-center gap-2">
			{placements.map((placement) => (
				<Combobox key={placement.placement} aria-label={`framework ${placement.placement}`}>
					<InputGroup className="w-32">
						<Input placeholder={placement.placement} />
						<InputGroupAddon>
							<Button variant="quiet" isIconOnly>
								{placement.icon}
							</Button>
						</InputGroupAddon>
					</InputGroup>
					<Popover placement={placement.placement}>
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
