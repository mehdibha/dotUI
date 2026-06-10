import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Combobox } from "@/registry/ui/combobox";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";

export default function Demo() {
	return (
		<Combobox isRequired aria-label="Country">
			<InputGroup>
				<Input />
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
					<ListBoxItem>Spain</ListBoxItem>
					<ListBoxItem>Tunisia</ListBoxItem>
					<ListBoxItem>United states</ListBoxItem>
					<ListBoxItem>United Kingdom</ListBoxItem>
				</ListBox>
			</Popover>
		</Combobox>
	);
}
