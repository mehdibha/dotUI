import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@dotui/registry/ui/table";

const columns = [
	{ name: "Name", id: "name", isRowHeader: true },
	{ name: "Role", id: "role" },
	{ name: "Status", id: "status" },
];

const data = [
	{ id: 1, name: "John Doe", role: "Developer", status: "Active" },
	{ id: 2, name: "Jane Smith", role: "Designer", status: "Active" },
	{ id: 3, name: "Bob Johnson", role: "Manager", status: "Away" },
];

export function TableDemo() {
	return (
		<Table aria-label="Team members">
			<TableHeader columns={columns}>
				{(column) => <TableColumn isRowHeader={column.isRowHeader}>{column.name}</TableColumn>}
			</TableHeader>
			<TableBody items={data}>
				{(item) => (
					<TableRow columns={columns}>
						<TableCell>{item.name}</TableCell>
						<TableCell>{item.role}</TableCell>
						<TableCell>{item.status}</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
