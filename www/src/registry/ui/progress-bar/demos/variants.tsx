import { Label } from "@/registry/ui/field";
import { ProgressBar, ProgressBarControl } from "@/registry/ui/progress-bar";

const variants = ["primary", "success", "accent", "danger", "warning"] as const;

export default function Demo() {
	return (
		<div className="space-y-4">
			{variants.map((variant) => (
				<ProgressBar key={variant} value={75}>
					<Label>{variant}</Label>
					<ProgressBarControl variant={variant} />
				</ProgressBar>
			))}
		</div>
	);
}
