"use client";

import { cn } from "@/registry/lib/utils";
import { Button } from "@/registry/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/ui/card";
import { Label } from "@/registry/ui/field";
import { ProgressBar, ProgressBarControl, ProgressBarFill, ProgressBarOutput } from "@/registry/ui/progress-bar";

const breakdown = [
	{ label: "Documents", size: "3.1 GB", className: "bg-primary" },
	{ label: "Photos", size: "2.8 GB", className: "bg-accent" },
	{ label: "Videos", size: "2.3 GB", className: "bg-success" },
];

export function Storage({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<Card className={cn(className)} {...props}>
			<CardHeader>
				<CardTitle>Storage</CardTitle>
				<CardDescription>8.2 GB of 15 GB used</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<ProgressBar aria-label="Storage used" value={55} className="w-full">
					<div className="flex items-center justify-between gap-2">
						<Label>Usage</Label>
						<ProgressBarOutput />
					</div>
					<ProgressBarControl>
						<ProgressBarFill className="bg-primary" />
					</ProgressBarControl>
				</ProgressBar>
				<ul className="space-y-2">
					{breakdown.map((item) => (
						<li key={item.label} className="flex items-center gap-2 text-sm">
							<span className={cn("size-2 shrink-0 rounded-full", item.className)} aria-hidden="true" />
							<span className="min-w-0 flex-1 truncate">{item.label}</span>
							<span className="shrink-0 text-fg-muted tabular-nums">{item.size}</span>
						</li>
					))}
				</ul>
			</CardContent>
			<CardFooter>
				<Button variant="primary" className="w-full">
					Upgrade plan
				</Button>
			</CardFooter>
		</Card>
	);
}
