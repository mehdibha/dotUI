import { Label } from "@/registry/ui/field";
import { ProgressBar, ProgressBarControl, ProgressBarOutput } from "@/registry/ui/progress-bar";

export default function Demo() {
	return (
		<ProgressBar value={56} className="w-full">
			<div className="flex items-center justify-between gap-2">
				<Label>Upload progress</Label>
				<ProgressBarOutput />
			</div>
			<ProgressBarControl />
		</ProgressBar>
	);
}
