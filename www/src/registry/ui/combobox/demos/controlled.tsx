"use client";

import React from "react";
import { ChevronDownIcon } from "lucide-react";
import type * as MenuPrimitives from "react-aria-components/Menu";

import { Button } from "@/registry/ui/button";
import { Combobox } from "@/registry/ui/combobox";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";

export default function Demo() {
	const [country, setCountry] = React.useState<MenuPrimitives.Key | null>("tn");
	return (
		<div className="flex flex-col items-center gap-6">
			<Combobox aria-label="country" selectedKey={country} onSelectionChange={setCountry}>
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
						<ListBoxItem id="ca">Canada</ListBoxItem>
						<ListBoxItem id="fr">France</ListBoxItem>
						<ListBoxItem id="de">Germany</ListBoxItem>
						<ListBoxItem id="es">Spain</ListBoxItem>
						<ListBoxItem id="tn">Tunisia</ListBoxItem>
						<ListBoxItem id="us">United States</ListBoxItem>
						<ListBoxItem id="uk">United Kingdom</ListBoxItem>
					</ListBox>
				</Popover>
			</Combobox>
			<p className="text-fg-muted text-sm">
				{country ? (
					<>
						You selected: <span className="font-bold text-fg">{country}</span>
					</>
				) : (
					"Select a country."
				)}
			</p>
		</div>
	);
}
