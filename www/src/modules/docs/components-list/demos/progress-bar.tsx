import { Label } from "@/registry/ui/field";
import { ProgressBar, ProgressBarControl, ProgressBarOutput } from "@/registry/ui/progress-bar";

export function ProgressBarDemo() {
	return (
		<ProgressBar value={66} valueLabel="66%" className="w-44">
			<Label>Uploading…</Label>
			<ProgressBarOutput />
			<ProgressBarControl />
		</ProgressBar>
	);
}
