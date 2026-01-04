"use client";

import { useAsyncList } from "react-stately";

import { Select, SelectContent, SelectItem, SelectTrigger } from "@dotui/registry/ui/select";

interface Character {
	name: string;
}

export default function Demo() {
	const list = useAsyncList<Character>({
		async load({ signal }) {
			const res = await fetch(`https://pokeapi.co/api/v2/pokemon`, { signal });
			const json = (await res.json()) as { results: Character[] };
			return {
				items: json.results,
			};
		},
	});

	return (
		<Select aria-label="Pokemon">
			<SelectTrigger />
			<SelectContent isLoading={list.isLoading} items={list.items}>
				{(item) => <SelectItem id={item.name}>{item.name}</SelectItem>}
			</SelectContent>
		</Select>
	);
}
