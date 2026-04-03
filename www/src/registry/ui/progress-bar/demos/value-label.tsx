"use client";

import { Label } from "@/registry/ui/field";
import { ProgressBar, ProgressBarControl, ProgressBarValueLabel } from "@/registry/ui/progress-bar";

export default function Demo() {
	return (
		<ProgressBar aria-label="Loading" value={75}>
			<div className="flex justify-between gap-2">
				<Label>Loading</Label>
				<ProgressBarValueLabel />
			</div>
			<ProgressBarControl />
		</ProgressBar>
	);
}
