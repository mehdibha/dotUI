"use client";

import { Table, TableBody, TableColumn, TableHeader } from "@dotui/registry/ui/table";

export default function Demo() {
	return (
		<div className="flex gap-8">
			<Table aria-label="Files">
				<TableHeader>
					<TableColumn id="name" isRowHeader>
						Name
					</TableColumn>
					<TableColumn id="type">Type</TableColumn>
					<TableColumn id="date">Date Modified</TableColumn>
				</TableHeader>
				<TableBody>{[]}</TableBody>
			</Table>

			<Table aria-label="Files">
				<TableHeader>
					<TableColumn id="name" isRowHeader>
						Name
					</TableColumn>
					<TableColumn id="type">Type</TableColumn>
					<TableColumn id="date">Date Modified</TableColumn>
				</TableHeader>
				<TableBody renderEmptyState={() => "Nothing here."}>{[]}</TableBody>
			</Table>
		</div>
	);
}
