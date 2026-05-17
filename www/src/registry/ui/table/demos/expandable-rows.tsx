"use client";

import { Table, TableContainer, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@/registry/ui/table";

export default function Demo() {
	return (
		<TableContainer>
			<Table aria-label="Project files" treeColumn="name" defaultExpandedKeys={["documents", "project"]}>
				<TableHeader>
					<TableColumn id="name" isRowHeader>
						Name
					</TableColumn>
					<TableColumn id="type">Type</TableColumn>
					<TableColumn id="date">Date Modified</TableColumn>
				</TableHeader>
				<TableBody>
					<TableRow id="documents">
						<TableCell>Documents</TableCell>
						<TableCell>Folder</TableCell>
						<TableCell>10/20/2025</TableCell>
						<TableRow id="project">
							<TableCell>Project</TableCell>
							<TableCell>Folder</TableCell>
							<TableCell>8/2/2025</TableCell>
							<TableRow id="weekly-report">
								<TableCell>Weekly Report</TableCell>
								<TableCell>PDF Document</TableCell>
								<TableCell>7/10/2025</TableCell>
							</TableRow>
							<TableRow id="budget">
								<TableCell>Budget</TableCell>
								<TableCell>Spreadsheet</TableCell>
								<TableCell>8/20/2025</TableCell>
							</TableRow>
						</TableRow>
					</TableRow>
					<TableRow id="photos">
						<TableCell>Photos</TableCell>
						<TableCell>Folder</TableCell>
						<TableCell>2/3/2026</TableCell>
						<TableRow id="hero-image">
							<TableCell>Hero Image</TableCell>
							<TableCell>PNG Image</TableCell>
							<TableCell>1/23/2026</TableCell>
						</TableRow>
						<TableRow id="team-photo">
							<TableCell>Team Photo</TableCell>
							<TableCell>JPEG Image</TableCell>
							<TableCell>2/3/2026</TableCell>
						</TableRow>
					</TableRow>
					<TableRow id="proposal">
						<TableCell>2026 Proposal</TableCell>
						<TableCell>PDF Document</TableCell>
						<TableCell>4/14/2026</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
}
