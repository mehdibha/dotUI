"use client";

import { Collection } from "react-aria-components/Collection";
import { useAsyncList } from "react-stately";

import { Loader } from "@/registry/ui/loader";
import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableContainer,
	TableHeader,
	TableLoadMore,
	TableRow,
} from "@/registry/ui/table";

export default function Demo() {
	const list = useAsyncList<Character>({
		async load({ cursor, signal }) {
			if (cursor) {
				cursor = cursor.replace(/^http:\/\//i, "https://");
			}

			const response = await fetch(cursor || "https://swapi.py4e.com/api/people/?search=", { signal });
			const json = (await response.json()) as CharacterResponse;

			return {
				items: json.results,
				cursor: json.next ?? undefined,
			};
		},
	});

	return (
		<TableContainer className="max-h-80">
			<Table aria-label="Star Wars characters">
				<TableHeader>
					<TableColumn id="name" isRowHeader>
						Name
					</TableColumn>
					<TableColumn id="height">Height</TableColumn>
					<TableColumn id="mass">Mass</TableColumn>
					<TableColumn id="birth_year">Birth Year</TableColumn>
				</TableHeader>
				<TableBody
					renderEmptyState={() => (
						<div className="flex h-24 items-center justify-center">
							<Loader aria-label="Loading characters..." />
						</div>
					)}
				>
					<Collection items={list.items}>
						{(item) => (
							<TableRow id={item.name}>
								<TableCell>{item.name}</TableCell>
								<TableCell>{item.height}</TableCell>
								<TableCell>{item.mass}</TableCell>
								<TableCell>{item.birth_year}</TableCell>
							</TableRow>
						)}
					</Collection>
					<TableLoadMore onLoadMore={list.loadMore} isLoading={list.loadingState === "loadingMore"} />
				</TableBody>
			</Table>
		</TableContainer>
	);
}

interface Character {
	birth_year: string;
	height: string;
	mass: string;
	name: string;
}

interface CharacterResponse {
	next: string | null;
	results: Character[];
}
