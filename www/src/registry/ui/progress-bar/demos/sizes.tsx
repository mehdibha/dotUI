"use client";

import { Label } from "@/registry/ui/field";
import { ProgressBar, ProgressBarControl } from "@/registry/ui/progress-bar";

const sizes = [
	{
		label: "sm",
		className: "h-1",
	},
	{
		label: "md",
		className: "h-1.5",
	},
	{
		label: "lg",
		className: "h-2",
	},
] as const;

export default function Demo() {
	return (
		<div className="space-y-4">
			{sizes.map((size) => (
				<ProgressBar key={size.label} aria-label={`Progress size: ${size.label}`} value={75}>
					<Label>{size.label}</Label>
					<ProgressBarControl className={size.className} />
				</ProgressBar>
			))}
		</div>
	);
}
