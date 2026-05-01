import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Combobox } from "@/registry/ui/combobox";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";

export function ComboboxDemo() {
	return (
		<Combobox aria-label="Country" menuTrigger="focus">
			<InputGroup>
				<Input placeholder="Select country..." />
				<InputGroupAddon>
					<Button variant="quiet" isIconOnly>
						<ChevronDownIcon />
					</Button>
				</InputGroupAddon>
			</InputGroup>
			<Popover>
				<ListBox>
					<ListBoxItem>Canada</ListBoxItem>
					<ListBoxItem>France</ListBoxItem>
					<ListBoxItem>Germany</ListBoxItem>
					<ListBoxItem>Japan</ListBoxItem>
					<ListBoxItem>United Kingdom</ListBoxItem>
					<ListBoxItem>United States</ListBoxItem>
				</ListBox>
			</Popover>
		</Combobox>
	);
}
