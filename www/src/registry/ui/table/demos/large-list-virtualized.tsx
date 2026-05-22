"use client";

import { Badge } from "@/registry/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableContainer,
	TableHeader,
	TableRow,
	TableVirtualizer,
} from "@/registry/ui/table";

const statuses = ["Ready", "Building", "Queued", "Error"] as const;
const statusVariant = {
	Building: "info",
	Error: "danger",
	Queued: "warning",
	Ready: "success",
} as const;

const services = ["web", "api", "worker", "cron", "admin", "storefront"] as const;
const regions = ["iad1", "sfo1", "fra1", "hnd1"] as const;

const columns: Column[] = [
	{ id: "deployment", name: "Deployment", isRowHeader: true },
	{ id: "service", name: "Service" },
	{ id: "status", name: "Status" },
	{ id: "region", name: "Region" },
	{ id: "duration", name: "Duration" },
];

const deployments: Deployment[] = Array.from({ length: 2500 }, (_, index) => {
	const id = index + 1;

	return {
		id: `deploy-${id}`,
		deployment: `release-${String(id).padStart(4, "0")}`,
		duration: `${(index % 9) + 1}m ${String((index * 7) % 60).padStart(2, "0")}s`,
		region: regions[index % regions.length] ?? regions[0],
		service: services[index % services.length] ?? services[0],
		status: statuses[index % statuses.length] ?? statuses[0],
	};
});

export default function Demo() {
	return (
		<TableContainer className="h-80" resizable>
			<TableVirtualizer>
				<Table aria-label="Virtualized deployments" selectionMode="multiple">
					<TableHeader columns={columns}>
						{(column) => (
							<TableColumn id={column.id} isRowHeader={column.isRowHeader}>
								{column.name}
							</TableColumn>
						)}
					</TableHeader>
					<TableBody items={deployments}>
						{(item) => (
							<TableRow columns={columns} style={{ height: "inherit", width: "inherit" }}>
								{(column) => (
									<TableCell>
										<CellValue item={item} column={column} />
									</TableCell>
								)}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableVirtualizer>
		</TableContainer>
	);
}

function CellValue({ item, column }: { item: Deployment; column: Column }) {
	if (column.id === "status") {
		return (
			<Badge appearance="subtle" variant={statusVariant[item.status]}>
				{item.status}
			</Badge>
		);
	}

	if (column.id === "deployment") {
		return <span className="font-medium">{item.deployment}</span>;
	}

	return item[column.id];
}

interface Deployment {
	id: string;
	deployment: string;
	duration: string;
	region: string;
	service: string;
	status: (typeof statuses)[number];
}

interface Column {
	id: keyof Omit<Deployment, "id">;
	name: string;
	isRowHeader?: boolean;
}
