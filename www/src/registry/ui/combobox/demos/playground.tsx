"use client";

import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Combobox } from "@/registry/ui/combobox";
import { Label } from "@/registry/ui/field";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";

interface ComboboxPlaygroundProps {
	label?: string;
	placeholder?: string;
	isDisabled?: boolean;
	isInvalid?: boolean;
}

export function ComboboxPlayground({
	label = "Country",
	placeholder = "Search countries...",
	...props
}: ComboboxPlaygroundProps) {
	return (
		<Combobox {...props}>
			{label && <Label>{label}</Label>}
			<InputGroup>
				<Input placeholder={placeholder} />
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
