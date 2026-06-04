"use client";

import { cn } from "@/registry/lib/utils";
import { Button } from "@/registry/ui/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/registry/ui/card";
import { Table, TableBody, TableCell, TableColumn, TableContainer, TableHeader, TableRow } from "@/registry/ui/table";

const transactions: Array<{
	id: string;
	merchant: string;
	date: string;
	amount: number;
}> = [
	{ id: "t1", merchant: "Spotify", date: "Jun 2", amount: -11.99 },
	{ id: "t2", merchant: "Acme Payroll", date: "Jun 1", amount: 3200.0 },
	{ id: "t3", merchant: "Whole Foods", date: "May 30", amount: -86.42 },
	{ id: "t4", merchant: "Uber", date: "May 28", amount: -18.5 },
];

const formatAmount = (amount: number) =>
	new Intl.NumberFormat("en-US", {
		currency: "USD",
		signDisplay: "always",
		style: "currency",
	}).format(amount);

export function Transactions({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<Card className={cn(className)} {...props}>
			<CardHeader>
				<CardTitle>Recent transactions</CardTitle>
				<CardAction>
					<Button variant="quiet" size="sm">
						View all
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<TableContainer>
					<Table aria-label="Recent transactions">
						<TableHeader>
							<TableColumn isRowHeader>Merchant</TableColumn>
							<TableColumn>Date</TableColumn>
							<TableColumn className="text-right">Amount</TableColumn>
						</TableHeader>
						<TableBody>
							{transactions.map((transaction) => (
								<TableRow key={transaction.id}>
									<TableCell className="min-w-0 truncate font-medium">{transaction.merchant}</TableCell>
									<TableCell className="whitespace-nowrap text-fg-muted">{transaction.date}</TableCell>
									<TableCell
										className={cn(
											"text-right whitespace-nowrap tabular-nums",
											transaction.amount > 0 ? "text-fg-success" : "text-fg",
										)}
									>
										{formatAmount(transaction.amount)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</CardContent>
			<CardFooter className="justify-between">
				<p className="text-sm text-fg-muted">4 transactions</p>
				<p className="text-sm font-medium tabular-nums">Balance $3,083.09</p>
			</CardFooter>
		</Card>
	);
}
