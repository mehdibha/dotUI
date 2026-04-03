"use client";

import { Label } from "@/registry/ui/field";
import { ProgressBar, ProgressBarControl, ProgressBarValueLabel } from "@/registry/ui/progress-bar";

export default function Demo() {
	return (
		<ProgressBar formatOptions={{ style: "currency", currency: "JPY" }} value={60}>
			<Label>Sending…</Label>
			<ProgressBarValueLabel />
			<ProgressBarControl />
		</ProgressBar>
	);
}
