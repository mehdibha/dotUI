"use client";

import { Label } from "@dotui/registry/ui/field";
import { ProgressBar, ProgressBarControl } from "@dotui/registry/ui/progress-bar";

interface ProgressBarPlaygroundProps {
	label?: string;
	value?: number;
	isIndeterminate?: boolean;
}

export function ProgressBarPlayground({
	label = "Loading...",
	value = 60,
	isIndeterminate = false,
}: ProgressBarPlaygroundProps) {
	return (
		<ProgressBar value={isIndeterminate ? undefined : value} isIndeterminate={isIndeterminate}>
			{label && <Label>{label}</Label>}
			<ProgressBarControl />
		</ProgressBar>
	);
}
