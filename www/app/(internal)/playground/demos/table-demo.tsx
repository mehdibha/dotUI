"use client";

import { useDragAndDrop } from "react-aria-components";
import { useAsyncList, useListData } from "react-stately";

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@dotui/registry/ui/table";

const users = [
	{ id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
	{ id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
	{ id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User" },
	{ id: 4, name: "Alice Brown", email: "alice@example.com", role: "Editor" },
	{ id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "User" },
];

export function TableDemo() {
	return (
		<div className="grid w-full grid-cols-2 gap-6">
			{/* Basic table */}
			<div className="col-span-2">
				<Table>
					<TableHeader>
						<TableColumn isRowHeader>Name</TableColumn>
						<TableColumn>Email</TableColumn>
						<TableColumn>Role</TableColumn>
					</TableHeader>
					<TableBody items={users}>
						{(user) => (
							<TableRow key={user.id}>
								<TableCell>{user.name}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>{user.role}</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Table with selection */}
			<Table aria-label="Users" selectionMode="single">
				<TableHeader>
					<TableColumn isRowHeader>Name</TableColumn>
					<TableColumn>Email</TableColumn>
					<TableColumn>Role</TableColumn>
				</TableHeader>
				<TableBody items={users}>
					{(user) => (
						<TableRow key={user.id}>
							<TableCell>{user.name}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>{user.role}</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			<Table aria-label="Users" selectionMode="single">
				<TableHeader>
					<TableColumn isRowHeader>Name</TableColumn>
					<TableColumn>Email</TableColumn>
					<TableColumn>Role</TableColumn>
				</TableHeader>
				<TableBody items={users}>
					{(user) => (
						<TableRow key={user.id} isDisabled={user.id === 2 || user.id === 4}>
							<TableCell>{user.name}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>{user.role}</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			<AsyncTable />

			<Table aria-label="Users" selectionMode="single">
				<TableHeader>
					<TableColumn isRowHeader>Name</TableColumn>
					<TableColumn>Email</TableColumn>
					<TableColumn>Role</TableColumn>
				</TableHeader>
				<TableBody items={[]}></TableBody>
			</Table>

			<AsyncSortTable />

			<Table resizable>
				<TableHeader>
					<TableColumn isRowHeader allowsResizing>
						Name
					</TableColumn>
					<TableColumn allowsResizing>Email</TableColumn>
					<TableColumn allowsResizing>Role</TableColumn>
				</TableHeader>
				<TableBody items={users}>
					{(user) => (
						<TableRow key={user.id}>
							<TableCell>{user.name}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>{user.role}</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

interface Character {
	name: string;
	height: number;
	mass: number;
	birth_year: number;
}

const AsyncTable = () => {
	const list = useAsyncList<Character>({
		async load({ signal, cursor }) {
			if (cursor) {
				cursor = cursor.replace(/^http:\/\//i, "https://");
			}
			const res = await fetch(cursor || "https://swapi.py4e.com/api/people/?search=", { signal });
			const json = await res.json();
			return {
				items: json.results,
				cursor: json.next,
			};
		},
	});

	return (
		<Table aria-label="Users" selectionMode="single" className="h-[223px]">
			<TableHeader>
				<TableColumn isRowHeader>Name</TableColumn>
				<TableColumn>Birth Year</TableColumn>
				<TableColumn>Height</TableColumn>
				<TableColumn>Mass</TableColumn>
			</TableHeader>
			<TableBody items={list.items} isLoading={list.isLoading} onLoadMore={list.loadMore}>
				{(c) => (
					<TableRow id={c.name}>
						<TableCell>{c.name}</TableCell>
						<TableCell>{c.birth_year}</TableCell>
						<TableCell>{c.height}</TableCell>
						<TableCell>{c.mass}</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};

function AsyncSortTable() {
	const list = useAsyncList<Character>({
		async load({ signal }) {
			const res = await fetch(`https://swapi.py4e.com/api/people/?search`, {
				signal,
			});
			const json = await res.json();
			return {
				items: json.results,
			};
		},
		async sort({ items, sortDescriptor }) {
			return {
				items: items.sort((a, b) => {
					const first = a[sortDescriptor.column as keyof Character];
					const second = b[sortDescriptor.column as keyof Character];
					let cmp = (parseInt(first as string, 10) || first) < (parseInt(second as string, 10) || second) ? -1 : 1;
					if (sortDescriptor.direction === "descending") {
						cmp *= -1;
					}
					return cmp;
				}),
			};
		},
	});

	return (
		<Table
			aria-label="Example table with client side sorting"
			sortDescriptor={list.sortDescriptor}
			onSortChange={list.sort}
			className="h-[223px]"
		>
			<TableHeader>
				<TableColumn id="name" isRowHeader allowsSorting>
					Name
				</TableColumn>
				<TableColumn id="height" allowsSorting>
					Height
				</TableColumn>
				<TableColumn id="mass" allowsSorting>
					Mass
				</TableColumn>
				<TableColumn id="birth_year" allowsSorting>
					Birth Year
				</TableColumn>
			</TableHeader>
			<TableBody items={list.items}>
				{(item) => (
					<TableRow id={item.name}>
						<TableCell>{item.name}</TableCell>
						<TableCell>{item.height}</TableCell>
						<TableCell>{item.mass}</TableCell>
						<TableCell>{item.birth_year}</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}

interface FileItem {
	id: number;
	name: string;
	date: string;
	type: string;
}

const _ReordableTable = () => {
	const list = useListData({
		initialItems: [
			{ id: 1, name: "Games", date: "6/7/2020", type: "File folder" },
			{ id: 2, name: "Program Files", date: "4/7/2021", type: "File folder" },
			{ id: 3, name: "bootmgr", date: "11/20/2010", type: "System file" },
			{ id: 4, name: "log.txt", date: "1/18/2016", type: "Text Document" },
		],
	});

	const { dragAndDropHooks } = useDragAndDrop<FileItem>({
		getItems: (_keys, items) =>
			items.map((item) => ({
				"text/plain": item.name,
			})),
		onReorder(e) {
			if (e.target.dropPosition === "before") {
				list.moveBefore(e.target.key, e.keys);
			} else if (e.target.dropPosition === "after") {
				list.moveAfter(e.target.key, e.keys);
			}
		},
	});

	return (
		<Table dragAndDropHooks={dragAndDropHooks}>
			<TableHeader>
				<TableColumn isRowHeader>Name</TableColumn>
				<TableColumn>Date</TableColumn>
				<TableColumn>Type</TableColumn>
			</TableHeader>
			<TableBody items={list.items}>
				{(item) => (
					<TableRow key={item.id}>
						<TableCell>{item.name}</TableCell>
						<TableCell>{item.date}</TableCell>
						<TableCell>{item.type}</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};
