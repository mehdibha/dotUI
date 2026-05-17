"use client";

import { Badge } from "@/registry/ui/badge";
import {
	Table,
	TableContainer,
	TableBody,
	TableCaption,
	TableCell,
	TableColumn,
	TableFooter,
	TableHeader,
	TableRow,
} from "@/registry/ui/table";

const statusVariant = {
	Failed: "danger",
	Paid: "success",
	Pending: "warning",
	Unpaid: "neutral",
} as const;

type ProjectStatus = keyof typeof statusVariant;

const projects: Array<{
	budget: number;
	project: string;
	status: ProjectStatus;
	team: string;
}> = [
	{ project: "Website Redesign", status: "Paid", team: "Frontend Team", budget: 12500 },
	{ project: "Mobile App", status: "Unpaid", team: "Mobile Team", budget: 8750 },
	{ project: "API Integration", status: "Pending", team: "Backend Team", budget: 5200 },
	{ project: "Database Migration", status: "Paid", team: "DevOps Team", budget: 3800 },
	{ project: "User Dashboard", status: "Paid", team: "UX Team", budget: 7200 },
	{ project: "Security Audit", status: "Failed", team: "Security Team", budget: 2100 },
];

const formatCurrency = (amount: number) =>
	new Intl.NumberFormat("en-US", {
		currency: "USD",
		maximumFractionDigits: 0,
		style: "currency",
	}).format(amount);

export default function Demo() {
	const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);

	return (
		<TableContainer>
			<Table aria-label="Project budgets">
				<TableCaption>Active project budgets and billing status.</TableCaption>
				<TableHeader>
					<TableColumn isRowHeader>Project</TableColumn>
					<TableColumn>Status</TableColumn>
					<TableColumn>Team</TableColumn>
					<TableColumn className="text-right">Budget</TableColumn>
				</TableHeader>
				<TableBody>
					{projects.map((project) => (
						<TableRow key={project.project}>
							<TableCell className="font-medium">{project.project}</TableCell>
							<TableCell>
								<Badge appearance="subtle" variant={statusVariant[project.status]}>
									<span aria-hidden className="size-1.5 rounded-full bg-current" />
									{project.status}
								</Badge>
							</TableCell>
							<TableCell>{project.team}</TableCell>
							<TableCell className="text-right tabular-nums">{formatCurrency(project.budget)}</TableCell>
						</TableRow>
					))}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell colSpan={3}>Total Budget</TableCell>
						<TableCell className="text-right tabular-nums">{formatCurrency(totalBudget)}</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</TableContainer>
	);
}
