import { ProgressBar, ProgressBarControl } from "@/registry/ui/progress-bar";

export function ProgressBarDemo() {
	return (
		<ProgressBar aria-label="Loading" value={66} className="w-64">
			<ProgressBarControl />
		</ProgressBar>
	);
}
