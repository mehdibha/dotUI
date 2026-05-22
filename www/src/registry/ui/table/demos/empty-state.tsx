"use client";

import { Table, TableContainer, TableBody, TableColumn, TableHeader } from "@/registry/ui/table";

export default function Demo() {
	return (
		<TableContainer>
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
		</TableContainer>
	);
}
