"use client";

import { useAsyncList } from "react-stately";

import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Loader } from "@/registry/ui/loader";

interface Pokemon {
	name: string;
}

export default function Demo() {
	const list = useAsyncList<Pokemon>({
		async load({ signal, cursor }) {
			const res = await fetch(cursor || `https://pokeapi.co/api/v2/pokemon`, { signal });
			const json = await res.json();

			return {
				items: json.results,
				cursor: json.next,
			};
		},
	});

	return (
		<div className="rounded-md border bg-card shadow-sm">
			<ListBox
				aria-label="Pick a Pokemon"
				className="max-h-64 overflow-auto overscroll-none"
				items={list.items}
				isLoading={list.loadingState === "loadingMore"}
				onLoadMore={list.loadMore}
				renderEmptyState={() => (
					<div className="flex items-center justify-center py-4">
						<Loader />
					</div>
				)}
				selectionMode="single"
			>
				{(item) => (
					<ListBoxItem id={item.name} className="capitalize">
						{item.name}
					</ListBoxItem>
				)}
			</ListBox>
		</div>
	);
}
