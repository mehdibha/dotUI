"use client";

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@dotui/registry/ui/table";

const columns: Column[] = [
	{ name: "Name", id: "name", isRowHeader: true },
	{ name: "Type", id: "type" },
	{ name: "Date Modified", id: "date" },
];

const data: Item[] = [
	{ id: 1, name: "Games", date: "6/7/2020", type: "File folder" },
	{ id: 2, name: "Program Files", date: "4/7/2021", type: "File folder" },
	{ id: 3, name: "bootmgr", date: "11/20/2010", type: "System file" },
	{ id: 4, name: "log.txt", date: "1/18/2016", type: "Text Document" },
];

export default function Demo() {
	return (
		<div className="space-y-8">
			<Table aria-label="Files" selectionMode="single">
				<TableHeader columns={columns}>
					{(column) => <TableColumn isRowHeader={column.isRowHeader}>{column.name}</TableColumn>}
				</TableHeader>
				<TableBody items={data}>
					{(item) => <TableRow columns={columns}>{(column) => <TableCell>{item[column.id]}</TableCell>}</TableRow>}
				</TableBody>
			</Table>
			<Table aria-label="Files" selectionMode="multiple">
				<TableHeader columns={columns}>
					{(column) => <TableColumn isRowHeader={column.isRowHeader}>{column.name}</TableColumn>}
				</TableHeader>
				<TableBody items={data}>
					{(item) => <TableRow columns={columns}>{(column) => <TableCell>{item[column.id]}</TableCell>}</TableRow>}
				</TableBody>
			</Table>
		</div>
	);
}

interface Item {
	id: number;
	name: string;
	date: string;
	type: string;
}

interface Column {
	id: keyof Omit<Item, "id">;
	name: string;
	isRowHeader?: boolean;
}
