"use client";

import { Combobox, ComboboxContent, ComboboxItem, ComboboxValue } from "@/registry/ui/combobox";
import { Label } from "@/registry/ui/field";
import { Input, InputGroup } from "@/registry/ui/input";
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
				<Input /> {/* className="min-w-20 flex-1" */}
			</InputGroup>
			<ComboboxContent items={frameworks}>
				{(item) => <ComboboxItem id={item.id}>{item.name}</ComboboxItem>}
			</ComboboxContent>
		</Combobox>
	);
}
