"use client";

import { Label } from "@dotui/registry/ui/field";
import { ProgressBar, ProgressBarControl, ProgressBarValueLabel } from "@dotui/registry/ui/progress-bar";

export default function Demo() {
	return (
		<ProgressBar value={30} valueLabel="30 of 100 dogs">
			<Label>Feeding…</Label>
			<ProgressBarValueLabel />
			<ProgressBarControl />
		</ProgressBar>
	);
}
