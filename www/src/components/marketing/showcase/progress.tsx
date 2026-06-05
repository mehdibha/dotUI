"use client";

import { cn } from "@/registry/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/ui/card";
import { Label } from "@/registry/ui/field";
import { ProgressBar, ProgressBarControl, ProgressBarFill, ProgressBarOutput } from "@/registry/ui/progress-bar";

const steps = [
	{ label: "Uploading assets", value: 82, className: "bg-primary" },
	{ label: "Optimizing images", value: 64, className: "bg-accent" },
	{ label: "Running tests", value: 45, className: "bg-success" },
];

export function Progress({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<Card className={cn(className)} {...props}>
			<CardHeader>
				<CardTitle>Deployment</CardTitle>
				<CardDescription>Shipping your latest changes.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-5">
				{steps.map((step) => (
					<ProgressBar key={step.label} aria-label={step.label} value={step.value} className="w-full">
						<div className="flex items-center justify-between gap-2">
							<Label>{step.label}</Label>
							<ProgressBarOutput />
						</div>
						<ProgressBarControl>
							<ProgressBarFill className={step.className} />
						</ProgressBarControl>
					</ProgressBar>
				))}
				<ProgressBar aria-label="Deploying" isIndeterminate className="w-full">
					<Label>Deploying…</Label>
					<ProgressBarControl />
				</ProgressBar>
			</CardContent>
		</Card>
	);
}
