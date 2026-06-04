"use client";

import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Combobox } from "@/registry/ui/combobox";
import { Label } from "@/registry/ui/field";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";

export default function Demo({
	label = "Country",
	placeholder = "Search countries...",
	isDisabled = false,
	isInvalid = false,
} = {}) {
	return (
		<Combobox isDisabled={isDisabled} isInvalid={isInvalid}>
			{label && <Label>{label}</Label>}
			<InputGroup>
				<Input data-control-target placeholder={placeholder} />
				<InputGroupAddon>
					<Button variant="quiet" isIconOnly>
						<ChevronDownIcon />
					</Button>
				</InputGroupAddon>
			</InputGroup>
			<Popover>
				<ListBox>
					<ListBoxItem id="us">United States</ListBoxItem>
					<ListBoxItem id="uk">United Kingdom</ListBoxItem>
					<ListBoxItem id="fr">France</ListBoxItem>
					<ListBoxItem id="de">Germany</ListBoxItem>
					<ListBoxItem id="jp">Japan</ListBoxItem>
				</ListBox>
			</Popover>
		</Combobox>
	);
}
