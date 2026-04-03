import { useState } from "react";

import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { ListBox, ListBoxItem } from "@dotui/registry/ui/list-box";
import { Popover } from "@dotui/registry/ui/popover";
import { SearchField } from "@dotui/registry/ui/search-field";
import { Select, SelectTrigger } from "@dotui/registry/ui/select";

const fontOptions = [
	{ name: "Inter", value: "inter", className: "font-sans" },
	{ name: "Geist", value: "geist", className: "font-sans" },
	{ name: "Josefin Sans", value: "josefin", className: "font-sans" },
	{ name: "DM Sans", value: "dm-sans", className: "font-sans" },
	{ name: "Space Grotesk", value: "space-grotesk", className: "font-sans" },
	{ name: "Playfair Display", value: "playfair", className: "font-serif" },
];

export function TypographyConfig() {
	return (
		<div className="flex flex-col gap-3">
			<FontPicker label="Heading font" />
			<FontPicker label="Body font" />
		</div>
	);
}

const FontPicker = ({ label }: { label: string }) => {
	return (
		<Select className="w-full" defaultValue="geist">
			<Label>{label}</Label>
			<SelectTrigger className="w-full" />
			<Popover>
				<SearchField autoFocus className="w-full p-2">
					<Input className="w-full" />
				</SearchField>
				<ListBox>
					{fontOptions.map((option) => (
						<ListBoxItem key={option.value} id={option.value}>
							{option.name}
						</ListBoxItem>
					))}
				</ListBox>
			</Popover>
		</Select>
	);
};
