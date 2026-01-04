"use client";

import { ProgressBar, ProgressBarControl } from "@dotui/registry/ui/progress-bar";

export default function Demo() {
	return (
		<ProgressBar aria-label="Min and max values" minValue={50} maxValue={150} value={100}>
			<ProgressBarControl />
		</ProgressBar>
	);
}
