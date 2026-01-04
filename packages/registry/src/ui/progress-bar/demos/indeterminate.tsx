"use client";

import { ProgressBar, ProgressBarControl } from "@dotui/registry/ui/progress-bar";

export default function Demo() {
	return (
		<ProgressBar isIndeterminate aria-label="Loading">
			<ProgressBarControl />
		</ProgressBar>
	);
}
