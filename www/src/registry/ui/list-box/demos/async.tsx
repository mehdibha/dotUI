"use client";

import { useAsyncList } from "react-stately";

import { ListBox, ListBoxItem } from "@/registry/ui/list-box";

interface Pokemon {
	name: string;
}

export default function Demo() {
	const list = useAsyncList<Pokemon>({
		async load({ signal }) {
			const res = await fetch(`https://pokeapi.co/api/v2/pokemon`, { signal });
			const json = (await res.json()) as { results: Pokemon[] };
			return { items: json.results };
		},
	});

	return (
		<div className="rounded-md border bg-card shadow-sm">
			<ListBox aria-label="Pick a Pokemon" items={list.items} isLoading={list.isLoading} selectionMode="single">
				{(item) => (
					<ListBoxItem id={item.name} className="capitalize">
						{item.name}
					</ListBoxItem>
				)}
			</ListBox>
		</div>
	);
}
