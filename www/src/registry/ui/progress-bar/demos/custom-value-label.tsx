"use client";

import { Label } from "@/registry/ui/field";
import { ProgressBar, ProgressBarControl, ProgressBarOutput } from "@/registry/ui/progress-bar";

export default function Demo() {
	return (
		<ProgressBar value={30} valueLabel="30 of 100 dogs">
			<Label>Feeding…</Label>
			<ProgressBarOutput />
			<ProgressBarControl />
		</ProgressBar>
	);
}
