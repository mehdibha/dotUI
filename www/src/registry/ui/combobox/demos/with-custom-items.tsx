import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Combobox } from "@/registry/ui/combobox";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { ListBox, ListBoxItem, ListBoxItemDescription, ListBoxItemLabel } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";

const countries = [
	{ code: "af", id: "afghanistan", label: "Afghanistan", continent: "Asia" },
	{ code: "ar", id: "argentina", label: "Argentina", continent: "South America" },
	{ code: "au", id: "australia", label: "Australia", continent: "Oceania" },
	{ code: "br", id: "brazil", label: "Brazil", continent: "South America" },
	{ code: "ca", id: "canada", label: "Canada", continent: "North America" },
	{ code: "fr", id: "france", label: "France", continent: "Europe" },
	{ code: "de", id: "germany", label: "Germany", continent: "Europe" },
	{ code: "in", id: "india", label: "India", continent: "Asia" },
	{ code: "jp", id: "japan", label: "Japan", continent: "Asia" },
	{ code: "tn", id: "tunisia", label: "Tunisia", continent: "Africa" },
	{ code: "us", id: "united-states", label: "United States", continent: "North America" },
	{ code: "gb", id: "united-kingdom", label: "United Kingdom", continent: "Europe" },
];

export default function Demo() {
	return (
		<Combobox aria-label="country">
			<InputGroup>
				<Input placeholder="Search countries..." />
				<InputGroupAddon>
					<Button variant="quiet" isIconOnly>
						<ChevronDownIcon />
					</Button>
				</InputGroupAddon>
			</InputGroup>
			<Popover>
				<ListBox items={countries}>
					{(item) => (
						<ListBoxItem id={item.id} textValue={item.label}>
							<ListBoxItemLabel>{item.label}</ListBoxItemLabel>
							<ListBoxItemDescription>
								{item.continent} ({item.code})
							</ListBoxItemDescription>
						</ListBoxItem>
					)}
				</ListBox>
			</Popover>
		</Combobox>
	);
}
