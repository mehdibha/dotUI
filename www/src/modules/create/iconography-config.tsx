import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";
import { Select, SelectValue } from "@/registry/ui/select";

const iconLibraries = [
	{ value: "lucide", name: "Lucide" },
	{ value: "remix", name: "Remix Icons" },
	{ value: "tabler", name: "Tabler Icons" },
	{ value: "hugeicons", name: "Huge Icons" },
];

/** Direct icon-library dropdown — used inline on the customizer home. */
export function IconographyControls() {
	return (
		<Select className="w-full" defaultSelectedKey="lucide" aria-label="Icon library">
			<Button size="sm" className="w-full">
				<SelectValue />
				<ChevronDownIcon data-icon-end="" />
			</Button>
			<Popover>
				<ListBox>
					{iconLibraries.map((lib) => (
						<ListBoxItem key={lib.value} id={lib.value}>
							{lib.name}
						</ListBoxItem>
					))}
				</ListBox>
			</Popover>
		</Select>
	);
}
