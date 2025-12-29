import { ProgressBar, ProgressBarControl } from "@dotui/registry/ui/progress-bar";

export function ProgressBarDemo() {
	return (
		<ProgressBar aria-label="Loading" value={66} className="w-64">
			<ProgressBarControl />
		</ProgressBar>
	);
}
