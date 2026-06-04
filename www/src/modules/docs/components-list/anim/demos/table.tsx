"use client";

import { useState } from "react";

import type { Selection } from "react-aria-components";

import { Table, TableBody, TableCell, TableColumn, TableContainer, TableHeader, TableRow } from "@/registry/ui/table";

import { AnimatedPreview } from "../animated-preview";

const rows = [
	{ id: "games", name: "Games", type: "Folder" },
	{ id: "docs", name: "Documents", type: "Folder" },
	{ id: "notes", name: "notes.txt", type: "Text" },
];

export default function Demo() {
	const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
	return (
		<AnimatedPreview
			reset={() => setSelectedKeys(new Set())}
			script={async (s) => {
				await s.wait(500);
				await s.click("games", () => setSelectedKeys(new Set(["games"])));
				await s.wait(1100);
				await s.click("notes", () => setSelectedKeys(new Set(["games", "notes"])));
				await s.wait(1400);
				await s.moveOff();
				await s.wait(600);
			}}
		>
			{(ref) => (
				<TableContainer className="w-64">
					<Table
						aria-label="Files"
						selectionMode="multiple"
						selectedKeys={selectedKeys}
						onSelectionChange={setSelectedKeys}
					>
						<TableHeader>
							<TableColumn isRowHeader>Name</TableColumn>
							<TableColumn>Type</TableColumn>
						</TableHeader>
						<TableBody>
							{rows.map((row) => (
								<TableRow key={row.id} id={row.id}>
									<TableCell>
										<span ref={ref(row.id)}>{row.name}</span>
									</TableCell>
									<TableCell>{row.type}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</AnimatedPreview>
	);
}
