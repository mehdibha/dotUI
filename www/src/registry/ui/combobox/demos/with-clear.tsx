"use client";

import { useRef, useState } from "react";
import { ChevronDownIcon, XIcon } from "lucide-react";
import type { Key } from "react-aria-components/ComboBox";

import { Button } from "@/registry/ui/button";
import { Combobox } from "@/registry/ui/combobox";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"];

export default function Demo() {
	const [value, setValue] = useState<Key | null>("Next.js");
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<Combobox aria-label="framework" menuTrigger="input" value={value} onChange={(key) => setValue(key)}>
			<InputGroup>
				<Input ref={inputRef} placeholder="Select a framework" />
				<InputGroupAddon>
					{value ? (
						<Button
							slot={null}
							variant="quiet"
							isIconOnly
							onPress={() => {
								setValue(null);
								inputRef.current?.focus();
							}}
						>
							<XIcon />
						</Button>
					) : (
						<Button variant="quiet" isIconOnly>
							<ChevronDownIcon />
						</Button>
					)}
				</InputGroupAddon>
			</InputGroup>
			<Popover>
				<ListBox items={frameworks.map((id) => ({ id }))}>
					{(item) => <ListBoxItem id={item.id}>{item.id}</ListBoxItem>}
				</ListBox>
			</Popover>
		</Combobox>
	);
}
