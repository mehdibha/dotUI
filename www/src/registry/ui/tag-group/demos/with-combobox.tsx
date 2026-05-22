"use client";

import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Combobox, ComboboxValue } from "@/registry/ui/combobox";
import { Label } from "@/registry/ui/field";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";
import { Tag, TagGroup, TagList } from "@/registry/ui/tag-group";

const frameworks = [
	{ id: "react", name: "React" },
	{ id: "vue", name: "Vue" },
	{ id: "svelte", name: "Svelte" },
	{ id: "solid", name: "Solid" },
	{ id: "angular", name: "Angular" },
	{ id: "qwik", name: "Qwik" },
	{ id: "preact", name: "Preact" },
	{ id: "ember", name: "Ember" },
];

type Framework = (typeof frameworks)[number];

export default function Demo() {
	return (
		<Combobox<Framework, "multiple"> selectionMode="multiple" defaultValue={["react", "vue"]}>
			<Label>Frameworks</Label>
			<InputGroup>
				<Input placeholder="Select frameworks" />
				<InputGroupAddon>
					<Button variant="quiet" isIconOnly>
						<ChevronDownIcon />
					</Button>
				</InputGroupAddon>
			</InputGroup>
			<ComboboxValue<Framework>>
				{({ selectedItems, state }) => (
					<TagGroup
						aria-label="Selected frameworks"
						onRemove={(keys) => {
							if (Array.isArray(state.value)) {
								state.setValue(state.value.filter((k) => !keys.has(k)));
							}
						}}
					>
						<TagList items={selectedItems.filter((item) => item != null)}>{(item) => <Tag>{item.name}</Tag>}</TagList>
					</TagGroup>
				)}
			</ComboboxValue>
			<Popover>
				<ListBox items={frameworks}>{(item) => <ListBoxItem id={item.id}>{item.name}</ListBoxItem>}</ListBox>
			</Popover>
		</Combobox>
	);
}
